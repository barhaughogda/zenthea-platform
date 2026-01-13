/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * This file contains a static, read-only patient context fixture for demo purposes.
 * It is used to grounded the non-executing assistant in a realistic patient context.
 */

export interface PatientContext {
  patientId: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  lastVisitDate: string;
  knownConditions: string[];
  currentMedications: string[];
  notes?: string;
}

export const DEMO_PATIENT_CONTEXT: PatientContext = {
  patientId: "PAT-12345",
  fullName: "Jane Doe",
  age: 42,
  dateOfBirth: "1983-05-15",
  lastVisitDate: "2025-11-20",
  knownConditions: [
    "Hypertension",
    "Type 2 Diabetes Mellitus",
    "Seasonal Allergies"
  ],
  currentMedications: [
    "Lisinopril 10mg daily",
    "Metformin 500mg twice daily",
    "Cetirizine 10mg as needed"
  ],
  notes: "Patient is compliant with medication. Planning for follow-up in 3 months."
};
