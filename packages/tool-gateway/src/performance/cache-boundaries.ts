/**
 * CP-19: Performance & Caching Boundaries
 * Defines enforceable tiers for where caching is allowed or forbidden.
 */

/**
 * Cacheability Tier: Defines the governance level for caching a specific path.
 */
export enum Cacheability {
  /**
   * ❌ STRICTLY FORBIDDEN.
   * Path must execute fresh every time to maintain auditability and determinism.
   * Examples: Execution, Mutation, Decisions, Audits.
   */
  NONE = 'NONE',

  /**
   * ⚠️ BOUNDED CACHING.
   * Only the hydrated read model (the "view") may be cached.
   * Source of truth remains the underlying event stream/database.
   * Examples: Hydrated Saved Views.
   */
  READ_MODEL_ONLY = 'READ_MODEL_ONLY',

  /**
   * ✅ SAFE TO CACHE/MEMOIZE.
   * Static metadata or pure function results that are deterministic by version.
   * Examples: Version Resolution, Registry Lookups.
   */
  METADATA_ONLY = 'METADATA_ONLY',
}

/**
 * Interface annotation for cacheability.
 * Used to enforce boundaries at the type level.
 */
export interface CacheBoundary {
  readonly cacheability: Cacheability;
}

/**
 * Annotated interfaces for key platform components.
 * These do NOT implement caching; they define the RULES for caching.
 */

/** Policy Resolution: Safe to memoize by version. */
export interface IVersionResolverAnnotation extends CacheBoundary {
  readonly cacheability: Cacheability.METADATA_ONLY;
}

/** Policy Execution: Never cacheable. */
export interface IPolicyExecutionAnnotation extends CacheBoundary {
  readonly cacheability: Cacheability.NONE;
}

/** Mutation Outcomes: Never cacheable. */
export interface IMutationAnnotation extends CacheBoundary {
  readonly cacheability: Cacheability.NONE;
}

/** View Resolution: Safe to cache hydrated model. */
export interface IViewResolutionAnnotation extends CacheBoundary {
  readonly cacheability: Cacheability.READ_MODEL_ONLY;
}

/** Audit Emission: Never cacheable. */
export interface IAuditAnnotation extends CacheBoundary {
  readonly cacheability: Cacheability.NONE;
}
