import { z } from 'zod';

/**
 * VersionId: Canonical representation of a policy or view version.
 * Supports monotonic integers (e.g., "1", "2") or semantic versions.
 * Rules:
 * - Must be serializable (string)
 * - Must be comparable
 */
export const VersionIdSchema = z.string().regex(/^\d+(\.\d+)*$/, 'VersionId must be a numeric or semantic version string (e.g., "1" or "1.0.0")');
export type VersionId = z.infer<typeof VersionIdSchema>;

/**
 * PolicyVersion: Explicit version of a policy.
 */
export interface PolicyVersion {
  readonly policyId: string;
  readonly version: VersionId;
  readonly isLatest: boolean;
  readonly supersedesVersion?: VersionId;
  readonly deprecatedAt?: string; // ISO datetime
}

/**
 * ViewVersion: Explicit version of a saved view.
 */
export interface ViewVersion {
  readonly viewId: string;
  readonly version: VersionId;
  readonly isLatest: boolean;
  readonly supersedesVersion?: VersionId;
  readonly deprecatedAt?: string; // ISO datetime
}

/**
 * Comparable Version Utilities
 */
export const VersionUtils = {
  /**
   * Compares two VersionIds.
   * Returns > 0 if v1 > v2, < 0 if v1 < v2, 0 if equal.
   */
  compare(v1: VersionId, v2: VersionId): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 !== p2) return p1 - p2;
    }
    return 0;
  }
};
