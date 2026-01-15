/**
 * READ-ONLY / NON-OPERATIONAL
 * Assistant surface landing page for Phase AJ-03.
 * Execution remains blocked. All interactive elements are proposals only.
 */

import { SurfaceLayout } from "@/components/surface-layout";
import { MockCard } from "@/components/mock-card";

const CAN_DO = [
  "View assistant capabilities (mock data)",
  "Inspect conversation examples",
  "Preview response patterns",
  "Browse knowledge topics",
  "View interaction history (read-only)",
];

const CANNOT_DO = [
  "Send messages to the assistant",
  "Receive AI-generated responses",
  "Create new conversations",
  "Train or configure the assistant",
  "Access real AI models",
  "Store conversation data",
];

const MOCK_CAPABILITIES = [
  {
    id: "CAP-001",
    title: "Appointment Assistance",
    description: "Help patients understand appointment options and availability",
    examples: 12,
  },
  {
    id: "CAP-002",
    title: "Health Information",
    description: "Provide general health education and wellness tips",
    examples: 24,
  },
  {
    id: "CAP-003",
    title: "Navigation Help",
    description: "Guide users through platform features and workflows",
    examples: 18,
  },
  {
    id: "CAP-004",
    title: "FAQ Responses",
    description: "Answer common questions about services and policies",
    examples: 30,
  },
];

export default function AssistantPage() {
  return (
    <SurfaceLayout
      title="Assistant (Read-Only)"
      description="Explore AI assistant capabilities and conversation previews. All data is static mock data for visualization purposes."
      canDo={CAN_DO}
      cannotDo={CANNOT_DO}
    >
      {/* Quick Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Assistant Overview (Mock Data)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-primary">4</p>
            <p className="text-sm text-muted-foreground">Capability Areas</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-green-600">84</p>
            <p className="text-sm text-muted-foreground">Example Responses</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-yellow-600">156</p>
            <p className="text-sm text-muted-foreground">Knowledge Topics</p>
          </div>
          <div className="surface-card text-center">
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-sm text-muted-foreground">Accuracy Target</p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Assistant Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_CAPABILITIES.map((cap) => (
            <MockCard
              key={cap.id}
              title={cap.title}
              description={cap.description}
              status={`${cap.examples} examples`}
              statusColor="blue"
              inspectHref={`/assistant/capabilities?id=${cap.id}`}
            />
          ))}
        </div>
      </section>

      {/* Navigation to Detail Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Explore Assistant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MockCard
            title="Conversation Examples"
            description="Preview sample conversations and response patterns"
            previewHref="/assistant/conversations"
          />
          <MockCard
            title="Capability Details"
            description="Inspect assistant capabilities and knowledge domains"
            inspectHref="/assistant/capabilities"
          />
        </div>
      </section>

      {/* Assistant Preview */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Assistant Interface Preview</h2>
        <div className="surface-card">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary/10 p-4 border-b">
              <p className="font-semibold">Zenthea Assistant</p>
              <p className="text-xs text-muted-foreground">
                Preview Mode - No responses generated
              </p>
            </div>
            <div className="p-4 space-y-4 bg-muted/20 min-h-[200px]">
              {/* Mock conversation preview */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  AI
                </div>
                <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm">
                    Hello! I&apos;m the Zenthea Assistant. How can I help you today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    [Static preview message]
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg max-w-[80%]">
                  <p className="text-sm">[User message would appear here]</p>
                  <p className="text-xs opacity-70 mt-1">[Input disabled]</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded text-muted-foreground text-sm">
                  Message input disabled in preview mode...
                </div>
                <button className="btn-view" disabled>
                  View Only
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SurfaceLayout>
  );
}
