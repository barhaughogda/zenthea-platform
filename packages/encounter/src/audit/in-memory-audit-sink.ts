import { AuditSink, AuditPayload } from "./audit-sink.js";

/**
 * In-Memory Audit Sink for testing and development
 */
export class InMemoryAuditSink implements AuditSink {
  public events: AuditPayload[] = [];

  async emit(payload: AuditPayload): Promise<void> {
    this.events.push(payload);
  }

  clear(): void {
    this.events = [];
  }
}
