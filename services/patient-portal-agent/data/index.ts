/**
 * Data Layer for Patient Portal Agent.
 * Persistence abstraction for patient-scoped health data.
 */

import { PatientDataCategory } from '../domain/index.js';

export interface PatientDataRecord {
  id: string;
  patientId: string;
  category: PatientDataCategory;
  content: any;
  timestamp: string;
}

/**
 * Repository interface for accessing patient-scoped data.
 * Requirements:
 * - Minimum necessary retrieval (only retrieve what is needed for the query).
 * - Must be scoped to a single patient.
 * - No direct DB access in this interface.
 */
export interface IPatientDataRepository {
  /**
   * Retrieves health data for a specific patient and category.
   * Implementation must enforce patient-scoping.
   */
  getPatientRecords(patientId: string, category: PatientDataCategory): Promise<PatientDataRecord[]>;
  
  /**
   * Retrieves a summary of recent patient health activities.
   */
  getPatientSummary(patientId: string, timeframe: { start?: string; end?: string }): Promise<PatientDataRecord[]>;
}

/**
 * TODO: Implement concrete repositories or adapters here.
 * No concrete persistence implementation yet.
 * Ensure PHI/non-PHI separation.
 */
