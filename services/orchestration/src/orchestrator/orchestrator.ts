import { randomUUID } from 'node:crypto';
import { OrchestrationTrigger } from '../contracts/trigger';
import { OrchestrationResult } from '../contracts/result';
import { OrchestrationAbort } from '../contracts/abort';
import { OrchestrationContext } from '../contracts/context';
import { OrchestrationCommand } from '../contracts/command';
import { OrchestrationState } from '../state/types';
import { isValidTransition } from '../state/transitions';
import { OrchestrationAttemptId, OrchestratorExecutors, OrchestrationLifecycleHooks } from './types';
import { PolicyEvaluator } from '../policy/policyEvaluator';
import { AuditEmitter, AuditSignal } from '../audit/auditTypes';

/**
 * Audit failure exception used to trigger immediate abort.
 */
class AuditFailure extends Error {
  constructor(public readonly code: 'AUD-001' | 'AUD-002', message: string) {
    super(message);
    this.name = 'AuditFailure';
  }
}

/**
 * PR-06: Audit Hook Wiring (Non-Emitting).
 * 
 * An inert, synchronous orchestration engine that coordinates the mandatory 
 * six-step control flow defined in MIG-06 §3.
 * 
 * Constraints:
 * - Synchronous only (no async/await).
 * - Stateless (no persistence).
 * - Deterministic transitions.
 * - Fail-closed (short-circuit on any failure).
 */
export class Orchestrator {
  private state: OrchestrationState = OrchestrationState.NEW;
  private attemptId: OrchestrationAttemptId;

  constructor(
    private readonly executors: OrchestratorExecutors,
    private readonly policyEvaluator: PolicyEvaluator,
    private readonly auditEmitter: AuditEmitter,
    private readonly hooks?: OrchestrationLifecycleHooks
  ) {
    this.attemptId = randomUUID();
  }

  /**
   * The authoritative entrypoint for a single orchestration attempt.
   * Executes the six-step sequence synchronously.
   */
  public orchestrate(trigger: OrchestrationTrigger): OrchestrationResult | OrchestrationAbort {
    try {
      // Step 1: Trigger Reception & Validation
      this.transitionTo(OrchestrationState.VALIDATING);
      const valResult = this.executors.validateTrigger(trigger);
      if (!valResult.success) {
        return this.abort(valResult.abort);
      }

      // Step 2: Readiness Check
      const readyResult = this.executors.checkReadiness(this.attemptId);
      if (!readyResult.success) {
        return this.abort(readyResult.abort);
      }

      // Step 3: Policy Evaluation
      this.transitionTo(OrchestrationState.GATED);
      
      const context: OrchestrationContext = {
        attempt_id: this.attemptId,
        policy_id: 'MIG06_V1_POLICY',
        policy_version: '1.0.0',
        trace_id: `trace-${this.attemptId}`, // Deterministic derivation
        audit_id: randomUUID(),
        governance_mode: 'PHASE_E_RESTRICTED'
      };

      // PR-06: Audit BEFORE policy evaluation
      this.emitAudit({
        version: '1.0.0',
        event_type: 'POLICY_EVALUATION',
        orchestration_attempt_id: this.attemptId,
        timestamp: new Date().toISOString(),
        metadata: {
          policy_id: context.policy_id,
          policy_version: context.policy_version,
          phase: 'PRE_EVALUATION'
        }
      });

      const decision = this.policyEvaluator.evaluate({
        context,
        trigger: {
          classification: trigger.classification,
          version: trigger.version
        }
      });

      // PR-06: Audit AFTER policy evaluation
      this.emitAudit({
        version: '1.0.0',
        event_type: 'POLICY_EVALUATION',
        orchestration_attempt_id: this.attemptId,
        timestamp: new Date().toISOString(),
        metadata: {
          policy_id: context.policy_id,
          policy_version: context.policy_version,
          outcome: decision.outcome,
          decision_id: decision.decision_id,
          phase: 'POST_EVALUATION'
        }
      });

      if (decision.outcome === 'DENY') {
        return this.abort({
          version: '1.0.0',
          attempt_id: this.attemptId,
          reason_code: 'POL-001',
          metadata: { decision_id: decision.decision_id },
          stop_authority: 'CONTROL_PLANE'
        });
      }

      const decisionId = decision.decision_id;

      // Transition to AUTHORIZED (Step 3 complete)
      this.transitionTo(OrchestrationState.AUTHORIZED);

      // Step 4: Execution Boundary (Single-Step, Non-Autonomous)
      this.transitionTo(OrchestrationState.RUNNING);
      
      const command: OrchestrationCommand = {
        version: '1.0.0',
        command_id: randomUUID(),
        attempt_id: this.attemptId,
        type: 'CLINICAL_DRAFT_GENERATION',
        parameters: {
          trigger_id: trigger.trigger_id,
          classification: trigger.classification
        },
        idempotency_key: `exec-${this.attemptId}`
      };

      const execResult = this.executors.executionExecutor.execute(this.attemptId, command);
      
      if (execResult.status === 'FAILURE') {
        return this.abort({
          version: '1.0.0',
          attempt_id: this.attemptId,
          reason_code: execResult.error_code,
          metadata: execResult.metadata,
          stop_authority: 'ORCHESTRATOR'
        });
      }
      const evidence = execResult.evidence;

      // Step 5: Audit Emission
      this.transitionTo(OrchestrationState.AUDITING);
      const auditResult = this.executors.emitAudit(this.attemptId, trigger, decisionId, evidence);
      if (!auditResult.success) {
        return this.abort(auditResult.abort);
      }
      const auditCorrelationId = auditResult.data;

      // Step 6: Completion
      this.transitionTo(OrchestrationState.SUCCEEDED);

      // PR-06: Audit ATTEMPT_COMPLETED
      this.emitAudit({
        version: '1.0.0',
        event_type: 'ORCHESTRATION_COMPLETE',
        orchestration_attempt_id: this.attemptId,
        timestamp: new Date().toISOString(),
        metadata: {
          outcome: 'SUCCEEDED'
        }
      });

      const result: OrchestrationResult = {
        version: '1.0.0',
        attempt_id: this.attemptId,
        outcome: 'SUCCEEDED',
        evidence,
        audit_correlation_id: auditCorrelationId
      };

      this.executors.onComplete(result);
      return result;

    } catch (error) {
      // PR-06: Handle Audit Failure (AUD-001/AUD-002)
      if (error instanceof AuditFailure) {
        return this.abort({
          version: '1.0.0',
          attempt_id: this.attemptId,
          reason_code: error.code,
          metadata: { message: error.message },
          stop_authority: 'ORCHESTRATOR'
        });
      }

      // Invariant Violation (EXE-001)
      const abort: OrchestrationAbort = {
        version: '1.0.0',
        attempt_id: this.attemptId,
        reason_code: 'EXE-001',
        metadata: {
          error: error instanceof Error ? error.message : String(error)
        },
        stop_authority: 'ORCHESTRATOR'
      };
      return this.abort(abort);
    }
  }

  /**
   * Internal transition helper that enforces E-01 §4.4 (forbidden transitions).
   */
  private transitionTo(target: OrchestrationState): void {
    if (!isValidTransition(this.state, target)) {
      throw new Error(`Forbidden state transition: ${this.state} -> ${target}`);
    }

    const previous = this.state;

    // PR-06: Audit BEFORE state transition
    this.emitAudit({
      version: '1.0.0',
      event_type: 'STATE_TRANSITION',
      orchestration_attempt_id: this.attemptId,
      timestamp: new Date().toISOString(),
      metadata: {
        previous_state: previous,
        target_state: target,
        phase: 'PRE_TRANSITION'
      }
    });

    this.state = target;

    if (this.hooks?.onStateTransition) {
      this.hooks.onStateTransition(this.attemptId, previous, target);
    }

    // PR-06: Audit AFTER state transition
    this.emitAudit({
      version: '1.0.0',
      event_type: 'STATE_TRANSITION',
      orchestration_attempt_id: this.attemptId,
      timestamp: new Date().toISOString(),
      metadata: {
        previous_state: previous,
        target_state: target,
        phase: 'POST_TRANSITION'
      }
    });
  }

  /**
   * Synchronous audit emission boundary.
   * Enforces synchronous ACK and fail-closed on NACK/Exception.
   */
  private emitAudit(signal: AuditSignal): void {
    try {
      const result = this.auditEmitter.emit(signal);
      if (result.status === 'NACK') {
        throw new AuditFailure(result.error_code, result.reason);
      }
    } catch (error) {
      if (error instanceof AuditFailure) throw error;
      // Map unknown exceptions to SINK_UNREACHABLE (AUD-001)
      throw new AuditFailure('AUD-001', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Terminal failure handler. Short-circuits the flow and transitions to the correct state.
   */
  private abort(abort: OrchestrationAbort): OrchestrationAbort {
    // PR-06: Audit the Abort event BEFORE transition
    try {
      this.emitAudit({
        version: '1.0.0',
        event_type: 'ORCHESTRATION_ABORT',
        orchestration_attempt_id: this.attemptId,
        timestamp: new Date().toISOString(),
        metadata: {
          reason_code: abort.reason_code,
          stop_authority: abort.stop_authority,
          last_known_state: this.state
        }
      });
    } catch {
      // Fail-closed: if audit sink is dead during abort, we still 
      // proceed to terminal state transition to ensure state consistency.
    }

    // Map failure taxonomy to terminal states per MIG-06 §2.4
    const terminalState = this.mapFailureToState(abort.reason_code);
    
    // Attempt terminal transition if not already terminal
    if (this.state !== terminalState) {
      try {
        this.transitionTo(terminalState);
      } catch (error) {
        // Fail-closed: if transition fails during abort (e.g. audit failure),
        // we still force the terminal state to ensure determinism.
        this.state = terminalState;
      }
    }

    this.executors.onComplete(abort);
    return abort;
  }

  /**
   * Maps E-05 failure codes to E-01 terminal states.
   */
  private mapFailureToState(code: string): OrchestrationState {
    if (code.startsWith('POL-')) return OrchestrationState.REJECTED;
    if (code.startsWith('CON-')) return OrchestrationState.BLOCKED;
    if (code.startsWith('INF-')) return OrchestrationState.BLOCKED;
    if (code.startsWith('AUD-001')) return OrchestrationState.BLOCKED;
    if (code.startsWith('OPR-002')) return OrchestrationState.BLOCKED;
    if (code.startsWith('OPR-001')) return OrchestrationState.CANCELLED;
    return OrchestrationState.ERROR;
  }

  /**
   * Explicit getter for testing/audit.
   */
  public getAttemptId(): OrchestrationAttemptId {
    return this.attemptId;
  }

  /**
   * Explicit getter for testing/audit.
   */
  public getState(): OrchestrationState {
    return this.state;
  }
}
