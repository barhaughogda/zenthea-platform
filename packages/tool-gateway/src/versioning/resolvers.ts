import { POLICY_REGISTRY, OperatorQueryPolicy } from '../policy-registry';
import { SAVED_VIEW_REGISTRY, SavedView } from '../saved-view-registry';
import { VersionId } from './types';
import { Cacheability } from '../performance/cache-boundaries';

// In-memory, process-local memoization stores.
// ⚠️ SAFE_TO_MEMOIZE: Results are deterministic based on ID + Version.
const policyCache = new Map<string, OperatorQueryPolicy>();
const viewCache = new Map<string, SavedView>();

/**
 * VersionResolver: Deterministic, side-effect free logic for version resolution.
 */
export const VersionResolver = {
  /** Annotates this component as safe for metadata memoization. */
  cacheability: Cacheability.METADATA_ONLY,

  /**
   * Resolves a policy by ID and optional version.
   * If version is omitted, returns the latest version.
   */
  resolvePolicy(policyId: string, version?: VersionId): OperatorQueryPolicy {
    const cacheKey = version ? `${policyId}@${version}` : policyId;
    
    // Check memoization store
    const cached = policyCache.get(cacheKey);
    if (cached) return cached;

    let policy: OperatorQueryPolicy;

    if (version) {
      const exactMatch = POLICY_REGISTRY[`${policyId}@${version}`];
      if (!exactMatch) {
        throw new Error(`Operator Error: Unknown policyId '${policyId}' version '${version}'`);
      }
      policy = exactMatch;
    } else {
      // Try resolving as latest
      const latestMatch = POLICY_REGISTRY[policyId];
      if (!latestMatch) {
        throw new Error(`Operator Error: Unknown policyId ${policyId}`);
      }
      policy = latestMatch;
    }

    // Memoize before returning
    policyCache.set(cacheKey, policy);
    return policy;
  },

  /**
   * Resolves a view by ID and optional version.
   * If version is omitted, returns the latest version.
   */
  resolveView(viewId: string, version?: VersionId): SavedView {
    const cacheKey = version ? `${viewId}@${version}` : viewId;

    // Check memoization store
    const cached = viewCache.get(cacheKey);
    if (cached) return cached;

    let view: SavedView;

    if (version) {
      const exactMatch = SAVED_VIEW_REGISTRY[`${viewId}@${version}`];
      if (!exactMatch) {
        throw new Error(`Operator Error: Unknown viewId '${viewId}' version '${version}'`);
      }
      view = exactMatch;
    } else {
      const latestMatch = SAVED_VIEW_REGISTRY[viewId];
      if (!latestMatch) {
        throw new Error(`Operator Error: Unknown viewId ${viewId}`);
      }
      view = latestMatch;
    }

    // Memoize before returning
    viewCache.set(cacheKey, view);
    return view;
  }
};
