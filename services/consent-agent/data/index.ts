import { ConsentRecord } from '../domain/index.js';

/**
 * Data Layer for Consent Agent
 * 
 * Responsibilities:
 * - Define repository interfaces for consent and audit records
 * - Enforce data ownership boundaries
 * 
 * Requirements:
 * - All data must be encrypted at rest.
 * - Audit records must be immutable.
 * - No direct model SDK usage.
 */

export interface ConsentRepository {
  /**
   * Retrieves an active consent record for a patient and purpose.
   */
  findActiveByPatient(patientId: string, purpose: string): Promise<ConsentRecord | null>;

  /**
   * Saves a new or updated consent record.
   * TODO: Ensure encryption of sensitive fields.
   */
  save(record: ConsentRecord): Promise<void>;

  /**
   * Retrieves full consent history for a patient.
   */
  getHistory(patientId: string): Promise<ConsentRecord[]>;
}

export interface AuditRecord {
  timestamp: Date;
  action: 'GRANT' | 'REVOKE' | 'CHECK';
  subjectId: string;
  actorId: string;
  decision: 'ALLOW' | 'DENY';
  reason: string;
  policyVersion: string;
  jurisdiction: string;
}

export interface ConsentAuditRepository {
  /**
   * Records a consent-related event to the immutable audit store.
   */
  logEvent(event: AuditRecord): Promise<void>;

  /**
   * Retrieves audit records for a patient or actor.
   */
  query(filter: Partial<AuditRecord>): Promise<AuditRecord[]>;
}

// TODO: Implement concrete repositories using the platform-approved database (e.g., PostgreSQL, DynamoDB)
// TODO: Ensure migrations and schema definitions are versioned.
