/**
 * READ-ONLY / NON-OPERATIONAL
 * Booking surface landing page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import { SurfaceLayout } from "@/components/surface-layout";
import { MockCard } from "@/components/mock-card";

const CAN_DO = [
  "View upcoming appointments (mock data)",
  "Inspect appointment details",
  "Preview schedule availability",
  "Browse appointment types",
  "View provider calendars (read-only)",
];

const CANNOT_DO = [
  "Book new appointments",
  "Modify existing appointments",
  "Cancel appointments",
  "Send notifications or reminders",
  "Process payments or deposits",
  "Change availability settings",
];

const MOCK_APPOINTMENTS = [
  {
    id: "APT-001",
    title: "Annual Checkup",
    patient: "Jane Smith",
    provider: "Dr. Johnson",
    date: "2026-01-20",
    time: "10:00 AM",
    status: "SCHEDULED",
  },
  {
    id: "APT-002",
    title: "Follow-up Consultation",
    patient: "John Doe",
    provider: "Dr. Williams",
    date: "2026-01-21",
    time: "2:30 PM",
    status: "PENDING",
  },
  {
    id: "APT-003",
    title: "Lab Results Review",
    patient: "Emily Chen",
    provider: "Dr. Johnson",
    date: "2026-01-22",
    time: "11:00 AM",
    status: "CONFIRMED",
  },
];

export default function BookingPage() {
  return (
    <SurfaceLayout
      title="Booking (Read-Only)"
      description="View and inspect booking schedules, appointments, and availability. All data is static mock data for visualization purposes."
      canDo={CAN_DO}
      cannotDo={CANNOT_DO}
    >
      {/* Quick Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Booking Overview (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-green-600">8</p>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-yellow-600">3</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-blue-600">85%</p>
            <p className="text-sm text-muted-foreground">Availability</p>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_APPOINTMENTS.map((apt) => (
            <MockCard
              key={apt.id}
              title={apt.title}
              subtitle={`${apt.patient} with ${apt.provider}`}
              description={`${apt.date} at ${apt.time}`}
              status={apt.status}
              statusColor={
                apt.status === "CONFIRMED"
                  ? "green"
                  : apt.status === "PENDING"
                  ? "yellow"
                  : "blue"
              }
              inspectHref={`/booking/appointments?id=${apt.id}`}
            />
          ))}
        </div>
      </section>

      {/* Navigation to Detail Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Explore Booking Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MockCard
            title="Appointment Details"
            description="Inspect individual appointment records and their complete history"
            inspectHref="/booking/appointments"
          />
          <MockCard
            title="Schedule Overview"
            description="Preview provider schedules and availability patterns"
            previewHref="/booking/schedule"
          />
        </div>
      </section>
    </SurfaceLayout>
  );
}
