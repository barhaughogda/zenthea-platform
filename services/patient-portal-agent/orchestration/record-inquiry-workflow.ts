import { 
  evaluatePatientScopeGate, 
  GateRequest, 
  GateDecision,
  AccessPurpose
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
export async function executeRecordSummaryInquiry(request: GateRequest): Promise<RecordSummaryResponse> {
  // 1. Hard gate: SL-01 must pass
  // Requirement: If DENY, return explanation, no technical errors.
  const decision: GateDecision = evaluatePatientScopeGate(request);

  // Emit audit signal via logger (already handled by SL-01 gate, but we can add SL-02 specific context)
  logger.info('AUDIT_SIGNAL:SL-02_INQUIRY_ATTEMPT', 'Patient record inquiry initiated', {
    status: decision.effect,
    tenantId: request.tenantId,
    purpose: request.purpose,
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

  // 2. If ALLOW: Return plain-language summary
  // Requirement: Mock or static read-only data.
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
