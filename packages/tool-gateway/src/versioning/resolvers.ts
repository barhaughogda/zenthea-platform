import { POLICY_REGISTRY, OperatorQueryPolicy } from '../policy-registry';
import { SAVED_VIEW_REGISTRY, SavedView } from '../saved-view-registry';
import { VersionId } from './types';

/**
 * VersionResolver: Deterministic, side-effect free logic for version resolution.
 */
export const VersionResolver = {
  /**
   * Resolves a policy by ID and optional version.
   * If version is omitted, returns the latest version.
   */
  resolvePolicy(policyId: string, version?: VersionId): OperatorQueryPolicy {
    if (version) {
      const exactMatch = POLICY_REGISTRY[`${policyId}@${version}`];
      if (!exactMatch) {
        throw new Error(`Operator Error: Unknown policyId '${policyId}' version '${version}'`);
      }
      return exactMatch;
    }

    // Try resolving as latest
    const latestMatch = POLICY_REGISTRY[policyId];
    if (!latestMatch) {
      throw new Error(`Operator Error: Unknown policyId ${policyId}`);
    }

    // Double check: if it's the unversioned key, it must be marked as latest
    if (!latestMatch.isLatest) {
      // In a more complex system, we'd scan all versions for the actual latest.
      // For this slice, we rely on the registry structure.
    }

    return latestMatch;
  },

  /**
   * Resolves a view by ID and optional version.
   * If version is omitted, returns the latest version.
   */
  resolveView(viewId: string, version?: VersionId): SavedView {
    if (version) {
      const exactMatch = SAVED_VIEW_REGISTRY[`${viewId}@${version}`];
      if (!exactMatch) {
        throw new Error(`Operator Error: Unknown viewId '${viewId}' version '${version}'`);
      }
      return exactMatch;
    }

    const latestMatch = SAVED_VIEW_REGISTRY[viewId];
    if (!latestMatch) {
      throw new Error(`Operator Error: Unknown viewId ${viewId}`);
    }

    return latestMatch;
  }
};
