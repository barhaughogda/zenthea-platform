/**
 * READ-ONLY / NON-OPERATIONAL
 * Provider Workbench surface landing page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import { SurfaceLayout } from "@/components/surface-layout";
import { MockCard } from "@/components/mock-card";

const CAN_DO = [
  "View provider schedules (mock data)",
  "Inspect task queues",
  "Preview patient assignments",
  "Browse clinical workflows",
  "View performance metrics (read-only)",
];

const CANNOT_DO = [
  "Complete or modify tasks",
  "Update patient records",
  "Change schedules",
  "Send clinical communications",
  "Prescribe medications",
  "Process referrals",
];

const MOCK_TASKS = [
  {
    id: "TASK-001",
    title: "Review Lab Results",
    patient: "Jane Smith",
    priority: "HIGH",
    dueDate: "2026-01-15",
    status: "PENDING",
  },
  {
    id: "TASK-002",
    title: "Approve Referral",
    patient: "John Doe",
    priority: "MEDIUM",
    dueDate: "2026-01-16",
    status: "PENDING",
  },
  {
    id: "TASK-003",
    title: "Sign Prescription",
    patient: "Emily Chen",
    priority: "HIGH",
    dueDate: "2026-01-15",
    status: "IN_REVIEW",
  },
];

export default function ProviderWorkbenchPage() {
  return (
    <SurfaceLayout
      title="Provider Workbench (Read-Only)"
      description="Inspect provider workflows, schedules, and task queues. All data is static mock data for visualization purposes."
      canDo={CAN_DO}
      cannotDo={CANNOT_DO}
    >
      {/* Quick Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Workbench Overview (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-primary">8</p>
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-red-600">3</p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-sm text-muted-foreground">Today&apos;s Patients</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-muted-foreground">Messages</p>
          </div>
        </div>
      </section>

      {/* Task Queue */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Task Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TASKS.map((task) => (
            <MockCard
              key={task.id}
              title={task.title}
              subtitle={`Patient: ${task.patient}`}
              description={`Due: ${task.dueDate}`}
              status={task.priority}
              statusColor={task.priority === "HIGH" ? "yellow" : "blue"}
              inspectHref={`/provider-workbench/tasks?id=${task.id}`}
            />
          ))}
        </div>
      </section>

      {/* Navigation to Detail Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Explore Workbench</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MockCard
            title="Task Details"
            description="Inspect individual task records, requirements, and clinical context"
            inspectHref="/provider-workbench/tasks"
          />
          <MockCard
            title="Provider Schedule"
            description="Preview provider daily schedule and patient appointments"
            previewHref="/provider-workbench/schedule"
          />
        </div>
      </section>
    </SurfaceLayout>
  );
}
