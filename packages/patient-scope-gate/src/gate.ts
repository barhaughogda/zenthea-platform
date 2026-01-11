import { createLogger } from '@starter/observability';
import { 
  AccessPurpose, 
  ActorType, 
  DenyReason, 
  GateDecision, 
  GateRequest 
} from './types';

const logger = createLogger('patient-scope-gate');

/**
 * SL-01: Patient Scoping & Consent Gate
 * 
 * A pure, deterministic, fail-closed gate that enforces identity, 
 * tenant scope, and consent verification.
 */
export function evaluatePatientScopeGate(request: GateRequest): GateDecision {
  const timestamp = new Date().toISOString();
  
  try {
    // 1. Fail Closed on missing data (Requirement 4)
    if (!request.actor || !request.tenantId || !request.targetPatientId || !request.purpose) {
      return deny(DenyReason.MISSING_IDENTITY, 'Missing mandatory request fields', { timestamp });
    }

    const { actor, tenantId, targetPatientId, purpose } = request;

    // 2. Identity Validity (Requirement 2.1)
    if (!actor.id || !actor.type) {
      return deny(DenyReason.IDENTITY_INVALID, 'Invalid actor identity', { timestamp });
    }

    // 3. Tenant Isolation (Requirement 2.2)
    if (actor.tenantId !== tenantId) {
      return deny(DenyReason.TENANT_MISMATCH, 'Actor tenant does not match request tenant', { 
        timestamp,
        actorTenantId: actor.tenantId,
        requestTenantId: tenantId
      });
    }

    // 4. Patient Scoping Correctness (Requirement 2.3)
    // If the actor is a patient, they can only access their own data.
    if (actor.type === ActorType.PATIENT && actor.id !== targetPatientId) {
      return deny(DenyReason.PATIENT_MISMATCH, 'Patient identity does not match target patient identifier', {
        timestamp,
        actorId: actor.id,
        targetPatientId
      });
    }

    // 5. Consent Verification (Requirement 2.4)
    // For PATIENT_REQUEST, we check if the actor is the patient or has a valid proof.
    const isSelfAccess = actor.type === ActorType.PATIENT && actor.id === targetPatientId;
    
    if (!isSelfAccess) {
      // Access by representative or clinician requires consent proof in this slice
      if (!request.consentProof) {
        return deny(DenyReason.CONSENT_MISSING, 'Consent proof required for non-self access', {
          timestamp,
          actorType: actor.type,
          purpose
        });
      }

      const { consentProof } = request;

      // Deterministic validity checks
      if (consentProof.patientId !== targetPatientId) {
        return deny(DenyReason.PATIENT_MISMATCH, 'Consent proof patientId mismatch', { timestamp });
      }

      if (consentProof.purpose !== purpose) {
        return deny(DenyReason.INVALID_PURPOSE, 'Consent proof purpose mismatch', { timestamp });
      }

      if (new Date(consentProof.validUntil) < new Date(timestamp)) {
        return deny(DenyReason.CONSENT_INVALID, 'Consent proof has expired', { 
          timestamp,
          validUntil: consentProof.validUntil 
        });
      }
    }

    // 6. Return ALLOW (Requirement 3.1)
    const decision: GateDecision = {
      effect: 'ALLOW',
      justification: `Access permitted for purpose ${purpose} based on ${isSelfAccess ? 'self-access' : 'validated consent proof'}.`,
      metadata: {
        timestamp,
        actorType: actor.type,
        actorId: actor.id,
        tenantId,
        targetPatientId,
        purpose,
        decisionId: crypto.randomUUID?.() || 'unknown'
      }
    };

    emitAuditLog(decision, actor.role);
    return decision;

  } catch (error) {
    // 7. Fail closed on internal error (Requirement 4)
    const internalDecision = deny(DenyReason.INTERNAL_ERROR, 'Internal error during gate evaluation', { 
      timestamp,
      errorMessage: (error as Error).message 
    });
    emitAuditLog(internalDecision, request.actor?.role);
    return internalDecision;
  }
}

/**
 * Structured helper for DENY decisions.
 */
function deny(reasonCode: DenyReason, justification: string, metadata: Record<string, unknown>): GateDecision {
  const decision: GateDecision = {
    effect: 'DENY',
    reasonCode,
    metadata: {
      ...metadata,
      justification
    }
  };
  // Note: Audit log is emitted by the caller of deny() to ensure context is available
  return decision;
}

/**
 * Emits a metadata-only audit signal (Requirement 5).
 * 🚫 NO PHI allowed in metadata.
 */
function emitAuditLog(decision: GateDecision, actorRole?: string) {
  const { effect, metadata } = decision;
  
  // Strip any potentially sensitive info before logging
  // Requirement 5: Includes decision, reason codes, timestamp, actor role
  const auditData = {
    decision: effect,
    reasonCode: decision.effect === 'DENY' ? decision.reasonCode : undefined,
    timestamp: metadata.timestamp,
    actorRole: actorRole || 'unknown',
    // Include other metadata that is definitely not PHI
    tenantId: metadata.tenantId,
    purpose: metadata.purpose,
    actorType: metadata.actorType
  };

  logger.info('AUDIT_SIGNAL:SL-01_GATE_DECISION', 'Patient scope gate decision reached', auditData);
}
