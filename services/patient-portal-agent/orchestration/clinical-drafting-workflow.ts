import { 
  PatientSessionContext,
  AccessPurpose,
  evaluatePatientScopeGate,
  ActorType,
  GateDecision,
  createGateRequestFromSession
} from '@starter/patient-scope-gate';
import { createLogger } from '@starter/observability';
import { randomUUID } from 'crypto';

const logger = createLogger('clinical-drafting-workflow');

/**
 * SL-04 Mandatory Labels for Draft Content
 */
export const DRAFT_LABELS = {
  TITLE: 'DRAFT ONLY (AI-assisted)',
  LEGAL_DISCLAIMER: 'Not signed. Not a legal medical record.',
  REVIEW_REQUIREMENT: 'Requires clinician review and editing before any use.'
} as const;

export interface ClinicianIdentity {
  id: string;
  type: ActorType.CLINICIAN;
  tenantId: string;
  role: 'CLINICIAN';
}

export interface ClinicalDraftingRequest {
  intent: string; // e.g., "draft a SOAP note"
  clinicianConstraints?: {
    tone?: string;
    structure?: string;
    requiredSections?: string[];
  };
  encounterId?: string;
  patientId?: string; // If patient-scoped
}

export interface ClinicalDraftingResponse {
  status: 'SUCCESS' | 'DENY' | 'ERROR';
  draft?: {
    text: string;
    labels: string[];
    metadata: {
      provenance: {
        model: string;
        provider: string;
        version: string;
        promptTemplateVersion: string;
      };
      uncertaintyFlags: string[];
      isDeterministic: boolean;
    };
  };
  message: string;
  metadata: Record<string, unknown>;
}

/**
 * SL-04: Clinical Drafting (Clinician-Initiated)
 * 
 * This workflow provides clinician-initiated AI assistance for clinical documentation.
 * It produces strictly DRAFT/ADVISORY content and enforces fail-closed governance.
 * 
 * Hard Constraints:
 * - NO EHR writes.
 * - NO signing or attestation.
 * - NO autonomous action.
 * - Clinician-initiated only.
 */
export async function executeClinicalDrafting(
  session: PatientSessionContext | null,
  clinician: ClinicianIdentity,
  request: ClinicalDraftingRequest
): Promise<ClinicalDraftingResponse> {
  const attemptId = randomUUID();

  // 1. Validate Clinician Identity and Tenant Scope (Fail-Closed)
  if (!clinician || !clinician.id || clinician.type !== ActorType.CLINICIAN) {
    logger.error('FAIL_CLOSED:SL-04_INVALID_IDENTITY', 'Invalid or missing clinician identity', { attemptId });
    return {
      status: 'ERROR',
      message: 'Invalid clinician identity.',
      metadata: { attemptId, reason: 'INVALID_IDENTITY' }
    };
  }

  // 2. Patient-Scoped Gating (SL-01 / SL-03)
  if (request.patientId) {
    // Verify SL-03 Session exists for patient-scoped drafting
    if (!session || !session.sessionId || session.patientId !== request.patientId) {
      logger.error('FAIL_CLOSED:SL-04_SESSION_MISMATCH', 'Session mismatch for patient-scoped drafting', {
        attemptId,
        requestPatientId: request.patientId,
        sessionPatientId: session?.patientId
      });
      return {
        status: 'DENY',
        message: 'Access denied: Patient session context required for patient-scoped drafting.',
        metadata: { attemptId, reason: 'INVALID_SESSION' }
      };
    }

    // Verify Tenant Isolation
    if (clinician.tenantId !== session.actor.tenantId) {
      logger.error('FAIL_CLOSED:SL-04_TENANT_MISMATCH', 'Clinician tenant does not match patient tenant', {
        attemptId,
        clinicianTenant: clinician.tenantId,
        patientTenant: session.actor.tenantId
      });
      return {
        status: 'DENY',
        message: 'Access denied: Tenant mismatch.',
        metadata: { attemptId, reason: 'TENANT_MISMATCH' }
      };
    }

    // SL-01 Consent Gate Enforcement
    const gateRequest = createGateRequestFromSession(session, AccessPurpose.TREATMENT);
    const decision: GateDecision = evaluatePatientScopeGate(gateRequest);

    if (decision.effect === 'DENY') {
      logger.error('FAIL_CLOSED:SL-04_CONSENT_DENIED', 'Consent gate denied drafting action', {
        attemptId,
        reason: decision.reasonCode
      });
      return {
        status: 'DENY',
        message: 'Access denied: Patient consent verification failed.',
        metadata: { 
          attemptId, 
          reason: 'CONSENT_DENY',
          gateReason: decision.reasonCode 
        }
      };
    }
  }

  // 3. Emit Audit Signal (Metadata-Only Audit)
  // 🚫 NO PHI or draft content in logs.
  logger.info('AUDIT_SIGNAL:CLINICAL_DRAFTING_INITIATED', 'Clinician initiated clinical drafting', {
    intent: request.intent,
    clinician_id: clinician.id,
    tenant_id: clinician.tenantId,
    patient_ref: request.patientId ? 'PRESENT' : 'ABSENT',
    correlation_id: attemptId
  });

  // 4. Deterministic Draft Generation (Mocked for Phase E)
  // SL-04 requires deterministic output under fixed configuration.
  const draftText = `[DRAFT] Analysis of encounter intent: ${request.intent}. 
Requested structure: ${request.clinicianConstraints?.structure || 'Standard'}.
Required sections: ${(request.clinicianConstraints?.requiredSections || ['HPI', 'Assessment', 'Plan']).join(', ')}.

Findings: Placeholder advisory content based on provided context.
Uncertainty: No direct patient evidence retrieval performed in this slice.`;

  // 5. Enforce Mandatory Labeling
  const labels = [
    DRAFT_LABELS.TITLE,
    DRAFT_LABELS.LEGAL_DISCLAIMER,
    DRAFT_LABELS.REVIEW_REQUIREMENT
  ];

  return {
    status: 'SUCCESS',
    message: 'Clinical draft generated successfully.',
    draft: {
      text: draftText,
      labels,
      metadata: {
        provenance: {
          model: 'zenthea-clinical-draft-01',
          provider: 'zenthea-internal',
          version: '1.0.0',
          promptTemplateVersion: 'sl-04-standard-v1'
        },
        uncertaintyFlags: ['NO_DIRECT_EVIDENCE'],
        isDeterministic: true
      }
    },
    metadata: {
      attemptId,
      intent: request.intent
    }
  };
}
