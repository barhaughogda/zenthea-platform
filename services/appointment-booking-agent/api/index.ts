import { z } from 'zod';

/**
 * Appointment Proposal Request Schema
 */
export const AppointmentProposalRequestSchema = z.object({
  patientId: z.string().uuid(),
  intent: z.string(),
  preferredTimeRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
  providerId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AppointmentProposalRequest = z.infer<typeof AppointmentProposalRequestSchema>;

/**
 * Appointment Proposal Response Schema
 */
export const AppointmentProposalResponseSchema = z.object({
  proposalId: z.string().uuid(),
  action: z.enum(['create', 'reschedule', 'cancel']),
  status: z.enum(['proposed', 'pending_approval', 'rejected']),
  details: z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    providerId: z.string().uuid(),
    location: z.string().optional(),
  }),
  requiresApproval: z.boolean(),
  validUntil: z.string().datetime().optional(),
});

export type AppointmentProposalResponse = z.infer<typeof AppointmentProposalResponseSchema>;

/**
 * Appointment Action Request Schema
 */
export const AppointmentActionRequestSchema = z.object({
  actionType: z.enum(['create', 'reschedule', 'cancel']),
  proposalId: z.string().uuid(),
  approvalToken: z.string().optional(),
  reason: z.string().optional(),
});

export type AppointmentActionRequest = z.infer<typeof AppointmentActionRequestSchema>;

/**
 * API Layer Entry Point
 */
export const API = {
  // Placeholder for future handler wiring
};
