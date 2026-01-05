import { z } from 'zod';

/**
 * API Layer for Consent Agent
 * 
 * Responsibilities:
 * - Define request and response schemas for consent operations
 * - Enforce strict input validation
 * - Provide a deterministic interface for other services
 * 
 * TODO: Based on docs/05-services/consent-agent.md
 * - Ensure schemas support HIPAA and GDPR requirements
 * - Integrate with platform auth and tenant context
 */

export const ConsentGrantRequestSchema = z.object({
  patientId: z.string().uuid(),
  actorId: z.string(),
  purpose: z.string(),
  scope: z.array(z.string()),
  duration: z.string().optional(),
  jurisdiction: z.string(),
});

export const ConsentRevokeRequestSchema = z.object({
  consentRecordId: z.string().uuid(),
  reason: z.string().optional(),
});

export const ConsentCheckRequestSchema = z.object({
  patientId: z.string().uuid(),
  actorId: z.string(),
  purpose: z.string(),
  resourceId: z.string().optional(),
});

export const ConsentDecisionResponseSchema = z.object({
  allowed: z.boolean(),
  decisionId: z.string().uuid(),
  reason: z.string(), // Deterministic reason code
  policyVersion: z.string(),
  explanation: z.string().optional(), // AI-generated explanation (optional/advisory)
});

export type ConsentGrantRequest = z.infer<typeof ConsentGrantRequestSchema>;
export type ConsentRevokeRequest = z.infer<typeof ConsentRevokeRequestSchema>;
export type ConsentCheckRequest = z.infer<typeof ConsentCheckRequestSchema>;
export type ConsentDecisionResponse = z.infer<typeof ConsentDecisionResponseSchema>;
