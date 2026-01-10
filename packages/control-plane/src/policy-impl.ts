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
      const backendDecision = await this.backend.evaluate(request);

      if (backendDecision.effect === 'PERMIT') {
        return {
          allowed: true,
          reason: backendDecision.reasonCode,
        };
      }

      // Fail-closed for DENY or INDETERMINATE
      return {
        allowed: false,
        reason: backendDecision.reasonCode || 'Access denied by policy',
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Internal evaluation error';
      
      // Mandatory failure audit emission for fail-closed events
      if (this.auditEmitter) {
        // We use a fire-and-forget approach for the audit emission here to avoid 
        // blocking the response, but we ensure it's tracked.
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
        allowed: false,
        reason: `Fail-closed: ${reason}`,
      };
    }
  }
}
