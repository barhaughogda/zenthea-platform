/**
 * DESIGN-ONLY SCAFFOLDING. EXECUTION IS BLOCKED. THIS FILE AUTHORIZES NO RUNTIME BEHAVIOR.
 *
 * Integration between @zenthea/messaging-domain and @zenthea/audit-core.
 * Provides deterministic mapping functions from domain state to audit structures.
 */

import { AuditEvent, EvidenceBundle } from "@zenthea/audit-core";
import { ensureExecutionBlocked } from "./execution-block.js";
import { MessageSent, ClinicalDocumentCommitted } from "./types/domain.js";

/**
 * Maps a MessageSent record to its conceptual AuditEvent representation.
 * 
 * @param message The sent message record.
 * @returns A deterministic AuditEvent structure.
 * @throws {Error} If execution is attempted.
 */
export function mapMessageSentToAuditEvent(message: MessageSent): AuditEvent {
  ensureExecutionBlocked();

  return {
    id: `audit-messaging-${message.id}`,
    eventType: "message_sent",
    actorRole: "SYSTEM_DESIGN_SKELETON",
    domain: "Messaging",
    entityId: message.id,
    timestamp: message.sentAt,
    correlationId: `correlation-${message.threadId}`,
    payload: {
      threadId: message.threadId,
      senderId: message.senderId,
      state: message.state,
    },
  };
}

/**
 * Maps a ClinicalDocumentCommitted record to its conceptual AuditEvent representation.
 * 
 * @param document The committed clinical document record.
 * @returns A deterministic AuditEvent structure.
 * @throws {Error} If execution is attempted.
 */
export function mapClinicalDocumentToAuditEvent(document: ClinicalDocumentCommitted): AuditEvent {
  ensureExecutionBlocked();

  return {
    id: `audit-clinical-${document.id}`,
    eventType: "clinical_document_committed",
    actorRole: "SYSTEM_DESIGN_SKELETON",
    domain: "ClinicalDocumentation",
    entityId: document.id,
    timestamp: document.committedAt,
    correlationId: `correlation-patient-${document.patientId}`,
    payload: {
      patientId: document.patientId,
      authorId: document.authorId,
      hash: document.hash,
      state: document.state,
    },
  };
}

/**
 * Maps a clinical document to a conceptual EvidenceBundle.
 * 
 * @param document The committed clinical document record.
 * @returns A deterministic EvidenceBundle structure.
 * @throws {Error} If execution is attempted.
 */
export function mapClinicalDocumentToEvidenceBundle(document: ClinicalDocumentCommitted): EvidenceBundle {
  ensureExecutionBlocked();

  const auditEvent = mapClinicalDocumentToAuditEvent(document);

  return {
    bundleId: `bundle-clinical-${document.id}`,
    domain: "ClinicalDocumentation",
    createdAt: document.committedAt,
    records: [
      {
        auditEventId: auditEvent.id,
        evidenceType: "DOCUMENT_INTEGRITY_PROOF",
        contentHash: document.hash,
        metadata: {
          schemaVersion: "1.0.0",
          authorId: document.authorId,
        },
      },
    ],
  };
}
