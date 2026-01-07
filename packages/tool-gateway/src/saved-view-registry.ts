import { POLICY_REGISTRY } from './policy-registry';

/**
 * Presentation metadata for a saved view.
 * Limited to non-sensitive display hints.
 */
export interface ViewPresentationMetadata {
  /**
   * Explicit allowlist of columns to display.
   */
  readonly columns?: string[];
  /**
   * Default number of items per page.
   */
  readonly defaultPageSize?: number;
}

/**
 * Strict Saved View type.
 * Saved views are named, code-defined, and immutable.
 * They MUST reference a valid policyId.
 */
export interface SavedView {
  readonly viewId: string;
  readonly name: string;
  readonly description: string;
  readonly policyId: string;
  /**
   * Optional presentation metadata (non-sensitive only).
   */
  readonly presentation?: ViewPresentationMetadata;
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
    name: 'Clinical Overview',
    description: 'A view of all active clinical agents.',
    policyId: 'active-clinical-agents',
    presentation: {
      columns: ['agentId', 'agentVersion', 'lifecycleState'],
      defaultPageSize: 10,
    },
  },
  /**
   * Example: Security Exceptions
   */
  'security-exceptions': {
    viewId: 'security-exceptions',
    name: 'Security Exceptions',
    description: 'Recent denied tool gateway events.',
    policyId: 'recent-denied-tools',
    presentation: {
      columns: ['eventId', 'timestamp', 'toolName', 'decision'],
      defaultPageSize: 20,
    },
  },
};

/**
 * Bounded page size for safety.
 */
const MAX_PAGE_SIZE = 100;

/**
 * Validates the saved view registry at startup.
 * Throws if any view is invalid or references a non-existent policy.
 */
export function validateViews(): void {
  for (const [id, view] of Object.entries(SAVED_VIEW_REGISTRY)) {
    if (id !== view.viewId) {
      throw new Error(`Saved View Registry Error: Registry key ${id} must match viewId ${view.viewId}`);
    }

    // Ensure policy exists
    const policy = POLICY_REGISTRY[view.policyId];
    if (!policy) {
      throw new Error(`Saved View Registry Error: View '${id}' references non-existent policyId '${view.policyId}'`);
    }

    // Validate presentation metadata if present
    if (view.presentation) {
      if (view.presentation.defaultPageSize !== undefined) {
        if (view.presentation.defaultPageSize <= 0 || view.presentation.defaultPageSize > MAX_PAGE_SIZE) {
          throw new Error(`Saved View Registry Error: View '${id}' has invalid defaultPageSize (must be 1-${MAX_PAGE_SIZE})`);
        }
      }

      // Columns validation: ensure they are not empty if provided
      if (view.presentation.columns && view.presentation.columns.length === 0) {
        throw new Error(`Saved View Registry Error: View '${id}' columns cannot be empty if provided`);
      }
    }
  }
}

// Fail fast at startup
validateViews();
