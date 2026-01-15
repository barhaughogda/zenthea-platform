/**
 * DESIGN-ONLY SKELETON — EXECUTION NOT ENABLED
 */

/**
 * Represents a canonical audit event within the Zenthea platform.
 * Deterministic and serializable.
 */
export interface AuditEvent {
  /** Unique identifier for the audit event */
  readonly id: string;
  /** The type of event being recorded (e.g., 'record_created', 'access_granted') */
  readonly eventType: string;
  /** The role of the human actor performing the action */
  readonly actorRole: string;
  /** The execution domain this event belongs to (e.g., 'Scheduling', 'Messaging') */
  readonly domain: string;
  /** The identifier of the entity being acted upon */
  readonly entityId: string;
  /** Logical timestamp (sequential counter or ISO string placeholder, not system clock) */
  readonly timestamp: string;
  /** Correlation ID to link related events across domains */
  readonly correlationId: string;
  /** Read-only serializable payload containing event details */
  readonly payload: Readonly<Record<string, unknown>>;
}
