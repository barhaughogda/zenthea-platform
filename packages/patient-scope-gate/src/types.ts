import { z } from 'zod';

/**
 * AccessPurpose defines the enumerated reasons for PHI-bearing access.
 * Grounded in HIPAA Privacy Rule and consent-agent-sdk.
 */
export enum AccessPurpose {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  OPERATIONS = 'OPERATIONS',
  RESEARCH = 'RESEARCH',
  MARKETING = 'MARKETING',
  EMERGENCY = 'EMERGENCY',
  PATIENT_REQUEST = 'PATIENT_REQUEST'
}

/**
 * ActorType defines the platform-recognized identity categories.
 */
export enum ActorType {
  PATIENT = 'PATIENT',
  REPRESENTATIVE = 'REPRESENTATIVE',
  CLINICIAN = 'CLINICIAN',
  SERVICE = 'SERVICE'
}

/**
 * DenyReason provides structured reason codes for gate rejections.
 */
export enum DenyReason {
  MISSING_IDENTITY = 'MISSING_IDENTITY',
  TENANT_MISMATCH = 'TENANT_MISMATCH',
  PATIENT_MISMATCH = 'PATIENT_MISMATCH',
  CONSENT_MISSING = 'CONSENT_MISSING',
  CONSENT_INVALID = 'CONSENT_INVALID',
  INVALID_PURPOSE = 'INVALID_PURPOSE',
  AMBIGUOUS_STATE = 'AMBIGUOUS_STATE',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

/**
 * ActorIdentity represents the verified identity of the requester.
 */
export interface ActorIdentity {
  id: string;
  type: ActorType;
  tenantId: string;
  role?: string;
}

/**
 * GateRequest represents the input to SL-01.
 */
export interface GateRequest {
  actor: ActorIdentity;
  tenantId: string;
  targetPatientId: string;
  purpose: AccessPurpose;
  /**
   * Optional consent proof. Since the gate is synchronous, 
   * the caller must provide the proof of consent if required.
   */
  consentProof?: {
    signature: string;
    validUntil: string;
    patientId: string;
    purpose: AccessPurpose;
  };
}

/**
 * GateDecision represents the fail-closed outcome of SL-01.
 */
export type GateDecision = 
  | {
      effect: 'ALLOW';
      justification: string;
      metadata: Record<string, unknown>;
    }
  | {
      effect: 'DENY';
      reasonCode: DenyReason;
      metadata: Record<string, unknown>;
    };

/**
 * PatientSessionContext represents the authoritative contract for 
 * patient-scoped session data (SL-03).
 */
export interface PatientSessionContext {
  sessionId: string;
  actor: {
    id: string;
    type: 'PATIENT';
    tenantId: string;
  };
  sessionMetadata: {
    issuedAt: string; // ISO-8601
    expiresAt: string; // ISO-8601
    lastVerifiedAt: string; // ISO-8601
  };
  consentProof?: {
    signature: string;
    validUntil: string;
    scope: string[];
  };
}

/**
 * Input for establishing a patient session (SL-03).
 */
export interface SessionEstablishmentInput {
  authToken: string;
  tenantId: string;
  patientId: string;
  // Optional pre-verified consent status/proof
  consentProof?: {
    signature: string;
    validUntil: string;
    scope: string[];
  };
}
