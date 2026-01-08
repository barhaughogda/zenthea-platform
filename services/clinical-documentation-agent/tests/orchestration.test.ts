import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClinicalDocumentationWorkflow } from '../orchestration/index';

describe('Clinical Documentation Orchestration', () => {
  let workflow: ClinicalDocumentationWorkflow;
  const mockDraftRepo = {
    createDraft: vi.fn(),
    getDraft: vi.fn(),
    saveVersion: vi.fn(),
    getVersionHistory: vi.fn(),
  };
  const mockAuditSink = {
    emitEvent: vi.fn(),
  };
  const mockConsentAgent = {
    verifyConsent: vi.fn(),
  };
  const mockEhrIntegration = {
    getPatientSummary: vi.fn(),
    getEncounterContext: vi.fn(),
  };
  const mockTranscriptionIntegration = {
    getTranscript: vi.fn(),
  };
  const mockAiService = {
    generateDraftProposal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    workflow = new ClinicalDocumentationWorkflow(
      mockDraftRepo as any,
      mockAuditSink as any,
      mockConsentAgent as any,
      mockEhrIntegration as any,
      mockTranscriptionIntegration as any,
      mockAiService as any,
      { tenantId: 'test-tenant' }
    );
  });

  it('should verify consent before AI generation (AC-AI1)', async () => {
    mockDraftRepo.getDraft.mockResolvedValue({ patientId: 'p1', documentationType: 'SOAP' });
    mockConsentAgent.verifyConsent.mockResolvedValue({ granted: false, reason: 'No consent found' });

    const result = await workflow.generateAIProposal({
      draftId: 'd1',
      providerId: 'pr1',
      inputContext: {},
      correlationId: 'c1'
    });

    expect(result.type).toBe('REFUSAL');
    if (result.type === 'REFUSAL') {
      expect(result.reason).toBe('CONSENT_REQUIRED');
    }
    expect(mockAiService.generateDraftProposal).not.toHaveBeenCalled();
  });

  it('should emit CREATE_DRAFT audit event on draft creation (AC-C1)', async () => {
    await workflow.createDraft({
      patientId: 'p1',
      providerId: 'pr1',
      documentationType: 'ENCOUNTER_NOTE',
      correlationId: 'c1'
    });

    expect(mockAuditSink.emitEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'CREATE_DRAFT',
      actorId: 'pr1',
      patientId: 'p1',
      correlationId: 'c1'
    }));
  });

  it('should emit UPDATE_DRAFT audit event on content update (AC-C1)', async () => {
    mockDraftRepo.getDraft.mockResolvedValue({ draftId: 'd1', patientId: 'p1', isDraftOnly: true });
    mockDraftRepo.getVersionHistory.mockResolvedValue([]);

    await workflow.updateDraftContent({
      draftId: 'd1',
      providerId: 'pr1',
      sections: [],
      evidenceReferences: [],
      correlationId: 'c1'
    });

    expect(mockAuditSink.emitEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'UPDATE_DRAFT',
      draftId: 'd1',
      correlationId: 'c1'
    }));
  });
});
