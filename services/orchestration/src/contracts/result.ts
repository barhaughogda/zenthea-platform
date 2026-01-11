/**
 * E-03 §1.4 OrchestrationResult
 * The outcome of a command or the entire orchestration attempt.
 */
export interface OrchestrationResult {
  /** MUST be '1.0.0' */
  version: '1.0.0';
  /** Correlation to the initiation attempt (UUID) */
  attempt_id: string;
  /** Terminal state (E-01 §4.1 / MIG-06 §2.4) */
  outcome: 'SUCCEEDED' | 'REJECTED' | 'BLOCKED' | 'ERROR' | 'CANCELLED';
  /** Metadata-only audit/verification markers */
  evidence: Record<string, string | number | boolean>;
  /** REQUIRED for proof of audit acceptance (UUID) */
  audit_correlation_id: string;
}
