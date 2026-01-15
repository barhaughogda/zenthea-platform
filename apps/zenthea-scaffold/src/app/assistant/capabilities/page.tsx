/**
 * READ-ONLY / NON-OPERATIONAL
 * Assistant capabilities inspection page for Phase AJ-03.
 * Execution remains blocked. Inspect-only view.
 */

import Link from "next/link";
import { ArrowLeft, Bot, Lightbulb, BookOpen, MessageCircle, HelpCircle } from "lucide-react";

const MOCK_CAPABILITY = {
  id: "CAP-001",
  name: "Appointment Assistance",
  category: "Patient Support",
  description:
    "The Appointment Assistance capability enables the assistant to help patients understand their options for scheduling, rescheduling, and managing appointments.",
  status: "Active",
  examples: 12,
  topics: [
    "Appointment types and durations",
    "Scheduling availability",
    "Preparation requirements",
    "Cancellation policies",
    "Follow-up scheduling",
  ],
  responses: [
    {
      trigger: "What appointments are available?",
      response:
        "We offer Annual Wellness Visits, Follow-up Consultations, Sick Visits, Specialist Referrals, and Preventive Screenings. Each type is designed for different healthcare needs.",
    },
    {
      trigger: "How do I prepare for my appointment?",
      response:
        "Please arrive 10-15 minutes early, bring your insurance card and ID, prepare a list of current medications, and note any questions for your provider.",
    },
    {
      trigger: "Can I reschedule my appointment?",
      response:
        "Yes, appointments can be rescheduled with at least 24 hours notice. Please contact our scheduling team or use the patient portal to find a new time.",
    },
  ],
  limitations: [
    "Cannot access real-time schedule availability",
    "Cannot book or modify actual appointments",
    "Cannot provide medical advice",
    "Cannot access patient-specific records",
  ],
};

const ALL_CAPABILITIES = [
  {
    id: "CAP-001",
    name: "Appointment Assistance",
    icon: MessageCircle,
    examples: 12,
  },
  {
    id: "CAP-002",
    name: "Health Information",
    icon: BookOpen,
    examples: 24,
  },
  {
    id: "CAP-003",
    name: "Navigation Help",
    icon: Lightbulb,
    examples: 18,
  },
  {
    id: "CAP-004",
    name: "FAQ Responses",
    icon: HelpCircle,
    examples: 30,
  },
];

export default function CapabilityDetailPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/assistant"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assistant
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{MOCK_CAPABILITY.name}</h1>
            <p className="text-muted-foreground">
              Capability ID: {MOCK_CAPABILITY.id} | Inspect Mode
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
          {MOCK_CAPABILITY.status}
        </span>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card col-span-2">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{MOCK_CAPABILITY.description}</p>
        </div>
        <div className="surface-card text-center">
          <p className="text-3xl font-bold text-primary">{MOCK_CAPABILITY.examples}</p>
          <p className="text-sm text-muted-foreground">Example Responses</p>
        </div>
      </div>

      {/* Topics Covered */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Topics Covered</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MOCK_CAPABILITY.topics.map((topic, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded"
            >
              <span className="text-green-600">✓</span>
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {/* Example Responses */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Example Responses (Mock Data)</h2>
        <div className="space-y-4">
          {MOCK_CAPABILITY.responses.map((example, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="mb-3">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  User Query
                </span>
                <p className="mt-2 font-medium">{example.trigger}</p>
              </div>
              <div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  Assistant Response
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  {example.response}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold text-red-700">Capability Limitations</h2>
        <ul className="space-y-2">
          {MOCK_CAPABILITY.limitations.map((limitation, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-red-600">✗</span>
              {limitation}
            </li>
          ))}
        </ul>
      </div>

      {/* Other Capabilities */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Other Capabilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ALL_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isActive = cap.id === MOCK_CAPABILITY.id;
            return (
              <div
                key={cap.id}
                className={`p-4 rounded-lg text-center ${
                  isActive
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted/50"
                }`}
              >
                <Icon
                  className={`h-6 w-6 mx-auto mb-2 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <p className="text-sm font-medium">{cap.name}</p>
                <p className="text-xs text-muted-foreground">
                  {cap.examples} examples
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">INSPECT MODE</h3>
        <p className="text-sm">
          This is a read-only inspection view. You cannot modify capability
          configurations, add examples, or change assistant behavior. All data
          shown is static mock data for visualization purposes only. No AI model
          is connected.
        </p>
      </div>
    </div>
  );
}
