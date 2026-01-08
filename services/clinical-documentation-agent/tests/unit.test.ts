import { describe, it, expect } from 'vitest';
import { 
  createDraftShell, 
  createNewVersion, 
  validateDraftInvariants,
  createAmendment
} from '../domain/index';

describe('Clinical Documentation Domain Logic', () => {
  const mockDraftParams = {
    draftId: 'draft_123',
    patientId: 'patient_456',
    providerId: 'provider_789',
    documentationType: 'ENCOUNTER_NOTE' as any,
  };

  it('should enforce isDraftOnly hard constraint on creation', () => {
    const draft = createDraftShell(mockDraftParams);
    expect(draft.isDraftOnly).toBe(true);
  });

  it('should create version 1 with monotonic versioning', () => {
    const draft = createDraftShell(mockDraftParams);
    const version1 = createNewVersion(draft, null, 'provider_789', [], []);
    
    expect(version1.versionNumber).toBe(1);
    expect(version1.draftId).toBe(draft.draftId);
    expect(version1.versionId).toContain('v_draft_123_1');
  });

  it('should increment version number for subsequent versions', () => {
    const draft = createDraftShell(mockDraftParams);
    const v1 = createNewVersion(draft, null, 'provider_789', [], []);
    const v2 = createNewVersion(draft, v1, 'provider_789', [], []);
    
    expect(v2.versionNumber).toBe(2);
    expect(v2.diffBaseVersionId).toBe(v1.versionId);
  });

  it('should fail invariant check if draft has forbidden status', () => {
    const draft = createDraftShell(mockDraftParams);
    // @ts-ignore - simulating illegal state
    draft.status = 'SIGNED';
    
    const result = validateDraftInvariants(draft, []);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FORBIDDEN: Draft has illegal status SIGNED');
    }
  });

  it('should create append-only amendments without modifying original', () => {
    const amendment = createAmendment({
      amendmentId: 'amend_1',
      draftId: 'draft_123',
      targetsVersionId: 'v_1',
      type: 'ADDENDUM',
      reason: 'Missing lab results',
      text: 'Patient also had elevated glucose.',
      createdBy: 'provider_789',
    });

    expect(amendment.type).toBe('ADDENDUM');
    expect(amendment.targetsVersionId).toBe('v_1');
  });

  it('should enforce reason requirement for amendments', () => {
    expect(() => createAmendment({
      amendmentId: 'amend_1',
      draftId: 'draft_123',
      targetsVersionId: 'v_1',
      type: 'ADDENDUM',
      reason: '', // Empty reason
      text: '...',
      createdBy: 'provider_789',
    })).toThrow('Amendment reason is required');
  });
});
