/**
 * Encounter Record - Persistence Layer
 */

export interface EncounterRecord {
  tenantId: string;
  encounterId: string;
  patientId: string;
  status: "CREATED" | "ACTIVE" | "COMPLETED";
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
