import { IPolicyEvaluator, PolicyRequest, PolicyDecision } from './policy';
import { PolicyEvaluator as BackendEvaluator } from '@starter/policy';
import { IAuditEmitter } from './audit';

/**
 * Concrete implementation of IPolicyEvaluator backed by @starter/policy.
 * Implements fail-closed logic.
 */
export class ControlPlanePolicyEvaluator implements IPolicyEvaluator {
  constructor(
    private readonly backend: BackendEvaluator,
    private readonly auditEmitter?: IAuditEmitter
  ) {}

  async evaluate(request: PolicyRequest): Promise<PolicyDecision> {
    try {
      return await this.backend.evaluate(request);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Internal evaluation error';
      
      // Mandatory failure audit emission for fail-closed events
      if (this.auditEmitter) {
        this.auditEmitter.emit({
          context: request.context,
          eventType: 'POLICY_EVALUATION_FAILURE',
          severity: 'CRITICAL',
          payload: {
            request: {
              subject: request.subject,
              action: request.action,
              resource: request.resource
            },
            error: reason,
          },
          result: 'FAILURE',
        }).catch(err => {
          console.error('CRITICAL: Failed to emit policy failure audit', err);
        });
      }

      return {
        effect: 'DENY',
        reasonCode: 'EVALUATION_ERROR',
        timestamp: new Date().toISOString(),
        metadata: { error: reason },
      };
    }
  }
}
