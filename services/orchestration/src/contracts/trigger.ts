/**
 * E-03 §1.1 OrchestrationTrigger
 * The entrypoint for all governed execution.
 */
export interface OrchestrationTrigger {
  /** MUST be '1.0.0' */
  version: '1.0.0';
  /** Stable identifier for the originating event (UUID) */
  trigger_id: string;
  /** MUST map to allowed categories (MIG-06 only) */
  classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST';
  /** Bounded metadata (no PII/PHI) */
  metadata: Record<string, string | number | boolean>;
  /** Trigger initiation time (ISO8601) */
  timestamp: string;
}
