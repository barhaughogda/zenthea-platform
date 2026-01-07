import { TimelineFilter } from './timeline';
import { AgentRegistryFilter } from './agent-registry';

/**
 * Supported targets for Operator Query Policies.
 */
export type PolicyTarget = 'timeline' | 'agentRegistry';

/**
 * Bounded Risk Tiers for Policies.
 */
export type RiskTier = 'low' | 'medium' | 'high';

/**
 * Bounded Presentation Metadata for Operator UIs.
 */
export interface BoundedPresentation {
  readonly icon?: 'list' | 'shield' | 'activity' | 'users' | 'clock' | 'alert-triangle';
  readonly layout?: 'table' | 'list' | 'grid';
  readonly columns?: Array<{ key: string; label: string }>;
  readonly defaultSort?: { field: string; direction: 'asc' | 'desc' };
  readonly badges?: string[];
}

/**
 * Strict Policy type for Operator Query Policies.
 * Policies are named, code-defined, and immutable query definitions.
 */
export interface OperatorQueryPolicy {
  readonly policyId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly riskTier: RiskTier;
  readonly target: PolicyTarget;
  readonly filters: TimelineFilter | AgentRegistryFilter;
  readonly ordering: string; // Documentation requirement: must match underlying API
  readonly presentation: BoundedPresentation;
  readonly inputs?: Array<{ name: string; type: string; description: string }>;
  readonly outputs?: Array<{ name: string; type: string; description: string }>;
  readonly links?: Array<{ label: string; url: string }>;
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
    name: 'Active Clinical Agents',
    description: 'Lists all active clinical agents in the registry.',
    category: 'Inventory',
    riskTier: 'low',
    target: 'agentRegistry',
    filters: {
      agentType: 'clinical',
      lifecycleState: 'active',
    },
    ordering: 'agentId:agentVersion',
    presentation: {
      icon: 'users',
      layout: 'table',
      columns: [
        { key: 'agentId', label: 'Agent ID' },
        { key: 'agentVersion', label: 'Version' },
        { key: 'lifecycleState', label: 'State' },
      ],
    },
  },
  /**
   * Example: Recent Denied Tool Requests
   */
  'recent-denied-tools': {
    policyId: 'recent-denied-tools',
    name: 'Recent Denied Tool Requests',
    description: 'Lists the most recent denied tool gateway events.',
    category: 'Security',
    riskTier: 'medium',
    target: 'timeline',
    filters: {
      decision: 'denied',
      type: 'TOOL_GATEWAY',
      limit: 20,
    },
    ordering: 'chronological',
    presentation: {
      icon: 'shield',
      layout: 'list',
      badges: ['Security', 'Alert'],
    },
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
