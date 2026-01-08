import { z } from 'zod';
import { 
  NoteSection, 
  EvidenceReference, 
  ProvenanceMetadata,
  DRAFT_LABELS,
  DocumentationType
} from '../domain/types';

/**
 * AI Layer: Clinical Documentation Agent
 */

export const AIDraftProposalSchema = z.object({
  type: z.literal('PROPOSAL'),
  sections: z.array(z.object({
    sectionId: z.string(),
    title: z.string(),
    content: z.string(),
    sourceAttribution: z.literal('AI_PROPOSED'),
  })),
  evidenceReferences: z.array(z.any()), // EvidenceReferenceSchema from API
  labels: z.object({
    status: z.literal(DRAFT_LABELS.STATUS),
    disclaimer: z.literal(DRAFT_LABELS.DISCLAIMER),
    hitlRequired: z.literal(DRAFT_LABELS.HITL_REQUIRED),
  }),
  provenance: z.object({
    model: z.object({
      provider: z.string(),
      name: z.string(),
      version: z.string(),
    }),
    promptVersion: z.string(),
    timestamp: z.string(),
  }),
});

export type AIDraftProposal = z.infer<typeof AIDraftProposalSchema>;

export type AIRefusalReason = 
  | 'FORBIDDEN_COMMIT_REQUEST'
  | 'INSUFFICIENT_EVIDENCE'
  | 'FABRICATION_RISK'
  | 'SAFETY_VIOLATION'
  | 'CONSENT_REQUIRED';

export interface AIRefusalResponse {
  type: 'REFUSAL';
  reason: AIRefusalReason;
  message: string;
}

export type AIResponse = AIDraftProposal | AIRefusalResponse;

export interface IClinicalDocumentationAIService {
  /**
   * Generates a draft proposal using governed AI runtime.
   */
  generateDraftProposal(params: {
    documentationType: DocumentationType;
    inputContext: {
      transcript?: string;
      rawNotes?: string;
      patientSummary?: any;
    };
    promptVersion?: string;
  }): Promise<AIResponse>;
}

/**
 * Placeholder implementation of AI Service.
 * In Phase 3, this focuses on structure and safety wiring.
 */
export class ClinicalDocumentationAIService implements IClinicalDocumentationAIService {
  async generateDraftProposal(params: {
    documentationType: DocumentationType;
    inputContext: {
      transcript?: string;
      rawNotes?: string;
      patientSummary?: any;
    };
    promptVersion?: string;
  }): Promise<AIResponse> {
    // 1. Construct prompt layers (placeholders)
    const promptLayers = {
      system: "DRAFT-ONLY DOCTRINE: You are a draft generation assistant. Never sign/finalize/commit.",
      policy: "REFUSAL RULES: Refuse to sign, attest, or fabricate patient facts.",
      domain: `TYPE: ${params.documentationType}`,
      input: params.inputContext,
    };

    // 2. Mock AI execution for Phase 3 skeleton
    // In a real implementation, this would call packages/ai-runtime
    
    // Check for refusal triggers (example)
    if (params.inputContext.rawNotes?.toLowerCase().includes('attest') || 
        params.inputContext.rawNotes?.toLowerCase().includes('sign this')) {
      return {
        type: 'REFUSAL',
        reason: 'FORBIDDEN_COMMIT_REQUEST',
        message: 'AI is forbidden from signing or attesting clinical notes.'
      };
    }

    // Return a proposal (skeleton)
    return {
      type: 'PROPOSAL',
      sections: [
        {
          sectionId: 'sec_1',
          title: 'Subjective',
          content: 'Draft content derived from transcript...',
          sourceAttribution: 'AI_PROPOSED',
        }
      ],
      evidenceReferences: [],
      labels: {
        status: DRAFT_LABELS.STATUS,
        disclaimer: DRAFT_LABELS.DISCLAIMER,
        hitlRequired: DRAFT_LABELS.HITL_REQUIRED,
      },
      provenance: {
        model: {
          provider: 'zenthea-internal',
          name: 'clinical-draft-v1',
          version: '1.0.0',
        },
        promptVersion: params.promptVersion || 'v1.0.0',
        timestamp: new Date().toISOString(),
      },
    } as AIDraftProposal;
  }
}
