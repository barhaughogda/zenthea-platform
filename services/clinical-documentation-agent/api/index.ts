import { z } from 'zod';

/**
 * API Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Define public contracts for documentation drafting and revision.
 * - Input validation using Zod.
 * - TODO: Wire to orchestration handlers.
 */

export const DocumentationDraftRequestSchema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  encounterId: z.string().optional(),
  input: z.string(), // Raw transcript or notes
  documentationType: z.string(), // e.g., 'SOAP', 'ProgressNote'
  context: z.record(z.any()).optional(),
});

export type DocumentationDraftRequest = z.infer<typeof DocumentationDraftRequestSchema>;

export const DocumentationDraftResponseSchema = z.object({
  draftId: z.string(),
  content: z.string(),
  sections: z.array(z.object({
    title: z.string(),
    text: z.string(),
  })),
  metadata: z.object({
    isDraft: z.literal(true),
    requiresReview: z.literal(true),
    timestamp: z.string(),
  }),
});

export type DocumentationDraftResponse = z.infer<typeof DocumentationDraftResponseSchema>;

export const DocumentationRevisionRequestSchema = z.object({
  draftId: z.string(),
  providerFeedback: z.string(),
  modifications: z.record(z.any()).optional(),
});

export type DocumentationRevisionRequest = z.infer<typeof DocumentationRevisionRequestSchema>;

// TODO: Implement API handlers that delegate to orchestration
// TODO: Ensure no business logic or AI usage in this layer
