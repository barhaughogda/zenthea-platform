import { Orchestrator } from '../orchestrator/orchestrator';
import { OrchestratorExecutors } from '../orchestrator/types';
import { PolicyEvaluator } from '../policy/policyEvaluator';
import { AuditEmitter } from '../audit/auditTypes';
import { ExecutionExecutor } from '../execution/executionExecutor';
import { RunnerInput, RunnerOutput } from './runnerTypes';

/**
 * PR-08: Orchestration Runner (Non-Autonomous, Non-Executing).
 * 
 * A thin boundary that owns dependency wiring and execution entry.
 * Enforces synchronous-only flow and inert dependency injection.
 * 
 * Doctrine: 
 * - Composition only.
 * - Non-autonomous (trigger-driven).
 * - Non-executing (delegates to injected executor).
 * - Synchronous (no async/await).
 */
export class OrchestrationRunner {
  constructor(
    private readonly policyEvaluator: PolicyEvaluator,
    private readonly auditEmitter: AuditEmitter,
    private readonly executionExecutor: ExecutionExecutor
  ) {}

  /**
   * Authoritative synchronous entrypoint.
   * Performs NO real work - delegates entirely to the injected Orchestrator.
   */
  public run(input: RunnerInput): RunnerOutput {
    // 1. Define inert/stub executors for the six-step control flow.
    // These satisfy the OrchestratorExecutors interface while maintaining
    // the "non-autonomous, non-executing" mandate of MIG-06.
    const executors: OrchestratorExecutors = {
      validateTrigger: () => ({ success: true, data: undefined }),
      checkReadiness: () => ({ success: true, data: undefined }),
      evaluatePolicy: () => ({ success: true, data: 'INERT_POLICY_ID' }),
      executionExecutor: this.executionExecutor,
      emitAudit: () => ({ success: true, data: 'INERT_AUDIT_ID' }),
      onComplete: () => {} // Inert completion sink
    };

    // 2. Instantiate Orchestrator (Composition Layer)
    const orchestrator = new Orchestrator(
      executors,
      this.policyEvaluator,
      this.auditEmitter
    );

    // 3. Synchronous execution entry
    // Bubble any thrown errors (Fail-Closed)
    return orchestrator.orchestrate(input.trigger);
  }
}
