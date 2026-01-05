/**
 * Domain Layer for Consent Agent
 * 
 * Responsibilities:
 * - Define deterministic domain entities and value objects
 * - Encode invariants and validation rules
 * - Define allowed state transitions
 * 
 * Rules:
 * - Domain logic must be deterministic
 * - No AI, no IO, no side effects
 */

export type PurposeOfUse = 
  | 'TREATMENT'
  | 'PAYMENT'
  | 'OPERATIONS'
  | 'RESEARCH'
  | 'MARKETING'
  | 'EMERGENCY';

export type Jurisdiction = 'US-HIPAA' | 'EU-GDPR' | 'GLOBAL';

export interface ConsentScope {
  dataCategories: string[];
  exceptions?: string[];
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  actorId: string;
  purpose: PurposeOfUse;
  scope: ConsentScope;
  jurisdiction: Jurisdiction;
  grantedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  revocationReason?: string;
  version: string;
}

/**
 * Validates a consent record for internal consistency.
 */
export function validateConsentRecord(record: ConsentRecord): boolean {
  // TODO: Implement deterministic validation logic
  // - Ensure dates are valid
  // - Ensure scope and purpose are compatible
  return true;
}

/**
 * Checks if a consent record is currently active.
 */
export function isConsentActive(record: ConsentRecord, now: Date = new Date()): boolean {
  if (record.revokedAt) return false;
  if (record.expiresAt && record.expiresAt < now) return false;
  return record.grantedAt <= now;
}

// TODO: Add more deterministic domain logic based on docs/05-services/consent-agent.md
