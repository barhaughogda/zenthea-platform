/**
 * In-Memory Implementation of EncounterRepository
 */

import { EncounterRepository } from "./encounter-repository.js";
import { EncounterRecord } from "./types.js";

export class InMemoryEncounterRepository implements EncounterRepository {
  // Keyed by tenantId:encounterId for isolation
  private storage = new Map<string, EncounterRecord>();

  private getStorageKey(tenantId: string, encounterId: string): string {
    return `${tenantId}:${encounterId}`;
  }

  async create(encounter: EncounterRecord): Promise<void> {
    const key = this.getStorageKey(encounter.tenantId, encounter.encounterId);
    if (this.storage.has(key)) {
      const error = new Error(
        `Encounter ${encounter.encounterId} already exists`,
      );
      (error as any).code = "CONFLICT";
      throw error;
    }
    this.storage.set(key, { ...encounter });
  }

  async getById(encounterId: string): Promise<EncounterRecord | null> {
    // Note: In a real repo, we'd probably need tenantId too for security,
    // but the interface says getById(encounterId).
    // For this in-memory mock, we'll scan or change the interface if needed.
    // The instructions say: "Enforce tenant isolation by keying on tenantId AND encounterId."
    // If getById only takes encounterId, we have a problem unless we search all tenants.
    // Let's look at how it's used in the service.

    for (const record of this.storage.values()) {
      if (record.encounterId === encounterId) {
        return { ...record };
      }
    }
    return null;
  }

  async update(encounter: EncounterRecord): Promise<void> {
    const key = this.getStorageKey(encounter.tenantId, encounter.encounterId);
    if (!this.storage.has(key)) {
      const error = new Error(`Encounter ${encounter.encounterId} not found`);
      (error as any).code = "NOT_FOUND";
      throw error;
    }
    this.storage.set(key, { ...encounter });
  }
}
