import { ControlPlaneContext, ControlPlanePolicyEvaluator, ControlPlaneAuditEmitter } from '@starter/control-plane';
import { PolicyEvaluator as BackendPolicyEvaluator } from '@starter/policy';
import { OrchestrationTrigger } from '../contracts/trigger';
import { RunnerOutput } from '../runner/runnerTypes';
import { runOnce } from '../run/runOnce';
import { ControlPlanePolicyAdapter } from '../adapters/controlPlanePolicyAdapter';
import { ControlPlaneAuditAdapter } from '../adapters/controlPlaneAuditAdapter';
import { RealDraftExecutionExecutor } from '../execution/realDraftExecutionExecutor';

/**
 * PR-12: Operator / Service Invocation Boundary (Explicit Entry Point).
 * 
 * Provides a single, explicit, synchronous function for triggering 
 * MIG-06 orchestration. This boundary enforces the "Non-Autonomous" 
 * doctrine by requiring an intentional caller context.
 * 
 * Constraints:
 * - MUST remain synchronous.
 * - MUST NOT introduce scheduling, retries, or backgrounding.
 * - MUST bubble all errors immediately (Fail-Closed).
 */
export function invokeOnce(
  ctx: ControlPlaneContext, 
  trigger: OrchestrationTrigger
): RunnerOutput {
  // 1. Mandatory Context Validation (PR-12 Rule)
  if (!ctx || !ctx.traceId || !ctx.actorId) {
    throw new Error('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  }

  // 2. Production Wiring (PR-10/12 Integration)
  // Note: We instantiate real adapters here to satisfy the "Explicit Entry Point" mandate.
  // The BackendPolicyEvaluator is the authoritative engine from @starter/policy.
  const backendPolicy = new BackendPolicyEvaluator();
  const cpPolicy = new ControlPlanePolicyEvaluator(backendPolicy);
  const cpAudit = new ControlPlaneAuditEmitter('orchestration-service');

  const policyAdapter = new ControlPlanePolicyAdapter(cpPolicy, 'MIG06_V1');
  const auditAdapter = new ControlPlaneAuditAdapter(cpAudit);
  const executionExecutor = new RealDraftExecutionExecutor();

  // 3. Delegation (Synchronous)
  // We pass the context and trigger directly to the runOnce runner.
  return runOnce({
    trigger,
    ctx,
    deps: {
      policy: policyAdapter,
      audit: auditAdapter,
      execution: executionExecutor
    }
  });
}
