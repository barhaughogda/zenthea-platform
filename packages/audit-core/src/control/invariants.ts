/**
 * DESIGN-ONLY SKELETON — EXECUTION NOT ENABLED
 */

import { AuditEvent } from "../types/audit-event.js";
import { EvidenceBundle } from "../types/evidence.js";

/**
 * Validates that all events in a bundle belong to the same domain.
 * Throws a deterministic error if the invariant is violated.
 */
export function validateDomainConsistency(bundle: EvidenceBundle, events: readonly AuditEvent[]): void {
  for (const event of events) {
    if (event.domain !== bundle.domain) {
      throw new Error(`INVARIANT VIOLATION: Event ${event.id} domain (${event.domain}) does not match bundle domain (${bundle.domain}).`);
    }
  }
}

/**
 * Validates that all records in a bundle reference valid audit event IDs.
 * Throws a deterministic error if correlation integrity is broken.
 */
export function validateCorrelationIntegrity(bundle: EvidenceBundle, eventIds: Set<string>): void {
  for (const record of bundle.records) {
    if (!eventIds.has(record.auditEventId)) {
      throw new Error(`INVARIANT VIOLATION: Evidence record references non-existent audit event ${record.auditEventId}.`);
    }
  }
}

/**
 * Enforces append-only semantics by verifying that a new bundle 
 * does not attempt to mutate or remove existing records.
 */
export function assertAppendOnly(oldBundle: EvidenceBundle, newBundle: EvidenceBundle): void {
  if (newBundle.records.length < oldBundle.records.length) {
    throw new Error("INVARIANT VIOLATION: Bundle records cannot be removed (append-only enforcement).");
  }
  
  for (let i = 0; i < oldBundle.records.length; i++) {
    if (JSON.stringify(oldBundle.records[i]) !== JSON.stringify(newBundle.records[i])) {
      throw new Error(`INVARIANT VIOLATION: Existing record at index ${i} has been modified.`);
    }
  }
}
