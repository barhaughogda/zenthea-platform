/**
 * READ-ONLY / NON-OPERATIONAL
 * Assistant conversation examples preview for Phase AJ-03.
 * Execution remains blocked. Preview proposal only.
 */

import Link from "next/link";
import { ArrowLeft, MessageSquare, Bot, User } from "lucide-react";

const MOCK_CONVERSATION = {
  id: "CONV-001",
  topic: "Appointment Booking Inquiry",
  timestamp: "January 14, 2026 at 2:30 PM",
  messages: [
    {
      role: "assistant",
      content:
        "Hello! I'm the Zenthea Assistant. I can help you with information about our services, appointments, and general health questions. How can I assist you today?",
    },
    {
      role: "user",
      content: "I'd like to know what types of appointments are available.",
    },
    {
      role: "assistant",
      content:
        "We offer several types of appointments:\n\n• **Annual Wellness Visits** - Comprehensive health checkups\n• **Follow-up Consultations** - For ongoing care management\n• **Sick Visits** - Same-day appointments for acute concerns\n• **Specialist Referrals** - Coordination with specialty care\n• **Preventive Screenings** - Age and risk-appropriate screenings\n\nWould you like more details about any of these options?",
    },
    {
      role: "user",
      content: "How long does an annual wellness visit typically take?",
    },
    {
      role: "assistant",
      content:
        "An Annual Wellness Visit typically takes 45-60 minutes. This includes:\n\n• Review of your medical history and current medications\n• Vital signs measurement\n• Physical examination\n• Discussion of health goals and concerns\n• Preventive care recommendations\n• Lab orders if needed\n\nWe recommend arriving 10-15 minutes early to complete any paperwork.",
    },
  ],
};

const SAMPLE_CONVERSATIONS = [
  {
    id: "CONV-001",
    topic: "Appointment Booking Inquiry",
    messages: 5,
    category: "Appointments",
  },
  {
    id: "CONV-002",
    topic: "Insurance Coverage Question",
    messages: 4,
    category: "Billing",
  },
  {
    id: "CONV-003",
    topic: "Medication Refill Process",
    messages: 6,
    category: "Prescriptions",
  },
  {
    id: "CONV-004",
    topic: "New Patient Registration",
    messages: 8,
    category: "Onboarding",
  },
];

export default function ConversationsPreviewPage() {
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
      <div>
        <h1 className="text-2xl font-bold">Conversation Examples (Preview)</h1>
        <p className="text-muted-foreground">
          Preview sample conversations and response patterns. This is a
          non-persistent visualization only.
        </p>
      </div>

      {/* Sample Conversations List */}
      <div className="surface-card space-y-4">
        <h2 className="font-semibold">Sample Conversations (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{conv.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {conv.messages} messages • {conv.category}
                    </p>
                  </div>
                </div>
                <button className="btn-view text-xs">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Detail Preview */}
      <div className="surface-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {MOCK_CONVERSATION.topic}
          </h2>
          <span className="text-xs text-muted-foreground">
            {MOCK_CONVERSATION.timestamp}
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
          {MOCK_CONVERSATION.messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`p-4 rounded-lg max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-white shadow-sm"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          [End of sample conversation - All messages are static mock data]
        </p>
      </div>

      {/* Proposal Notice */}
      <div className="surface-card border-dashed border-2 border-primary/30">
        <h3 className="font-semibold text-primary mb-2">
          Preview Proposal Mode
        </h3>
        <p className="text-sm text-muted-foreground">
          These conversation examples are static previews only. In a real system,
          you would be able to interact with the AI assistant. In this read-only
          mode, no messages can be sent and no AI responses are generated. All
          shown content is pre-defined mock data.
        </p>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">PREVIEW MODE</h3>
        <p className="text-sm">
          This is a preview-only view. No AI interaction is possible. You cannot
          send messages, receive responses, or create new conversations. All
          conversations shown are static examples for visualization purposes only.
        </p>
      </div>
    </div>
  );
}
