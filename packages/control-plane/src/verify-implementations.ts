import { IAuditEmitter } from './audit';
import { IPolicyEvaluator } from './policy';
import { ControlPlaneAuditEmitter } from './audit-impl';
import { ControlPlanePolicyEvaluator } from './policy-impl';

/**
 * Compile-time verification that implementations satisfy the required interfaces.
 */

// Verify Audit Emitter
const auditEmitter: IAuditEmitter = new ControlPlaneAuditEmitter();
console.log('Audit Emitter type check passed');

// Verify Policy Evaluator
// Mock backend for verification
const mockBackend = {
  evaluate: async () => ({
    effect: 'PERMIT' as const,
    timestamp: new Date().toISOString(),
  })
};

const policyEvaluator: IPolicyEvaluator = new ControlPlanePolicyEvaluator(mockBackend);
console.log('Policy Evaluator type check passed');
