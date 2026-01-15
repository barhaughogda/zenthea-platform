/**
 * READ-ONLY / NON-OPERATIONAL
 * Patient Portal surface landing page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import { SurfaceLayout } from "@/components/surface-layout";
import { MockCard } from "@/components/mock-card";

const CAN_DO = [
  "View patient profiles (mock data)",
  "Inspect health records",
  "Preview communication history",
  "Browse patient documents",
  "View appointment history (read-only)",
];

const CANNOT_DO = [
  "Create or modify patient records",
  "Send messages to patients",
  "Upload or modify documents",
  "Schedule appointments",
  "Update contact information",
  "Access real patient data",
];

const MOCK_PATIENTS = [
  {
    id: "PAT-12345",
    name: "Jane Smith",
    dob: "1985-03-15",
    lastVisit: "2026-01-10",
    status: "ACTIVE",
  },
  {
    id: "PAT-12346",
    name: "John Doe",
    dob: "1978-07-22",
    lastVisit: "2026-01-08",
    status: "ACTIVE",
  },
  {
    id: "PAT-12347",
    name: "Emily Chen",
    dob: "1992-11-30",
    lastVisit: "2025-12-15",
    status: "INACTIVE",
  },
];

export default function PatientPortalPage() {
  return (
    <SurfaceLayout
      title="Patient Portal (Read-Only)"
      description="View and inspect patient profiles, health records, and communication history. All data is static mock data for visualization purposes."
      canDo={CAN_DO}
      cannotDo={CANNOT_DO}
    >
      {/* Quick Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Portal Overview (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-primary">1,247</p>
            <p className="text-sm text-muted-foreground">Total Patients</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-green-600">1,102</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-yellow-600">145</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-blue-600">23</p>
            <p className="text-sm text-muted-foreground">New This Month</p>
          </div>
        </div>
      </section>

      {/* Recent Patients */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Patients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PATIENTS.map((patient) => (
            <MockCard
              key={patient.id}
              title={patient.name}
              subtitle={`ID: ${patient.id}`}
              description={`DOB: ${patient.dob} | Last Visit: ${patient.lastVisit}`}
              status={patient.status}
              statusColor={patient.status === "ACTIVE" ? "green" : "gray"}
              inspectHref={`/patient-portal/profile?id=${patient.id}`}
            />
          ))}
        </div>
      </section>

      {/* Navigation to Detail Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Explore Patient Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MockCard
            title="Patient Profile"
            description="Inspect detailed patient profile including demographics and contact information"
            inspectHref="/patient-portal/profile"
          />
          <MockCard
            title="Health Records"
            description="Preview patient health records, visit history, and clinical notes"
            previewHref="/patient-portal/records"
          />
        </div>
      </section>
    </SurfaceLayout>
  );
}
