import { TimelineFilter } from './timeline';
import { AgentRegistryFilter } from './agent-registry';

/**
 * Supported targets for Operator Query Policies.
 */
export type PolicyTarget = 'timeline' | 'agentRegistry';

/**
 * Strict Policy type for Operator Query Policies.
 * Policies are named, code-defined, and immutable query definitions.
 */
export interface OperatorQueryPolicy {
  readonly policyId: string;
  readonly description: string;
  readonly target: PolicyTarget;
  readonly filters: TimelineFilter | AgentRegistryFilter;
  readonly ordering: string; // Documentation requirement: must match underlying API
}

/**
 * The Policy Registry is a code-defined allowlist of executable policies.
 * Deny-by-default: only registered policies are executable.
 */
export const POLICY_REGISTRY: Record<string, OperatorQueryPolicy> = {
  /**
   * Example: Active Clinical Agents
   */
  'active-clinical-agents': {
    policyId: 'active-clinical-agents',
    description: 'Lists all active clinical agents in the registry.',
    target: 'agentRegistry',
    filters: {
      agentType: 'clinical',
      lifecycleState: 'active',
    },
    ordering: 'agentId:agentVersion',
  },
  /**
   * Example: Recent Denied Tool Requests
   */
  'recent-denied-tools': {
    policyId: 'recent-denied-tools',
    description: 'Lists the most recent denied tool gateway events.',
    target: 'timeline',
    filters: {
      decision: 'denied',
      type: 'TOOL_GATEWAY',
      limit: 20,
    },
    ordering: 'chronological',
  },
};

/**
 * Validates the policy registry at startup.
 * Throws if any policy is invalid.
 */
export function validatePolicies(): void {
  for (const [id, policy] of Object.entries(POLICY_REGISTRY)) {
    if (id !== policy.policyId) {
      throw new Error(`Policy Registry Error: Registry key ${id} must match policyId ${policy.policyId}`);
    }
    
    // Validate target
    if (policy.target === 'timeline') {
      if (policy.ordering !== 'chronological') {
        throw new Error(`Policy Registry Error: Policy ${id} target 'timeline' must have 'chronological' ordering.`);
      }
    } else if (policy.target === 'agentRegistry') {
      if (policy.ordering !== 'agentId:agentVersion') {
        throw new Error(`Policy Registry Error: Policy ${id} target 'agentRegistry' must have 'agentId:agentVersion' ordering.`);
      }
    }

    // Ensure no dynamic filters are allowed (by design, they are fixed in code)
    const filters = policy.filters as Record<string, unknown>;
    if (filters.cursor !== undefined) {
      throw new Error(`Policy Registry Error: Policy ${id} MUST NOT define a default cursor.`);
    }
  }
}

// Fail fast at startup
validatePolicies();
