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

const logger = createLogger('provider-review-workflow');

export enum ProviderReviewOutcome {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  REQUEST_CHANGES = 'REQUEST_CHANGES'
}

export interface ProviderIdentity {
  id: string;
  type: ActorType.CLINICIAN | ActorType.SERVICE;
  tenantId: string;
  role: 'CLINICIAN' | 'SCHEDULER';
}

export interface ProviderReviewRequest {
  proposalId: string;
  outcome: ProviderReviewOutcome;
  reasonCode?: string; // Required for REJECTED
}

export interface ProviderReviewResponse {
  status: 'SUCCESS' | 'DENY' | 'ERROR';
  message: string;
  metadata: Record<string, unknown>;
}

/**
 * SL-08: Provider Review of Scheduling Proposals
 * 
 * This workflow handles the human-in-the-loop review of a scheduling proposal.
 * It transitions the proposal state but performs NO execution or calendar writes.
 * 
 * Hard Constraints:
 * - NO calendar writes.
 * - NO booking or rescheduling.
 * - NO autonomous approval.
 * - Fail-closed on invalid session or consent.
 */
export async function executeProviderReview(
  session: PatientSessionContext,
  provider: ProviderIdentity,
  request: ProviderReviewRequest
): Promise<ProviderReviewResponse> {
  const attemptId = randomUUID();

  // 1. Verify SL-03 Session (Fail-Closed)
  if (!session || !session.sessionId) {
    logger.error('FAIL_CLOSED:SL-08_INVALID_SESSION', 'Invalid or missing patient session', { attemptId });
    return {
      status: 'ERROR',
      message: 'Invalid patient session context.',
      metadata: { attemptId, reason: 'INVALID_SESSION' }
    };
  }

  // 2. Tenant Scoping Gate (Requirement: Deny-by-default on mismatch)
  if (provider.tenantId !== session.actor.tenantId) {
    logger.error('FAIL_CLOSED:SL-08_TENANT_MISMATCH', 'Provider tenant does not match patient tenant', {
      attemptId,
      providerTenant: provider.tenantId,
      patientTenant: session.actor.tenantId
    });
    return {
      status: 'DENY',
      message: 'Access denied: Tenant mismatch.',
      metadata: { attemptId, reason: 'TENANT_MISMATCH' }
    };
  }

  // 3. SL-01 Consent Gate Enforcement
  const gateRequest = createGateRequestFromSession(session, AccessPurpose.TREATMENT);
  const decision: GateDecision = evaluatePatientScopeGate(gateRequest);

  if (decision.effect === 'DENY') {
    logger.error('FAIL_CLOSED:SL-08_CONSENT_DENIED', 'Consent gate denied review action', {
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

  // 4. Validate Structured Review Outcome (Deterministic)
  if (request.outcome === ProviderReviewOutcome.REJECTED && !request.reasonCode) {
    logger.warn('INVALID_REQUEST:SL-08_MISSING_REASON', 'Rejection requires a structured reason code', { attemptId });
    return {
      status: 'ERROR',
      message: 'A structured reason code is required for rejections.',
      metadata: { attemptId, reason: 'MISSING_REASON_CODE' }
    };
  }

  // 5. Emit Audit Signal (Metadata-Only Audit Requirement)
  // 🚫 NO PHI allowed in logs.
  logger.info('AUDIT_SIGNAL:PROVIDER_REVIEW_COMPLETED', 'Provider review of scheduling proposal completed', {
    proposal_id: request.proposalId,
    review_outcome: request.outcome,
    reason_code: request.reasonCode,
    provider_role_type: provider.role,
    tenant_id: provider.tenantId,
    correlation_id: attemptId
  });

  // 6. Return Deterministic Outcome (HITL Boundary Enforced)
  // NOTE: This slice possesses no execution semantics. No calendar writes occur here.
  return {
    status: 'SUCCESS',
    message: `Proposal ${request.proposalId} has been ${request.outcome.toLowerCase()}.`,
    metadata: {
      attemptId,
      proposalId: request.proposalId,
      outcome: request.outcome
    }
  };
}
