import { 
  ClinicalNoteDraft, 
  DraftVersion, 
  DraftStatus,
  createDraftShell,
  createNewVersion,
  validateDraftInvariants,
  DRAFT_LABELS
} from '../domain/index';
import { 
  IDraftRepository, 
  IAuditSink 
} from '../data/index';
import { 
  IConsentAgent, 
  IEHRReadIntegration, 
  ITranscriptionReadIntegration 
} from '../integrations/index';
import { 
  IClinicalDocumentationAIService, 
  AIResponse 
} from '../ai/index';

/**
 * Orchestration Layer: Clinical Documentation Agent
 */
export class ClinicalDocumentationWorkflow {
  constructor(
    private draftRepo: IDraftRepository,
    private auditSink: IAuditSink,
    private consentAgent: IConsentAgent,
    private ehrIntegration: IEHRReadIntegration,
    private transcriptionIntegration: ITranscriptionReadIntegration,
    private aiService: IClinicalDocumentationAIService,
    private config: { tenantId: string }
  ) {}

  /**
   * Creates a draft clinical note.
   */
  async createDraft(params: {
    patientId: string;
    providerId: string;
    documentationType: any;
    encounterId?: string;
    correlationId: string;
  }): Promise<ClinicalNoteDraft> {
    // 1. Authorization & Identity (Implicit for Phase 3 skeleton)
    
    // 2. Create Draft Shell
    const draft = createDraftShell({
      draftId: `draft_${Date.now()}`,
      patientId: params.patientId,
      providerId: params.providerId,
      documentationType: params.documentationType,
      encounterId: params.encounterId,
    });

    // 3. Persist Draft
    await this.draftRepo.createDraft(draft);

    // 4. Create Initial Version (Empty)
    const initialVersion = createNewVersion(
      draft,
      null,
      params.providerId,
      [],
      []
    );
    await this.draftRepo.saveVersion(initialVersion);

    // 5. Audit
    await this.auditSink.emitEvent({
      eventType: 'CREATE_DRAFT',
      actorId: params.providerId,
      role: 'CLINICIAN',
      tenantId: this.config.tenantId,
      patientId: params.patientId,
      encounterId: params.encounterId,
      draftId: draft.draftId,
      versionId: initialVersion.versionId,
      metadata: { documentationType: params.documentationType },
      timestamp: new Date().toISOString(),
      correlationId: params.correlationId,
    });

    return draft;
  }

  /**
   * Generates an AI draft proposal.
   */
  async generateAIProposal(params: {
    draftId: string;
    providerId: string;
    inputContext: {
      transcriptId?: string;
      rawNotes?: string;
    };
    correlationId: string;
  }): Promise<AIResponse> {
    const draft = await this.draftRepo.getDraft(params.draftId);
    if (!draft) throw new Error('Draft not found');

    // 1. Consent Hard Gate
    const consent = await this.consentAgent.verifyConsent({
      patientId: draft.patientId,
      scope: 'clinical_documentation',
      tenantId: this.config.tenantId,
    });

    if (!consent.granted) {
      await this.auditSink.emitEvent({
        eventType: 'UPDATE_DRAFT',
        actorId: params.providerId,
        role: 'CLINICIAN',
        tenantId: this.config.tenantId,
        patientId: draft.patientId,
        draftId: draft.draftId,
        metadata: { error: 'CONSENT_DENIED', reason: consent.reason },
        timestamp: new Date().toISOString(),
        correlationId: params.correlationId,
      });
      return {
        type: 'REFUSAL',
        reason: 'CONSENT_REQUIRED',
        message: consent.reason || 'Patient consent required for AI documentation assistance.'
      };
    }

    // 2. Collect Context (Read-only)
    let transcript;
    if (params.inputContext.transcriptId) {
      transcript = await this.transcriptionIntegration.getTranscript(params.inputContext.transcriptId);
    }
    const patientSummary = await this.ehrIntegration.getPatientSummary(draft.patientId);

    // 3. AI Generation
    const aiResponse = await this.aiService.generateDraftProposal({
      documentationType: draft.documentationType,
      inputContext: {
        transcript: transcript?.text,
        rawNotes: params.inputContext.rawNotes,
        patientSummary,
      }
    });

    // 4. Audit
    await this.auditSink.emitEvent({
      eventType: 'UPDATE_DRAFT',
      actorId: params.providerId,
      role: 'CLINICIAN',
      tenantId: this.config.tenantId,
      patientId: draft.patientId,
      draftId: draft.draftId,
      metadata: { 
        aiOutcome: aiResponse.type === 'REFUSAL' ? 'REFUSED' : 'PROPOSED',
        aiRefusalReason: aiResponse.type === 'REFUSAL' ? aiResponse.reason : undefined
      },
      timestamp: new Date().toISOString(),
      correlationId: params.correlationId,
    });

    return aiResponse;
  }

  /**
   * Updates a draft with new content (HITL).
   */
  async updateDraftContent(params: {
    draftId: string;
    providerId: string;
    sections: any[];
    evidenceReferences: any[];
    correlationId: string;
  }): Promise<DraftVersion> {
    const draft = await this.draftRepo.getDraft(params.draftId);
    if (!draft) throw new Error('Draft not found');

    const versions = await this.draftRepo.getVersionHistory(params.draftId);
    const prevVersion = versions.length > 0 ? versions[versions.length - 1] : null;

    // 1. Create New Version
    const newVersion = createNewVersion(
      draft,
      prevVersion,
      params.providerId,
      params.sections,
      params.evidenceReferences
    );

    // 2. Validate Invariants
    const validation = validateDraftInvariants(draft, [...versions, newVersion]);
    if (!validation.valid) {
      throw new Error(`Domain Invariant Violation: ${validation.errors.join(', ')}`);
    }

    // 3. Save
    await this.draftRepo.saveVersion(newVersion);
    
    // Update draft current version
    draft.currentVersionId = newVersion.versionId;
    draft.updatedAt = new Date().toISOString();
    // In a real repo, we'd update the draft record too.

    // 4. Audit
    await this.auditSink.emitEvent({
      eventType: 'UPDATE_DRAFT',
      actorId: params.providerId,
      role: 'CLINICIAN',
      tenantId: this.config.tenantId,
      patientId: draft.patientId,
      draftId: draft.draftId,
      versionId: newVersion.versionId,
      metadata: { versionNumber: newVersion.versionNumber },
      timestamp: new Date().toISOString(),
      correlationId: params.correlationId,
    });

    return newVersion;
  }

  /**
   * Discards a draft.
   */
  async discardDraft(params: {
    draftId: string;
    providerId: string;
    correlationId: string;
  }): Promise<void> {
    const draft = await this.draftRepo.getDraft(params.draftId);
    if (!draft) throw new Error('Draft not found');

    // 1. Audit
    await this.auditSink.emitEvent({
      eventType: 'DISCARD_DRAFT',
      actorId: params.providerId,
      role: 'CLINICIAN',
      tenantId: this.config.tenantId,
      patientId: draft.patientId,
      draftId: draft.draftId,
      metadata: { status: 'DISCARDED' },
      timestamp: new Date().toISOString(),
      correlationId: params.correlationId,
    });

    // Note: Spec says discard does not delete history, just marks as discarded.
  }
}
