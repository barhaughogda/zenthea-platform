import { ControlPlaneContext } from '@starter/control-plane';
import { OperatorInvocationInput } from './operatorTypes';
import { OrchestrationResult } from '../contracts/result';
import { OrchestrationAbort } from '../contracts/abort';
import { OrchestrationTrigger } from '../contracts/trigger';
import { invokeOnce } from '../invocation/invokeOrchestration';
import { randomUUID } from 'crypto';

/**
 * PR-13: Operator UI / API Invocation Adapter.
 * 
 * Provides a thin, synchronous, non-autonomous bridge between the Operator
 * surface and the orchestration boundary.
 */
export function invokeFromOperator(
  ctx: ControlPlaneContext,
  input: OperatorInvocationInput
): OrchestrationResult | OrchestrationAbort {
  // 1. Validate ControlPlaneContext (Fail-Closed)
  // Re-validating here to ensure the adapter itself enforces the boundary.
  if (!ctx || !ctx.traceId || !ctx.actorId) {
    throw new Error('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  }

  // 2. Validate OperatorInvocationInput
  if (!input) {
    throw new Error('GOVERNANCE_FAILURE: Missing OperatorInvocationInput');
  }

  if (input.action !== 'CLINICAL_DRAFT_ASSIST') {
    throw new Error(`GOVERNANCE_FAILURE: Invalid action '${input.action}'`);
  }

  if (!input.subject_id) {
    throw new Error('GOVERNANCE_FAILURE: Missing subject_id');
  }

  // 3. Translate OperatorInvocationInput -> OrchestrationTrigger
  const trigger: OrchestrationTrigger = {
    version: '1.0.0',
    trigger_id: randomUUID(),
    classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST',
    metadata: {
      ...input.metadata,
      subject_id: input.subject_id,
      operator_action: input.action
    },
    timestamp: new Date().toISOString()
  };

  // 4. Synchronous Delegation
  // We return the result verbatim without modification or side-effects.
  return invokeOnce(ctx, trigger);
}
