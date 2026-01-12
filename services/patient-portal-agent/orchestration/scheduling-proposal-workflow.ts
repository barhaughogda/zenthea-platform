import { 
  PatientSessionContext,
  AccessPurpose,
  createGateRequestFromSession,
  evaluatePatientScopeGate,
  GateDecision
} from '@starter/patient-scope-gate';
import { ToolProposal } from '@starter/ai-runtime';
import { createLogger } from '@starter/observability';
import { randomUUID } from 'crypto';

const logger = createLogger('scheduling-proposal-workflow');

export interface SchedulingProposalRequest {
  intent: string;
  preferredTime?: string;
  appointmentType?: string;
  reason?: string;
}

export interface SchedulingProposalResponse {
  status: 'PENDING' | 'DENY' | 'ERROR';
  proposal?: ToolProposal;
  message: string;
  metadata: Record<string, unknown>;
}

/**
 * SL-07: Scheduling Proposal (Patient-Initiated)
 * 
 * This workflow handles a patient's request to schedule an appointment.
 * It produces a structured proposal but performs NO execution.
 * 
 * Constraints:
 * - Proposal-only boundary.
 * - No calendar writes or bookings.
 * - Depends on SL-03 PatientSessionContext.
 * - Fail-closed on missing identity or invalid session.
 */
export async function executeSchedulingProposal(
  session: PatientSessionContext,
  request: SchedulingProposalRequest
): Promise<SchedulingProposalResponse> {
  const attemptId = randomUUID();

  // 1. Verify SL-03 Session (Implicitly verified by session existence and type)
  if (!session || !session.sessionId || session.actor.type !== 'PATIENT') {
    logger.error('FAIL_CLOSED:SL-07_INVALID_SESSION', 'Invalid or missing patient session', { attemptId });
    return {
      status: 'ERROR',
      message: 'Invalid session context.',
      metadata: { attemptId, reason: 'INVALID_SESSION' }
    };
  }

  // 2. Perform SL-01 Gate Check (Internal Requirement for Patient-Scoped actions)
  const gateRequest = createGateRequestFromSession(session, AccessPurpose.PATIENT_REQUEST);
  const decision: GateDecision = evaluatePatientScopeGate(gateRequest);

  // Emit audit signal
  logger.info('AUDIT_SIGNAL:SL-07_PROPOSAL_ATTEMPT', 'Scheduling proposal attempt initiated', {
    attemptId,
    status: decision.effect,
    tenantId: session.actor.tenantId,
    patientId: session.actor.id,
    decisionId: decision.metadata.decisionId
  });

  if (decision.effect === 'DENY') {
    return {
      status: 'DENY',
      message: 'Access denied by safety gate.',
      metadata: { 
        attemptId, 
        decisionId: decision.metadata.decisionId,
        reason: 'GATE_DENY' 
      }
    };
  }

  // 3. Generate Structured Proposal (Deterministic Mock for SL-07)
  // Per SL-07 documentation, we must emit a structured proposal to pending state.
  
  const proposal: ToolProposal = {
    proposal_id: randomUUID(),
    proposed_by: 'patient-portal-agent',
    timestamp: new Date().toISOString(),
    domain: 'scheduling',
    tool: {
      name: 'scheduling:create_appointment_proposal',
      version: '1.0.0'
    },
    intent: {
      summary: `Propose ${request.appointmentType || 'appointment'} based on patient request`,
      reasoning: `Patient requested scheduling with intent: "${request.intent}"`
    },
    parameters: {
      patientId: session.actor.id,
      appointmentType: request.appointmentType || 'general_checkup',
      preferredTime: request.preferredTime || 'ASAP',
      reason: request.reason || request.intent,
      status: 'PENDING_APPROVAL'
    },
    risk_level: 'medium',
    approval_required: true,
    compliance_context: {
      gdpr: true,
      hipaa: true
    },
    idempotency_key: `sched-prop-${session.actor.id}-${Date.now()}`,
    rollback_supported: true
  };

  // 4. Return Proposal (NO Execution)
  logger.info('AUDIT_SIGNAL:SL-07_PROPOSAL_GENERATED', 'Scheduling proposal generated and awaiting approval', {
    attemptId,
    proposalId: proposal.proposal_id,
    patientId: session.actor.id
  });

  return {
    status: 'PENDING',
    proposal,
    message: 'Your scheduling request has been received and is pending approval. No booking has been made yet.',
    metadata: { 
      attemptId, 
      proposalId: proposal.proposal_id 
    }
  };
}
