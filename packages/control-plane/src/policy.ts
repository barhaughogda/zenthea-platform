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
 * Authoritative interface for policy evaluation.
 * Implementations must fail-closed.
 */
export interface IPolicyEvaluator {
  evaluate(request: PolicyRequest): Promise<PolicyDecision>;
}
