/**
 * E-03 §1.2 OrchestrationCommand
 * The instruction sent from the Orchestrator to an Agent or Service.
 */
export interface OrchestrationCommand {
  /** MUST be '1.0.0' */
  version: '1.0.0';
  /** Unique identifier for this specific command (UUID) */
  command_id: string;
  /** Correlated orchestration_attempt_id (E-01) (UUID) */
  attempt_id: string;
  /** Permitted command types only (MIG-06 only) */
  type: 'CLINICAL_DRAFT_GENERATION';
  /** Metadata-only; MUST NOT contain raw data */
  parameters: Record<string, string | number | boolean>;
  /** REQUIRED for all mutation commands */
  idempotency_key: string;
}
