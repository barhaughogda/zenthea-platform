/**
 * DESIGN-ONLY SCAFFOLDING. EXECUTION IS BLOCKED. THIS FILE AUTHORIZES NO RUNTIME BEHAVIOR.
 *
 * Integration between @zenthea/scheduling-domain and @zenthea/audit-core.
 * Provides deterministic mapping functions from domain state to audit structures.
 */

import { AuditEvent, EvidenceBundle } from "@zenthea/audit-core";
import { assertSchedulingExecutionBlocked } from "./execution-block.js";
import { SchedulingRecord } from "./types/scheduling-record.js";

/**
 * Maps a SchedulingRecord to its conceptual AuditEvent representation.
 * 
 * @param record The scheduling record to map.
 * @returns A deterministic AuditEvent structure.
 * @throws {Error} If execution is attempted.
 */
export function mapSchedulingRecordToAuditEvent(record: SchedulingRecord): AuditEvent {
  assertSchedulingExecutionBlocked();

  return {
    id: `audit-scheduling-${record.id}`,
    eventType: `scheduling_record_${record.state.toLowerCase()}`,
    actorRole: "SYSTEM_DESIGN_SKELETON",
    domain: "Scheduling",
    entityId: record.id,
    timestamp: record.modifiedAt.toISOString(),
    correlationId: record.correlationId,
    payload: {
      state: record.state,
      submitterId: record.submitterId,
      confirmerId: record.confirmerId,
      purpose: record.parameters.purpose,
    },
  };
}

/**
 * Maps a SchedulingRecord to a conceptual EvidenceBundle.
 * 
 * @param record The scheduling record to map.
 * @returns A deterministic EvidenceBundle structure.
 * @throws {Error} If execution is attempted.
 */
export function mapSchedulingRecordToEvidenceBundle(record: SchedulingRecord): EvidenceBundle {
  assertSchedulingExecutionBlocked();

  const auditEvent = mapSchedulingRecordToAuditEvent(record);

  return {
    bundleId: `bundle-scheduling-${record.id}`,
    domain: "Scheduling",
    createdAt: record.modifiedAt.toISOString(),
    records: [
      {
        auditEventId: auditEvent.id,
        evidenceType: "DOMAIN_STATE_SNAPSHOT",
        contentHash: "DESIGN_ONLY_HASH_PLACEHOLDER",
        metadata: {
          schemaVersion: "1.0.0",
          originatingSurface: "scheduling-domain-skeleton",
        },
      },
    ],
  };
}
