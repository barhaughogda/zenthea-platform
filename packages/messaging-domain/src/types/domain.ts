/**
 * Domain types for Messaging & Clinical Documentation.
 * Compliant with Phase W-05 and Phase Y-03.
 */

export type MessageId = string;
export type ThreadId = string;
export type DocumentId = string;
export type ParticipantId = string;
export type Timestamp = string;

export interface MessageThread {
  readonly id: ThreadId;
  readonly participants: readonly ParticipantId[];
  readonly createdAt: Timestamp;
  readonly lastActivityAt: Timestamp;
  readonly status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
}

export interface MessageDraft {
  readonly id: MessageId;
  readonly threadId: ThreadId;
  readonly senderId: ParticipantId;
  readonly content: string;
  readonly createdAt: Timestamp;
  readonly lastModifiedAt: Timestamp;
  readonly state: 'DRAFT';
}

export interface MessageSent {
  readonly id: MessageId;
  readonly threadId: ThreadId;
  readonly senderId: ParticipantId;
  readonly content: string;
  readonly sentAt: Timestamp;
  readonly state: 'SENT';
}

export interface ClinicalDocumentDraft {
  readonly id: DocumentId;
  readonly patientId: string;
  readonly authorId: ParticipantId;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Timestamp;
  readonly lastModifiedAt: Timestamp;
  readonly state: 'DRAFT';
}

export interface ClinicalDocumentCommitted {
  readonly id: DocumentId;
  readonly patientId: string;
  readonly authorId: ParticipantId;
  readonly title: string;
  readonly content: string;
  readonly committedAt: Timestamp;
  readonly hash: string; // Integrity verification
  readonly state: 'COMMITTED';
}

export interface ClinicalDocumentAmendment {
  readonly id: string;
  readonly documentId: DocumentId;
  readonly authorId: ParticipantId;
  readonly content: string;
  readonly amendedAt: Timestamp;
  readonly state: 'AMENDMENT';
}
