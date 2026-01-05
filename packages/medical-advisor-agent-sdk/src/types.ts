import { z } from 'zod';

/**
 * ClinicalQueryRequest defines the schema for incoming clinical questions or reasoning tasks.
 */
export const ClinicalQueryRequestSchema = z.object({
  query: z.string().min(1),
  context: z.object({
    patientId: z.string(),
    tenantId: z.string(),
    clinicalContext: z.record(z.unknown()).optional(),
  }),
  metadata: z.object({
    requestId: z.string().uuid(),
    clinicianId: z.string(),
  }),
});

export type ClinicalQueryRequest = z.infer<typeof ClinicalQueryRequestSchema>;

/**
 * ClinicalQueryResponse defines the schema for the advisory output.
 */
export const ClinicalQueryResponseSchema = z.object({
  advisoryText: z.string(),
  evidenceReferences: z.array(z.object({
    sourceId: z.string(),
    description: z.string(),
    citation: z.string().optional(),
  })),
  toolProposals: z.array(z.object({
    toolName: z.string(),
    parameters: z.record(z.unknown()),
    justification: z.string(),
  })).optional(),
  metadata: z.object({
    isDraft: z.literal(true),
    isAdvisory: z.literal(true),
    promptVersion: z.string(),
    confidenceScore: z.number().min(0).max(1).optional(),
  }),
});

export type ClinicalQueryResponse = z.infer<typeof ClinicalQueryResponseSchema>;
