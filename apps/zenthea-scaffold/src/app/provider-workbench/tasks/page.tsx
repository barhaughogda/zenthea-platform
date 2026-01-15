/**
 * READ-ONLY / NON-OPERATIONAL
 * Provider task detail page for Phase AJ-03.
 * Execution remains blocked. Inspect-only view.
 */

import Link from "next/link";
import { ArrowLeft, ClipboardList, User, Clock, AlertTriangle } from "lucide-react";

const MOCK_TASK = {
  id: "TASK-001",
  title: "Review Lab Results",
  type: "Clinical Review",
  priority: "HIGH",
  status: "PENDING",
  createdDate: "January 14, 2026",
  dueDate: "January 15, 2026",
  patient: {
    name: "Jane Smith",
    id: "PAT-12345",
    dob: "March 15, 1985",
  },
  context: {
    testType: "Comprehensive Metabolic Panel",
    orderDate: "January 12, 2026",
    resultDate: "January 14, 2026",
    orderingProvider: "Dr. Sarah Johnson",
  },
  notes: "Patient has history of elevated glucose. Monitor for diabetes indicators.",
  results: [
    { test: "Glucose", value: "118 mg/dL", reference: "70-100 mg/dL", flag: "HIGH" },
    { test: "BUN", value: "16 mg/dL", reference: "7-20 mg/dL", flag: "NORMAL" },
    { test: "Creatinine", value: "0.9 mg/dL", reference: "0.6-1.2 mg/dL", flag: "NORMAL" },
    { test: "Sodium", value: "140 mEq/L", reference: "136-145 mEq/L", flag: "NORMAL" },
    { test: "Potassium", value: "4.2 mEq/L", reference: "3.5-5.0 mEq/L", flag: "NORMAL" },
  ],
  history: [
    { date: "2026-01-14 2:30 PM", action: "Task created from lab result" },
    { date: "2026-01-14 2:31 PM", action: "Assigned to Dr. Sarah Johnson" },
    { date: "2026-01-14 3:00 PM", action: "Marked as high priority" },
  ],
};

export default function TaskDetailPage() {
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
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{MOCK_TASK.title}</h1>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {MOCK_TASK.priority}
            </span>
          </div>
          <p className="text-muted-foreground">
            Task ID: {MOCK_TASK.id} | Inspect Mode
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
          {MOCK_TASK.status}
        </span>
      </div>

      {/* Task Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Details */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Task Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Type</dt>
              <dd>{MOCK_TASK.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd>{MOCK_TASK.createdDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Due Date</dt>
              <dd className="font-medium text-red-600">{MOCK_TASK.dueDate}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground mb-1">Notes</dt>
              <dd className="text-sm bg-muted/50 p-2 rounded">{MOCK_TASK.notes}</dd>
            </div>
          </dl>
        </div>

        {/* Patient Info */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="font-medium">{MOCK_TASK.patient.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Patient ID</dt>
              <dd>{MOCK_TASK.patient.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Date of Birth</dt>
              <dd>{MOCK_TASK.patient.dob}</dd>
            </div>
          </dl>
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Test Context</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Test Type</dt>
                <dd>{MOCK_TASK.context.testType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ordering Provider</dt>
                <dd>{MOCK_TASK.context.orderingProvider}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Lab Results */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Lab Results (Mock Data)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Test</th>
                <th className="p-3 text-left font-medium">Value</th>
                <th className="p-3 text-left font-medium">Reference Range</th>
                <th className="p-3 text-left font-medium">Flag</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TASK.results.map((result, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{result.test}</td>
                  <td className="p-3 font-medium">{result.value}</td>
                  <td className="p-3 text-muted-foreground">{result.reference}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        result.flag === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {result.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task History */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Task History
        </h2>
        <div className="space-y-3">
          {MOCK_TASK.history.map((event, index) => (
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
          This is a read-only inspection view. No task actions can be performed.
          You cannot complete, reassign, or modify this task. All data shown is
          static mock data for visualization purposes only.
        </p>
      </div>
    </div>
  );
}
