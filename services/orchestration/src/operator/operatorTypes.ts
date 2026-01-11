/**
 * PR-13: Operator Invocation Input.
 * 
 * Defines the strict, synchronous input schema for the Operator UI/API adapter.
 */
export interface OperatorInvocationInput {
  /** The action intended by the operator. MUST be 'CLINICAL_DRAFT_ASSIST'. */
  action: 'CLINICAL_DRAFT_ASSIST';
  /** The stable identifier for the subject (patient) being processed. */
  subject_id: string;
  /** Bounded metadata (no PII/PHI allowed here). */
  metadata: Record<string, string | number | boolean>;
}
