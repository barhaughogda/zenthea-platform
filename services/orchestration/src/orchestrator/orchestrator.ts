import { randomUUID } from 'node:crypto';
import { OrchestrationTrigger } from '../contracts/trigger';
import { OrchestrationResult } from '../contracts/result';
import { OrchestrationAbort } from '../contracts/abort';
import { OrchestrationContext } from '../contracts/context';
import { OrchestrationState } from '../state/types';
import { isValidTransition } from '../state/transitions';
import { OrchestrationAttemptId, OrchestratorExecutors, OrchestrationLifecycleHooks } from './types';
import { PolicyEvaluator } from '../policy/policyEvaluator';

/**
 * PR-04: Orchestrator Shell (Non-Executing).
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

      const decision = this.policyEvaluator.evaluate({
        context,
        trigger: {
          classification: trigger.classification,
          version: trigger.version
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

      // Step 4: Command Dispatch
      this.transitionTo(OrchestrationState.RUNNING);
      const execResult = this.executors.executeCommand(this.attemptId, trigger);
      if (!execResult.success) {
        return this.abort(execResult.abort);
      }
      const evidence = execResult.data;

      // Step 5: Audit Emission
      this.transitionTo(OrchestrationState.AUDITING);
      const auditResult = this.executors.emitAudit(this.attemptId, trigger, decisionId, evidence);
      if (!auditResult.success) {
        return this.abort(auditResult.abort);
      }
      const auditCorrelationId = auditResult.data;

      // Step 6: Completion
      this.transitionTo(OrchestrationState.SUCCEEDED);
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
    this.state = target;

    if (this.hooks?.onStateTransition) {
      this.hooks.onStateTransition(this.attemptId, previous, target);
    }
  }

  /**
   * Terminal failure handler. Short-circuits the flow and transitions to the correct state.
   */
  private abort(abort: OrchestrationAbort): OrchestrationAbort {
    // Map failure taxonomy to terminal states per MIG-06 §2.4
    const terminalState = this.mapFailureToState(abort.reason_code);
    
    // Attempt terminal transition if not already terminal
    if (this.state !== terminalState) {
      try {
        this.transitionTo(terminalState);
      } catch {
        // Fallback to ERROR if transition is forbidden
        this.state = OrchestrationState.ERROR;
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
