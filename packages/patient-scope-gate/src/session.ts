import { createLogger } from '@starter/observability';
import { 
  PatientSessionContext, 
  SessionEstablishmentInput, 
  DenyReason,
  GateRequest,
  AccessPurpose
} from './types';

const logger = createLogger('patient-session-establishment');

/**
 * SL-03: Patient Session Establishment
 * 
 * Synchronously establishes a deterministic PatientSessionContext from 
 * already-authenticated metadata.
 */
export function establishPatientSessionContext(input: SessionEstablishmentInput): PatientSessionContext {
  const timestamp = new Date().toISOString();
  
  // 1. Validate mandatory fields (Fail-Closed)
  if (!input.authToken || !input.tenantId || !input.patientId) {
    const error = new Error('MISSING_MANDATORY_SESSION_FIELDS');
    emitAuditLog('DENY', DenyReason.MISSING_IDENTITY, input.tenantId, input.patientId);
    throw error;
  }

  // 2. Deterministic session identifier (Requirement: No random identifiers)
  // We use a deterministic prefix with tenant and patient scope.
  // In a production system, this might be a hash of the authToken.
  const sessionId = `psession_${input.tenantId}_${input.patientId}`;

  // 3. Define session lifetime (Default 1 hour)
  const issuedAt = timestamp;
  const expiresAt = new Date(new Date(issuedAt).getTime() + 3600 * 1000).toISOString();

  // 4. Construct Context (ADR-001)
  const context: PatientSessionContext = {
    sessionId,
    actor: {
      id: input.patientId,
      type: 'PATIENT',
      tenantId: input.tenantId,
    },
    sessionMetadata: {
      issuedAt,
      expiresAt,
      lastVerifiedAt: issuedAt,
    },
    consentProof: input.consentProof
  };

  // 5. Audit Success
  emitAuditLog('ALLOW', undefined, input.tenantId, input.patientId);

  return context;
}

/**
 * Helper to satisfy SL-02 operability by wiring PatientSessionContext 
 * to the SL-01 GateRequest contract.
 */
export function createGateRequestFromSession(
  session: PatientSessionContext, 
  purpose: AccessPurpose = AccessPurpose.PATIENT_REQUEST
): GateRequest {
  return {
    actor: {
      ...session.actor,
      role: 'patient'
    },
    tenantId: session.actor.tenantId,
    targetPatientId: session.actor.id,
    purpose,
    consentProof: session.consentProof ? {
      signature: session.consentProof.signature,
      validUntil: session.consentProof.validUntil,
      patientId: session.actor.id,
      purpose
    } : undefined
  };
}

/**
 * Emits metadata-only audit signals for SL-03.
 * 🚫 NO PHI allowed.
 */
function emitAuditLog(
  effect: 'ALLOW' | 'DENY', 
  reasonCode?: DenyReason, 
  tenantId?: string, 
  patientId?: string
) {
  const auditData = {
    decision: effect,
    reasonCode,
    tenantId: tenantId || 'unknown',
    // We log that A patient session was attempted, but not WHICH patient (metadata-only)
    actorType: 'PATIENT',
    timestamp: new Date().toISOString(),
  };

  logger.info('AUDIT_SIGNAL:SL-03_SESSION_ESTABLISHMENT', 'Patient session establishment decision reached', auditData);
}
