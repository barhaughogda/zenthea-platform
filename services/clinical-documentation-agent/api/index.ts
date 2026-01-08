import { z } from 'zod';
import { DRAFT_LABELS } from '../domain/types';

/**
 * API Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Define public contracts for documentation drafting and revision.
 * - Input validation using Zod.
 * - Ensure draft-only labels and non-final disclaimers are present.
 */

// --- Shared Schemas ---

export const NoteSectionSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  content: z.string(),
  sourceAttribution: z.enum(['AI_PROPOSED', 'HUMAN_EDITED', 'HUMAN_AUTHORED']),
});

export const EvidenceReferenceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('CHART'),
    id: z.string(),
    timestamp: z.string(),
    sourceRecordPointer: z.string(),
  }),
  z.object({
    type: z.literal('EXTERNAL'),
    guidelineSource: z.string(),
    versionDate: z.string().optional(),
    citation: z.string(),
  }),
]);

export const DraftLabelsSchema = z.object({
  status: z.literal(DRAFT_LABELS.STATUS),
  disclaimer: z.literal(DRAFT_LABELS.DISCLAIMER),
  hitlRequired: z.literal(DRAFT_LABELS.HITL_REQUIRED),
});

// --- Request Schemas ---

export const CreateDraftRequestSchema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  encounterId: z.string().optional(),
  documentationType: z.enum([
    'ENCOUNTER_NOTE',
    'SOAP_NOTE',
    'CONSULT_NOTE',
    'DISCHARGE_SUMMARY',
    'PROCEDURE_OPERATIVE_NOTE',
    'NURSING_ALLIED_HEALTH_NOTE',
    'DIAGNOSTIC_NARRATIVE',
    'CARE_COORDINATION_COMMUNICATION',
    'ADMINISTRATIVE_NARRATIVE',
    'EXTERNAL_DOCUMENT_DERIVATIVE',
  ]),
});

export const GenerateDraftRequestSchema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  encounterId: z.string().optional(),
  documentationType: z.string(),
  inputContext: z.object({
    transcriptId: z.string().optional(),
    rawNotes: z.string().optional(),
    externalRef: z.string().optional(),
  }),
});

export const UpdateDraftRequestSchema = z.object({
  draftId: z.string(),
  sections: z.array(NoteSectionSchema),
  evidenceReferences: z.array(EvidenceReferenceSchema),
});

export const CreateAmendmentRequestSchema = z.object({
  draftId: z.string(),
  targetsVersionId: z.string(),
  type: z.enum(['ADDENDUM', 'CORRECTION', 'AMENDMENT', 'RETRACTION_NOTE']),
  reason: z.string(),
  text: z.string(),
});

// --- Response Schemas ---

export const DraftMetadataSchema = z.object({
  draftId: z.string(),
  patientId: z.string(),
  encounterId: z.string().optional(),
  authoringProviderId: z.string(),
  documentationType: z.string(),
  status: z.string(),
  currentVersionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDraftOnly: z.literal(true),
  labels: DraftLabelsSchema,
});

export const DraftVersionResponseSchema = z.object({
  versionId: z.string(),
  draftId: z.string(),
  versionNumber: z.number(),
  createdBy: z.string(),
  createdAt: z.string(),
  content: z.object({
    sections: z.array(NoteSectionSchema),
  }),
  evidenceReferences: z.array(EvidenceReferenceSchema),
  provenance: z.any().optional(), // Metadata for AI runs
  isDiscarded: z.boolean(),
  labels: DraftLabelsSchema,
});

export const DraftResponseSchema = z.object({
  draft: DraftMetadataSchema,
  latestVersion: DraftVersionResponseSchema,
});

// --- Types ---

export type CreateDraftRequest = z.infer<typeof CreateDraftRequestSchema>;
export type GenerateDraftRequest = z.infer<typeof GenerateDraftRequestSchema>;
export type UpdateDraftRequest = z.infer<typeof UpdateDraftRequestSchema>;
export type CreateAmendmentRequest = z.infer<typeof CreateAmendmentRequestSchema>;
export type DraftResponse = z.infer<typeof DraftResponseSchema>;
export type DraftVersionResponse = z.infer<typeof DraftVersionResponseSchema>;
