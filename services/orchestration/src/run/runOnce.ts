import { OrchestrationTrigger } from '../contracts/trigger';
import { RunnerOutput } from '../runner/runnerTypes';
import { ControlPlaneContext } from '@starter/control-plane';
import { PolicyEvaluator } from '../policy/policyEvaluator';
import { AuditEmitter } from '../audit/auditTypes';
import { RealDraftExecutionExecutor } from '../execution/realDraftExecutionExecutor';
import { GovernanceGuard } from '@starter/service-control-adapter';
import { OrchestrationRunner } from '../runner/runner';

/**
 * PR-10: Real Adapter Wiring (Run Once Entrypoint).
 * 
 * A synchronous, single-step entrypoint for orchestration that enforces 
 * control plane governance and uses real (or production-wired) adapters.
 * 
 * Constraints:
 * - MUST remain synchronous.
 * - MUST enforce GovernanceGuard (CP-21).
 * - MUST fail-closed on any validation or execution error.
 */
export function runOnce(input: {
  trigger: OrchestrationTrigger;
  ctx: ControlPlaneContext;
  deps: {
    policy: PolicyEvaluator;
    audit: AuditEmitter;
    execution: RealDraftExecutionExecutor;
  };
}): RunnerOutput {
  // 1. Enforce GovernanceGuard (Fail-Closed)
  GovernanceGuard.enforce(input.ctx);

  // 2. Initialize Runner with injected dependencies
  const runner = new OrchestrationRunner(
    input.deps.policy,
    input.deps.audit,
    input.deps.execution
  );

  // 3. Execute with provided context and trigger
  // Note: We use the existing Runner architecture but inject the real adapters.
  return runner.run({
    trigger: input.trigger,
    context: input.ctx
  });
}
