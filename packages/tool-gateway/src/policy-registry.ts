import { TimelineFilter } from './timeline';
import { AgentRegistryFilter } from './agent-registry';
import { VersionId } from './versioning/types';

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
  readonly version: VersionId; // CP-18: Explicit versioning
  readonly isLatest?: boolean; // CP-18: Optional latest flag
  readonly supersedesVersion?: VersionId; // CP-18: Version track
  readonly deprecatedAt?: string; // CP-18: Expiry tracking
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
 * Keys can be policyId (resolves to latest) or policyId@version.
 */
export const POLICY_REGISTRY: Record<string, OperatorQueryPolicy> = {
  /**
   * Example: Active Clinical Agents
   */
  'active-clinical-agents': {
    policyId: 'active-clinical-agents',
    version: '1',
    isLatest: true,
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
  'active-clinical-agents@1': {
    policyId: 'active-clinical-agents',
    version: '1',
    isLatest: true,
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
    version: '1',
    isLatest: true,
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
  'recent-denied-tools@1': {
    policyId: 'recent-denied-tools',
    version: '1',
    isLatest: true,
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
  /**
   * Example: Critical Security Audits (CP-16 High Risk Example)
   */
  'critical-security-audits': {
    policyId: 'critical-security-audits',
    version: '1',
    isLatest: true,
    name: 'Critical Security Audits',
    description: 'Lists high-risk security audit events.',
    category: 'Security',
    riskTier: 'high',
    target: 'timeline',
    filters: {
      type: 'GOVERNANCE_CONTROL',
      limit: 10,
    },
    ordering: 'chronological',
    presentation: {
      icon: 'alert-triangle',
      layout: 'table',
      badges: ['Critical', 'Audit'],
    },
  },
  'critical-security-audits@1': {
    policyId: 'critical-security-audits',
    version: '1',
    isLatest: true,
    name: 'Critical Security Audits',
    description: 'Lists high-risk security audit events.',
    category: 'Security',
    riskTier: 'high',
    target: 'timeline',
    filters: {
      type: 'GOVERNANCE_CONTROL',
      limit: 10,
    },
    ordering: 'chronological',
    presentation: {
      icon: 'alert-triangle',
      layout: 'table',
      badges: ['Critical', 'Audit'],
    },
  },
};

/**
 * Validates the policy registry at startup.
 * Throws if any policy is invalid.
 */
export function validatePolicies(): void {
  for (const [id, policy] of Object.entries(POLICY_REGISTRY)) {
    // Registry key must be either policyId or policyId@version
    if (id !== policy.policyId && id !== `${policy.policyId}@${policy.version}`) {
      throw new Error(`Policy Registry Error: Registry key ${id} must match policyId ${policy.policyId} or ${policy.policyId}@${policy.version}`);
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

    // CP-18: Validate version format
    if (!/^\d+(\.\d+)*$/.test(policy.version)) {
      throw new Error(`Policy Registry Error: Policy ${id} has invalid version format: ${policy.version}`);
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
