/**
 * READ-ONLY / NON-OPERATIONAL
 * Booking appointments detail page for Phase AJ-03.
 * Execution remains blocked. Inspect-only view.
 */

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Stethoscope } from "lucide-react";

const MOCK_APPOINTMENT_DETAIL = {
  id: "APT-001",
  title: "Annual Checkup",
  type: "Preventive Care",
  patient: {
    name: "Jane Smith",
    id: "PAT-12345",
    phone: "(555) 123-4567",
    email: "jane.smith@example.com",
  },
  provider: {
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    location: "Main Clinic - Room 204",
  },
  schedule: {
    date: "January 20, 2026",
    time: "10:00 AM - 10:45 AM",
    duration: "45 minutes",
  },
  status: "SCHEDULED",
  notes: "Patient requested morning appointment. Annual wellness visit with standard lab work.",
  history: [
    { date: "2026-01-10", action: "Appointment requested by patient" },
    { date: "2026-01-11", action: "Appointment confirmed by staff" },
    { date: "2026-01-12", action: "Reminder sent to patient" },
  ],
};

export default function AppointmentDetailPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/booking"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Booking
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointment Details (Inspect)</h1>
          <p className="text-muted-foreground">
            Read-only view of appointment record {MOCK_APPOINTMENT_DETAIL.id}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
          {MOCK_APPOINTMENT_DETAIL.status}
        </span>
      </div>

      {/* Appointment Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointment Details */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Appointment Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Title</dt>
              <dd className="font-medium">{MOCK_APPOINTMENT_DETAIL.title}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Type</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="text-sm">{MOCK_APPOINTMENT_DETAIL.notes}</dd>
            </div>
          </dl>
        </div>

        {/* Schedule Details */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Schedule
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Date</dt>
              <dd className="font-medium">{MOCK_APPOINTMENT_DETAIL.schedule.date}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Time</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.schedule.time}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Duration</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.schedule.duration}</dd>
            </div>
          </dl>
        </div>

        {/* Patient Details */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="font-medium">{MOCK_APPOINTMENT_DETAIL.patient.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Patient ID</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.patient.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Contact</dt>
              <dd className="text-sm">
                {MOCK_APPOINTMENT_DETAIL.patient.phone}
                <br />
                {MOCK_APPOINTMENT_DETAIL.patient.email}
              </dd>
            </div>
          </dl>
        </div>

        {/* Provider Details */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Provider
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="font-medium">{MOCK_APPOINTMENT_DETAIL.provider.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Specialty</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.provider.specialty}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Location</dt>
              <dd>{MOCK_APPOINTMENT_DETAIL.provider.location}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* History Timeline */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Appointment History (Read-Only)</h2>
        <div className="space-y-3">
          {MOCK_APPOINTMENT_DETAIL.history.map((event, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="text-muted-foreground">{event.date}</p>
                <p>{event.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">INSPECT MODE</h3>
        <p className="text-sm">
          This is a read-only inspection view. No modifications to this appointment
          record are possible. All data shown is static mock data for visualization
          purposes only.
        </p>
      </div>
    </div>
  );
}
