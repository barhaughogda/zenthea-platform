/**
 * READ-ONLY / NON-OPERATIONAL
 * Booking schedule preview page for Phase AJ-03.
 * Execution remains blocked. Preview proposal only.
 */

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

const MOCK_SCHEDULE_DATA = {
  provider: "Dr. Sarah Johnson",
  date: "January 20, 2026",
  slots: [
    { time: "8:00 AM", status: "available" },
    { time: "8:30 AM", status: "available" },
    { time: "9:00 AM", status: "booked", patient: "Robert Wilson" },
    { time: "9:30 AM", status: "booked", patient: "Maria Garcia" },
    { time: "10:00 AM", status: "booked", patient: "Jane Smith" },
    { time: "10:30 AM", status: "available" },
    { time: "11:00 AM", status: "blocked", reason: "Lunch Break" },
    { time: "11:30 AM", status: "blocked", reason: "Lunch Break" },
    { time: "12:00 PM", status: "blocked", reason: "Lunch Break" },
    { time: "12:30 PM", status: "available" },
    { time: "1:00 PM", status: "booked", patient: "David Lee" },
    { time: "1:30 PM", status: "available" },
    { time: "2:00 PM", status: "available" },
    { time: "2:30 PM", status: "booked", patient: "Emma Brown" },
    { time: "3:00 PM", status: "available" },
    { time: "3:30 PM", status: "available" },
    { time: "4:00 PM", status: "booked", patient: "James Taylor" },
    { time: "4:30 PM", status: "available" },
  ],
};

const STATUS_STYLES = {
  available: "bg-green-100 text-green-700 border-green-200",
  booked: "bg-blue-100 text-blue-700 border-blue-200",
  blocked: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function SchedulePreviewPage() {
  const availableCount = MOCK_SCHEDULE_DATA.slots.filter(
    (s) => s.status === "available"
  ).length;
  const bookedCount = MOCK_SCHEDULE_DATA.slots.filter(
    (s) => s.status === "booked"
  ).length;

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
      <div>
        <h1 className="text-2xl font-bold">Schedule Preview (Proposal)</h1>
        <p className="text-muted-foreground">
          Preview provider schedule and availability patterns. This is a
          non-persistent visualization only.
        </p>
      </div>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">Provider</p>
          <p className="font-semibold">{MOCK_SCHEDULE_DATA.provider}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="font-semibold">{MOCK_SCHEDULE_DATA.date}</p>
        </div>
        <div className="surface-card">
          <p className="text-sm text-muted-foreground">Availability</p>
          <p className="font-semibold">
            {availableCount} available / {bookedCount} booked
          </p>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Daily Schedule (Mock Data)
        </h2>

        {/* Legend */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
            <span>Blocked</span>
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {MOCK_SCHEDULE_DATA.slots.map((slot, index) => (
            <div
              key={index}
              className={`p-3 rounded border text-center ${
                STATUS_STYLES[slot.status as keyof typeof STATUS_STYLES]
              }`}
            >
              <p className="font-medium">{slot.time}</p>
              <p className="text-xs mt-1">
                {slot.status === "booked" && slot.patient}
                {slot.status === "blocked" && slot.reason}
                {slot.status === "available" && "Open"}
              </p>
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
          would be able to propose changes to availability. In this read-only
          mode, no changes are possible and no data will be stored. Refreshing
          the page will show the same static mock data.
        </p>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">PREVIEW MODE</h3>
        <p className="text-sm">
          This is a preview-only view. No schedule modifications are possible.
          All data shown is static mock data. No booking actions can be
          performed.
        </p>
      </div>
    </div>
  );
}
