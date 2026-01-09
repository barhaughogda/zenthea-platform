import { RequestContext } from './types';

export interface PolicyRequest {
  readonly context: RequestContext;
  readonly subject: string;
  readonly action: string;
  readonly resource: string;
  readonly attributes?: Record<string, unknown>;
}

export interface PolicyDecision {
  readonly allowed: boolean;
  readonly reason?: string;
  readonly obligations?: string[];
}

/**
 * Adapter interface for policy evaluation within the control plane.
 * Semantic authority resides in packages/policy.
 * Implementations must fail-closed.
 */
export interface IPolicyEvaluator {
  evaluate(request: PolicyRequest): Promise<PolicyDecision>;
}
