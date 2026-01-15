/**
 * DESIGN-ONLY SKELETON — EXECUTION NOT ENABLED
 */

import { AuditEvent } from "./audit-event.js";

/**
 * An append-only record of evidence for a specific action.
 * Immutable after creation.
 */
export interface EvidenceRecord {
  readonly auditEventId: string;
  readonly evidenceType: string;
  readonly contentHash: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * A collection of evidence records forming a verifiable bundle.
 * Invariants are enforced on the collection as a whole.
 */
export interface EvidenceBundle {
  readonly bundleId: string;
  readonly domain: string;
  readonly records: readonly EvidenceRecord[];
  readonly createdAt: string; // Logical timestamp
}
