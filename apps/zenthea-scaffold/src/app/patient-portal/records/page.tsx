/**
 * READ-ONLY / NON-OPERATIONAL
 * Patient health records preview page for Phase AJ-03.
 * Execution remains blocked. Preview proposal only.
 */

import Link from "next/link";
import { ArrowLeft, FileText, Activity, Pill, Syringe } from "lucide-react";

const MOCK_RECORDS = {
  patient: {
    id: "PAT-12345",
    name: "Jane Smith",
  },
  visits: [
    {
      id: "VIS-001",
      date: "January 10, 2026",
      type: "Annual Wellness Visit",
      provider: "Dr. Sarah Johnson",
      summary: "Routine checkup. All vital signs normal. Recommended continued exercise regimen.",
    },
    {
      id: "VIS-002",
      date: "November 5, 2025",
      type: "Follow-up Consultation",
      provider: "Dr. Sarah Johnson",
      summary: "Follow-up for blood pressure monitoring. BP stable. Continue current medication.",
    },
    {
      id: "VIS-003",
      date: "August 20, 2025",
      type: "Sick Visit",
      provider: "Dr. Michael Chen",
      summary: "Upper respiratory infection. Prescribed antibiotics for 7 days.",
    },
  ],
  vitals: {
    lastRecorded: "January 10, 2026",
    bloodPressure: "118/76 mmHg",
    heartRate: "72 bpm",
    temperature: "98.4°F",
    weight: "145 lbs",
    height: "5'6\"",
    bmi: "23.4",
  },
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", status: "Active" },
    { name: "Vitamin D3", dosage: "2000 IU", frequency: "Once daily", status: "Active" },
    { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", status: "PRN" },
  ],
  allergies: [
    { allergen: "Penicillin", reaction: "Rash", severity: "Moderate" },
    { allergen: "Shellfish", reaction: "Anaphylaxis", severity: "Severe" },
  ],
};

export default function HealthRecordsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/patient-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patient Portal
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Health Records (Preview)</h1>
        <p className="text-muted-foreground">
          Preview health records for {MOCK_RECORDS.patient.name} (
          {MOCK_RECORDS.patient.id}). This is a non-persistent visualization only.
        </p>
      </div>

      {/* Vitals Card */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Vitals (Last recorded: {MOCK_RECORDS.vitals.lastRecorded})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Blood Pressure</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.bloodPressure}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Heart Rate</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.heartRate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.temperature}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.weight}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.height}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">BMI</p>
            <p className="font-semibold">{MOCK_RECORDS.vitals.bmi}</p>
          </div>
        </div>
      </div>

      {/* Medications & Allergies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medications */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Current Medications
          </h2>
          <div className="space-y-3">
            {MOCK_RECORDS.medications.map((med, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded"
              >
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.dosage} - {med.frequency}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    med.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Syringe className="h-5 w-5 text-red-500" />
            Known Allergies
          </h2>
          <div className="space-y-3">
            {MOCK_RECORDS.allergies.map((allergy, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100"
              >
                <div>
                  <p className="font-medium">{allergy.allergen}</p>
                  <p className="text-sm text-muted-foreground">
                    Reaction: {allergy.reaction}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    allergy.severity === "Severe"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {allergy.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit History */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Visit History (Mock Data)
        </h2>
        <div className="space-y-4">
          {MOCK_RECORDS.visits.map((visit) => (
            <div key={visit.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{visit.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {visit.date} | {visit.provider}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {visit.id}
                </span>
              </div>
              <p className="text-sm">{visit.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">PREVIEW MODE</h3>
        <p className="text-sm">
          This is a preview-only view. No health record modifications are
          possible. All data shown is static mock data. No real patient
          information is displayed. This interface does not connect to any
          electronic health record system.
        </p>
      </div>
    </div>
  );
}
