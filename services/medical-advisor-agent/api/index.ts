import { z } from 'zod';

/**
 * ClinicalQueryRequest defines the schema for incoming clinical questions or reasoning tasks.
 * No business logic should be added here.
 */
export const ClinicalQueryRequestSchema = z.object({
  query: z.string().min(1).describe('The clinical question or reasoning prompt.'),
  context: z.object({
    patientId: z.string().describe('Scoped patient identifier (must be identity-verified).'),
    tenantId: z.string().describe('The tenant ID for data scoping.'),
    clinicalContext: z.record(z.unknown()).optional().describe('Additional clinical data for reasoning.'),
  }),
  metadata: z.object({
    requestId: z.string().uuid(),
    clinicianId: z.string(),
  }),
});

export type ClinicalQueryRequest = z.infer<typeof ClinicalQueryRequestSchema>;

/**
 * ClinicalQueryResponse defines the schema for the advisory output.
 * All outputs are marked as draft and advisory.
 */
export const ClinicalQueryResponseSchema = z.object({
  advisoryText: z.string().describe('The AI-generated advisory content.'),
  evidenceReferences: z.array(z.object({
    sourceId: z.string(),
    description: z.string(),
    citation: z.string().optional(),
  })).describe('Citations for medical evidence used in the response.'),
  toolProposals: z.array(z.object({
    toolName: z.string(),
    parameters: z.record(z.unknown()),
    justification: z.string(),
  })).optional().describe('Proposed tools for clinician review.'),
  metadata: z.object({
    isDraft: z.literal(true),
    isAdvisory: z.literal(true),
    promptVersion: z.string(),
    confidenceScore: z.number().min(0).max(1).optional(),
  }),
});

export type ClinicalQueryResponse = z.infer<typeof ClinicalQueryResponseSchema>;

// TODO: Define API handlers and wire up to orchestration.
// No business logic, AI calls, or orchestration here.
