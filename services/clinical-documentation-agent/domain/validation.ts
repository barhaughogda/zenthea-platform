import { ClinicalNoteDraft, DraftVersion } from './types';

/**
 * Enforces domain invariants for clinical documentation drafts.
 */
export function validateDraftInvariants(
  draft: ClinicalNoteDraft,
  versions: DraftVersion[]
): { valid: true } | { valid: false; errors: string[] } {
  const errors: string[] = [];

  // Rule: isDraftOnly must always be true
  if (draft.isDraftOnly !== true) {
    errors.push('CRITICAL: Draft must have isDraftOnly set to true');
  }

  // Rule: No forbidden status
  const forbiddenStatuses = ['SIGNED', 'FINAL', 'LOCKED', 'COMMITTED', 'SUBMITTED'];
  if (forbiddenStatuses.includes(draft.status as any)) {
    errors.push(`FORBIDDEN: Draft has illegal status ${draft.status}`);
  }

  // Rule: Version history must be preserved (checked during orchestration, but here we check consistency)
  const versionIds = new Set(versions.map(v => v.versionId));
  if (draft.currentVersionId && !versionIds.has(draft.currentVersionId)) {
    errors.push('CONSISTENCY: Current version ID not found in version history');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

/**
 * Checks if a draft is ready for a proposal to signoff.
 */
export function canProposeSignoff(draft: ClinicalNoteDraft, currentVersion: DraftVersion): boolean {
  // Must have content
  if (currentVersion.content.sections.length === 0) return false;
  
  // All sections must have content
  const allSectionsHaveContent = currentVersion.content.sections.every(s => s.content.trim().length > 0);
  if (!allSectionsHaveContent) return false;

  return true;
}
