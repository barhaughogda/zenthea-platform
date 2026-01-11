import { 
  evaluatePatientScopeGate, 
  GateRequest, 
  GateDecision,
  AccessPurpose,
  PatientSessionContext,
  createGateRequestFromSession
} from '@starter/patient-scope-gate';
import { createLogger } from '@starter/observability';

const logger = createLogger('record-inquiry-workflow');

export interface RecordSummaryResponse {
  status: 'ALLOW' | 'DENY';
  summary?: string;
  disclaimer: string;
  labels: string[];
  justification?: string;
  metadata: Record<string, unknown>;
}

export const RECORD_SUMMARY_LABELS = [
  'Read-only',
  'Informational only',
  'Not medical advice'
];

export const RECORD_SUMMARY_DISCLAIMER = "This record summary is provided for informational purposes only. It is not medical advice and should not be used for self-diagnosis or treatment. Please consult with a healthcare professional for clinical decisions.";

/**
 * SL-02: Patient Record Inquiry (Read-Only Summary)
 * 
 * Strictly gated by SL-01 (Patient Scope Gate).
 * Emits metadata-only audit signals in all cases.
 */
export async function executeRecordSummaryInquiry(
  request: GateRequest | PatientSessionContext
): Promise<RecordSummaryResponse> {
  // 1. Convert session context to gate request if necessary (SL-03 Wiring)
  const gateRequest = 'sessionId' in request 
    ? createGateRequestFromSession(request, AccessPurpose.PATIENT_REQUEST)
    : request;

  // 2. Hard gate: SL-01 must pass
  const decision: GateDecision = evaluatePatientScopeGate(gateRequest);

  // Emit audit signal via logger
  logger.info('AUDIT_SIGNAL:SL-02_INQUIRY_ATTEMPT', 'Patient record inquiry initiated', {
    status: decision.effect,
    tenantId: gateRequest.tenantId,
    purpose: gateRequest.purpose,
    decisionId: decision.metadata.decisionId
  });

  if (decision.effect === 'DENY') {
    return {
      status: 'DENY',
      disclaimer: RECORD_SUMMARY_DISCLAIMER,
      labels: RECORD_SUMMARY_LABELS,
      justification: decision.metadata.justification as string,
      metadata: {
        ...decision.metadata,
        reasonCode: decision.reasonCode
      }
    };
  }

  // 3. If ALLOW: Return plain-language summary
  const mockSummary = `Patient Record Summary:
- Last Visit: 2025-12-10 (Follow-up)
- Active Conditions: Hypertension, Type 2 Diabetes
- Recent Labs: HbA1c 6.8% (2025-12-05)
- Medications: Lisinopril 10mg, Metformin 500mg
- Vitals: BP 128/82, Pulse 72 (Captured 2025-12-10)`;

  return {
    status: 'ALLOW',
    summary: mockSummary,
    disclaimer: RECORD_SUMMARY_DISCLAIMER,
    labels: RECORD_SUMMARY_LABELS,
    metadata: decision.metadata
  };
}
