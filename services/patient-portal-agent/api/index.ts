import { z } from 'zod';

/**
 * Request schema for a patient query.
 * Used when a patient asks a question about their health data.
 */
export const PatientQueryRequestSchema = z.object({
  patientId: z.string().describe('The unique identifier of the patient making the query'),
  query: z.string().min(1).describe('The natural language query from the patient'),
  context: z.object({
    currentLocation: z.string().optional(),
    language: z.string().default('en'),
  }).optional(),
});

export type PatientQueryRequest = z.infer<typeof PatientQueryRequestSchema>;

/**
 * Response schema for a patient query.
 */
export const PatientQueryResponseSchema = z.object({
  answer: z.string().describe('The AI-generated, patient-friendly response'),
  references: z.array(z.object({
    type: z.string(),
    id: z.string(),
    description: z.string(),
  })).describe('List of health record items referenced in the answer'),
  disclaimer: z.string().describe('Mandatory medical disclaimer'),
  suggestedNextSteps: z.array(z.string()).optional(),
});

export type PatientQueryResponse = z.infer<typeof PatientQueryResponseSchema>;

/**
 * Request schema for a patient summary.
 * Used to get a summary of recent health activities.
 */
export const PatientSummaryRequestSchema = z.object({
  patientId: z.string().describe('The unique identifier of the patient'),
  timeframe: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }).optional(),
  categories: z.array(z.string()).optional().describe('Categories of data to include (e.g., labs, visits, meds)'),
});

export type PatientSummaryRequest = z.infer<typeof PatientSummaryRequestSchema>;

/**
 * TODO: Add API handlers and routing logic here.
 * Requirements:
 * - No business logic in this layer.
 * - No orchestration logic here.
 * - Strict validation using the schemas defined above.
 */
