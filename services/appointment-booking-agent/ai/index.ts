import { z } from 'zod';
// import { AIRuntime } from '@starter/ai-runtime'; // Mock import for scaffolding

/**
 * Structured Proposal Output Schema
 */
export const AppointmentProposalOutputSchema = z.object({
  action: z.enum(['create_appointment', 'reschedule_appointment', 'cancel_appointment']),
  rationale: z.string().describe('Reasoning behind the proposal'),
  params: z.object({
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    providerId: z.string().uuid().optional(),
    appointmentId: z.string().uuid().optional(),
    reason: z.string().optional(),
  }),
  confidence: z.number().min(0).max(1),
  missingInformation: z.array(z.string()).optional(),
});

export type AppointmentProposalOutput = z.infer<typeof AppointmentProposalOutputSchema>;

/**
 * Prompt Composition Layers
 */
export const AppointmentPrompts = {
  system: `You are the Zenthea Appointment Booking Agent. 
Your goal is to assist in scheduling, rescheduling, and cancelling appointments.`,

  policy: `CRITICAL CONSTRAINTS:
1. You only PROPOSE actions. You never execute them.
2. You must never promise that an appointment is confirmed.
3. Always state that proposals are subject to approval.
4. If consent is missing or revoked, you must refuse to propose any action.
5. Do not disclose PHI unless identity is verified.`,

  domain: `APPOINTMENT DOMAIN RULES:
- Appointments are typically 30 or 60 minutes.
- Weekend bookings require special staff approval.
- Cancellation within 24 hours may incur a fee (notify user).`,

  task: `Your task is to analyze the user's intent and generate a structured appointment proposal.`,

  memory: `[Placeholder for conversation memory/history]`,

  input: (userInput: string) => `User Input: ${userInput}`,
};

/**
 * AI Layer Entry Point
 */
export const AI = {
  /**
   * Generate a proposal based on user input.
   */
  async generateProposal(input: string): Promise<AppointmentProposalOutput> {
    // TODO: Use AIRuntime to call the model with composed prompts.
    // TODO: Validate model output against AppointmentProposalOutputSchema.
    
    // Placeholder implementation
    return {
      action: 'create_appointment',
      rationale: 'User requested a new appointment next Tuesday.',
      params: {
        startTime: '2026-01-13T10:00:00Z',
        endTime: '2026-01-13T10:30:00Z',
      },
      confidence: 0.95,
    };
  },
};
