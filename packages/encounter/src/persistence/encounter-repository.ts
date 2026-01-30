/**
 * Encounter Repository Interface
 */

import { EncounterRecord } from "./types.js";

export interface EncounterRepository {
  /**
   * Create a new encounter record.
   * Fails if the encounter already exists.
   */
  create(encounter: EncounterRecord): Promise<void>;

  /**
   * Get an encounter record by ID.
   * Returns null if not found.
   */
  getById(encounterId: string): Promise<EncounterRecord | null>;

  /**
   * Update an existing encounter record.
   */
  update(encounter: EncounterRecord): Promise<void>;
}
