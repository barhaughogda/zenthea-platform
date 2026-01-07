import { POLICY_REGISTRY, BoundedPresentation } from './policy-registry';
import { VersionId } from './versioning/types';

/**
 * Strict Saved View type.
 * Saved views are named, code-defined, and immutable.
 * They MUST reference a valid policyId.
 */
export interface SavedView {
  readonly viewId: string;
  readonly version: VersionId; // CP-18: Explicit versioning
  readonly isLatest?: boolean; // CP-18: Optional latest flag
  readonly supersedesVersion?: VersionId; // CP-18: Version track
  readonly deprecatedAt?: string; // CP-18: Expiry tracking
  readonly name: string;
  readonly description: string;
  readonly policyId: string;
  /**
   * Optional presentation metadata (non-sensitive only).
   */
  readonly presentation: BoundedPresentation;
}

/**
 * The Saved View Registry is a code-defined allowlist of executable views.
 * Deny-by-default: only registered views are executable.
 */
export const SAVED_VIEW_REGISTRY: Record<string, SavedView> = {
  /**
   * Example: Clinical Overview
   */
  'clinical-overview': {
    viewId: 'clinical-overview',
    version: '1',
    isLatest: true,
    name: 'Clinical Overview',
    description: 'A view of all active clinical agents.',
    policyId: 'active-clinical-agents',
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
  'clinical-overview@1': {
    viewId: 'clinical-overview',
    version: '1',
    isLatest: true,
    name: 'Clinical Overview',
    description: 'A view of all active clinical agents.',
    policyId: 'active-clinical-agents',
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
   * Example: Security Exceptions
   */
  'security-exceptions': {
    viewId: 'security-exceptions',
    version: '1',
    isLatest: true,
    name: 'Security Exceptions',
    description: 'Recent denied tool gateway events.',
    policyId: 'recent-denied-tools',
    presentation: {
      icon: 'shield',
      layout: 'list',
      badges: ['Security', 'Alert'],
    },
  },
  'security-exceptions@1': {
    viewId: 'security-exceptions',
    version: '1',
    isLatest: true,
    name: 'Security Exceptions',
    description: 'Recent denied tool gateway events.',
    policyId: 'recent-denied-tools',
    presentation: {
      icon: 'shield',
      layout: 'list',
      badges: ['Security', 'Alert'],
    },
  },
};

/**
 * Validates the saved view registry at startup.
 * Throws if any view is invalid or references a non-existent policy.
 */
export function validateViews(): void {
  for (const [id, view] of Object.entries(SAVED_VIEW_REGISTRY)) {
    // Registry key must be either viewId or viewId@version
    if (id !== view.viewId && id !== `${view.viewId}@${view.version}`) {
      throw new Error(`Saved View Registry Error: Registry key ${id} must match viewId ${view.viewId} or ${view.viewId}@${view.version}`);
    }

    // Ensure policy exists
    const policy = POLICY_REGISTRY[view.policyId];
    if (!policy) {
      throw new Error(`Saved View Registry Error: View '${id}' references non-existent policyId '${view.policyId}'`);
    }

    // CP-18: Validate version format
    if (!/^\d+(\.\d+)*$/.test(view.version)) {
      throw new Error(`Saved View Registry Error: View ${id} has invalid version format: ${view.version}`);
    }

    // Validate presentation metadata
    if (view.presentation) {
      // Columns validation: ensure they are not empty if provided
      if (view.presentation.columns && view.presentation.columns.length === 0) {
        throw new Error(`Saved View Registry Error: View '${id}' columns cannot be empty if provided`);
      }
    }
  }
}

// Fail fast at startup
validateViews();
