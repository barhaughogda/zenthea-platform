/**
 * READ-ONLY / NON-OPERATIONAL
 * Provider schedule preview page for Phase AJ-03.
 * Execution remains blocked. Preview proposal only.
 */

import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

const MOCK_PROVIDER_SCHEDULE = {
  provider: {
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    location: "Main Clinic",
  },
  date: "January 15, 2026",
  appointments: [
    {
      time: "8:00 AM",
      duration: "30 min",
      patient: "Robert Wilson",
      type: "Follow-up",
      status: "Confirmed",
    },
    {
      time: "8:30 AM",
      duration: "45 min",
      patient: "Maria Garcia",
      type: "Annual Physical",
      status: "Confirmed",
    },
    {
      time: "9:15 AM",
      duration: "30 min",
      patient: "James Taylor",
      type: "Consultation",
      status: "Checked In",
    },
    {
      time: "10:00 AM",
      duration: "45 min",
      patient: "Jane Smith",
      type: "Annual Wellness",
      status: "Scheduled",
    },
    {
      time: "10:45 AM",
      duration: "30 min",
      patient: null,
      type: "Break",
      status: "Blocked",
    },
    {
      time: "11:15 AM",
      duration: "30 min",
      patient: "David Lee",
      type: "Sick Visit",
      status: "Scheduled",
    },
    {
      time: "12:00 PM",
      duration: "60 min",
      patient: null,
      type: "Lunch",
      status: "Blocked",
    },
    {
      time: "1:00 PM",
      duration: "30 min",
      patient: "Emma Brown",
      type: "Lab Review",
      status: "Scheduled",
    },
    {
      time: "1:30 PM",
      duration: "45 min",
      patient: "Michael Chen",
      type: "New Patient",
      status: "Confirmed",
    },
    {
      time: "2:15 PM",
      duration: "30 min",
      patient: null,
      type: "Available",
      status: "Open",
    },
    {
      time: "2:45 PM",
      duration: "30 min",
      patient: "Lisa Anderson",
      type: "Follow-up",
      status: "Scheduled",
    },
    {
      time: "3:15 PM",
      duration: "30 min",
      patient: null,
      type: "Admin Time",
      status: "Blocked",
    },
  ],
  summary: {
    totalAppointments: 9,
    confirmed: 3,
    scheduled: 4,
    checkedIn: 1,
    available: 1,
  },
};

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  "Checked In": "bg-purple-100 text-purple-700 border-purple-200",
  Blocked: "bg-gray-100 text-gray-500 border-gray-200",
  Open: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function ProviderSchedulePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/provider-workbench"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Provider Workbench
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Provider Schedule (Preview)</h1>
        <p className="text-muted-foreground">
          Preview daily schedule and patient appointments. This is a
          non-persistent visualization only.
        </p>
      </div>

      {/* Provider Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{MOCK_PROVIDER_SCHEDULE.provider.name}</p>
              <p className="text-sm text-muted-foreground">
                {MOCK_PROVIDER_SCHEDULE.provider.specialty}
              </p>
            </div>
          </div>
        </div>
        <div className="surface-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{MOCK_PROVIDER_SCHEDULE.date}</p>
              <p className="text-sm text-muted-foreground">
                {MOCK_PROVIDER_SCHEDULE.provider.location}
              </p>
            </div>
          </div>
        </div>
        <div className="surface-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {MOCK_PROVIDER_SCHEDULE.summary.totalAppointments} Appointments
              </p>
              <p className="text-sm text-muted-foreground">
                {MOCK_PROVIDER_SCHEDULE.summary.available} slot available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Daily Schedule (Mock Data)</h2>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-100 border border-purple-200" />
            <span>Checked In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
            <span>Blocked</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {MOCK_PROVIDER_SCHEDULE.appointments.map((apt, index) => (
            <div
              key={index}
              className={`p-4 rounded border ${STATUS_STYLES[apt.status]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="font-semibold">{apt.time}</p>
                    <p className="text-xs">{apt.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">
                      {apt.patient || apt.type}
                    </p>
                    {apt.patient && (
                      <p className="text-sm opacity-75">{apt.type}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-white/50 rounded">
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposal Notice */}
      <div className="surface-card border-dashed border-2 border-primary/30">
        <h3 className="font-semibold text-primary mb-2">
          Preview Proposal Mode
        </h3>
        <p className="text-sm text-muted-foreground">
          This schedule view is a preview proposal only. In a real system, you
          would be able to manage appointments, block time, and adjust
          availability. In this read-only mode, no changes are possible and no
          data will be stored.
        </p>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">PREVIEW MODE</h3>
        <p className="text-sm">
          This is a preview-only view. No schedule modifications are possible.
          You cannot book, cancel, or reschedule appointments. All data shown is
          static mock data for visualization purposes only.
        </p>
      </div>
    </div>
  );
}
