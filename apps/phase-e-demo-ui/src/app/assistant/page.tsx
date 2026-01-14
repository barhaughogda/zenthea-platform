"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase M/O Assistant Demo with intent-aware reasoning and interactive
 * human confirmation preview (Phase O-02).
 *
 * Phase R-02: Demo Perspective Framing
 * Added perspective selector for UI visibility control (Patient, Clinician, Operator).
 * Perspective changes panel expansion defaults — NO logic changes, NO permission changes.
 *
 * Phase R-03: Demo Narrative Mode (Guided vs Free)
 * Added narrative mode framing for demo governance. Guided mode locks prompts
 * to a predefined sequence. Free mode enables open exploration.
 * Narrative mode is UI-only — NO logic changes, NO permission changes.
 *
 * Phase R-06: Perspective-Aware Response Framing
 * Assistant responses are now framed differently based on perspective:
 * - Patient: Plain language, reassuring, explanatory, no jargon
 * - Clinician: Concise, neutral, workflow-aware
 * - Operator: Procedural, policy-oriented, observational
 * Framing is deterministic (no LLM), preserves all facts, and uses only
 * conditional language. NO execution capability, NO authority changes.
 *
 * This is a non-executing assistant that displays contextual relevance
 * information alongside assistant responses. The human confirmation preview
 * flow allows users to experience a realistic confirmation UX while
 * understanding that NOTHING actually happens.
 *
 * NO actions are executed. All data is from static demo fixtures.
 */

import React, { useState, useRef, useEffect, Suspense } from "react";
import { Banners } from "@/components/Banners";
import { RelevancePanel } from "@/components/RelevancePanel";
import { InsightPanel } from "@/components/InsightPanel";
import { ComparativePanel } from "@/components/ComparativePanel";
import { ConfidencePanel } from "@/components/ConfidencePanel";
import { ActionReadinessPanel } from "@/components/ActionReadinessPanel";
import { HumanConfirmationPanel } from "@/components/HumanConfirmationPanel";
import { ExecutionPlanPanel } from "@/components/ExecutionPlanPanel";
import { PreviewAuditPanel } from "@/components/PreviewAuditPanel";
import { ContextPanel } from "@/components/ContextPanel";
import { PatientTimelinePanel } from "@/components/PatientTimelinePanel";
import { DemoPerspectiveSelector } from "@/components/DemoPerspectiveSelector";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { GuidedPromptList } from "@/components/GuidedPromptList";
import { DemoLayout } from "@/components/DemoLayout";
import {
  ConfirmationPreviewModal,
  PreviewAcknowledgmentBadge,
} from "@/components/ConfirmationPreviewModal";
import { SHADOW_MODE } from "@/lib/shadowMode";
import { getPatientContext, getPatientTimeline } from "@/lib/dataSourceSelector";
import { PatientContext } from "@/lib/demoPatientContext";
import { PatientTimeline } from "@/lib/demoPatientTimeline";
import { selectRelevantItems } from "@/lib/relevanceSelector";
import { buildComparativeInsights } from "@/lib/comparativeEngine";
import { buildConfidenceAnnotations } from "@/lib/confidenceEngine";
import { evaluateActionReadiness } from "@/lib/actionReadinessEngine";
import { evaluateHumanConfirmation } from "@/lib/confirmationPreviewEngine";
import { generateExecutionPlan } from "@/lib/executionPlanEngine";
import {
  buildPreviewAuditTrail,
  createHumanConfirmationAuditEvent,
} from "@/lib/previewAuditEngine";
import {
  createPreviewConfirmationRecord,
  transitionPreviewState,
} from "@/lib/interactivePreviewEngine";
import { getIntentLabel } from "@/lib/intentClassifier";
import {
  DemoPerspectiveProvider,
  useDemoPerspective,
} from "@/lib/demoPerspectiveContext";
import { DemoModeProvider, useDemoMode } from "@/lib/demoModeContext";
import { frameResponseForPerspective } from "@/lib/perspectiveFramingEngine";
import type {
  ChatMessage,
  RelevanceResult,
  PreviewConfirmationRecord,
} from "@/lib/types";

/**
 * Generates a deterministic "assistant response" based on the intent.
 * This is a static simulation — no LLM, no execution.
 */
function generateAssistantResponse(
  message: string,
  relevance: RelevanceResult
): string {
  const intentLabel = getIntentLabel(relevance.intent);

  // Shadow Mode Prompt Grounding (Strict)
  const shadowModeGrounding = SHADOW_MODE 
    ? "\n\n[SYSTEM INSTRUCTION: You may only reason over the provided data. Do not infer missing information. Do not suggest actions. Do not assume correctness. Some information may be incomplete or unavailable.]"
    : "";

  // Phase M: Clarifying Question Rule
  const threshold = 3;
  if (relevance.intent === "unknown" || relevance.maxScore < threshold) {
    // Generate exactly ONE clarifying question
    if (message.toLowerCase().includes("appointment") || message.toLowerCase().includes("visit")) {
      return "Are you asking about an upcoming appointment or a past visit?" + shadowModeGrounding;
    }
    if (message.toLowerCase().includes("note") || message.toLowerCase().includes("summary")) {
      return "Do you want a summary of your last visit or help drafting a note?" + shadowModeGrounding;
    }
    return "Could you please clarify if you are looking for information about your medical history, current medications, or scheduling?" + shadowModeGrounding;
  }

  if (!relevance.hasEvidence) {
    return `I understand you're asking about "${message.slice(0, 50)}${message.length > 50 ? "..." : ""}". However, I couldn't find any relevant information in the patient's ${SHADOW_MODE ? "live" : "demo"} timeline for this query. ${SHADOW_MODE ? "This is a read-only shadow mode preview." : "This is a demo with limited static data."} Please try asking about visits, appointments, or clinical notes. ${shadowModeGrounding}`;
  }

  const topItem = relevance.selectedItems[0];
  const itemCount = relevance.selectedItems.length;

  // Generate intent-specific responses (all read-only, no actions)
  let response = "";
  switch (relevance.intent) {
    case "scheduling":
      response = `Based on the patient timeline, I found ${itemCount} relevant record${itemCount > 1 ? "s" : ""}. The most recent is from ${topItem.date}: "${topItem.title}". This is read-only ${SHADOW_MODE ? "shadow mode preview" : "demo data"} — no scheduling actions can be performed.`;
      break;

    case "clinical_drafting":
      response = `I found ${itemCount} clinical record${itemCount > 1 ? "s" : ""} that may be relevant. The most relevant is from ${topItem.date}: "${topItem.title}". Summary: "${topItem.summary.slice(0, 100)}${topItem.summary.length > 100 ? "..." : ""}". Note: This is ${SHADOW_MODE ? "read-only shadow mode preview" : "demo data only"} — no clinical notes can be drafted or saved.`;
      break;

    case "record_summary":
      response = `Here's what I found in the patient's ${SHADOW_MODE ? "live" : "demo"} timeline: ${itemCount} relevant item${itemCount > 1 ? "s" : ""}. Most relevant: ${topItem.date} — "${topItem.title}". ${topItem.summary}. This is ${SHADOW_MODE ? "read-only shadow mode preview" : "static demo data for demonstration purposes only"}.`;
      break;

    case "billing_explanation":
      response = `I searched for billing-related information. Found ${itemCount} item${itemCount > 1 ? "s" : ""}: ${topItem.date} — "${topItem.title}". Note: The ${SHADOW_MODE ? "live" : "demo"} timeline has limited billing data. No billing actions can be performed.`;
      break;

    default:
      response = `I found ${itemCount} potentially relevant item${itemCount > 1 ? "s" : ""} in the ${SHADOW_MODE ? "live" : "demo"} timeline. Most relevant: ${topItem.date} — "${topItem.title}". This is read-only ${SHADOW_MODE ? "shadow mode preview" : "demo data for demonstration purposes"}.`;
  }

  // Phase M: Evidence Attribution Footer
  const footer = `\n\nBased on:\n${relevance.evidenceAttribution.map(a => `• ${a}`).join("\n")}`;
  return response + footer + shadowModeGrounding;
}

/**
 * Generates a unique ID for messages.
 */
function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Inner component that uses the perspective and mode contexts.
 * Separated to allow hook usage within the providers.
 */
function AssistantPageContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);
  const [patientTimeline, setPatientTimeline] = useState<PatientTimeline | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Phase R-02: Demo perspective framing (UI-only, no logic changes)
  // Phase R-06: Added perspective for response framing
  const { perspective, shouldExpandPanel, chatDeemphasized } = useDemoPerspective();

  // Phase R-03: Demo narrative mode (UI-only, no logic changes)
  const { mode, isInputEnabled } = useDemoMode();

  // Phase O-02: Interactive human confirmation preview state (session-only)
  const [previewConfirmations, setPreviewConfirmations] = useState<
    Map<string, PreviewConfirmationRecord>
  >(new Map());
  const [activePreviewModal, setActivePreviewModal] = useState<{
    messageId: string;
    record: PreviewConfirmationRecord;
  } | null>(null);

  // Load data via selector on mount
  useEffect(() => {
    async function loadData() {
      const context = await getPatientContext("PAT-12345");
      const timeline = await getPatientTimeline("PAT-12345");
      setPatientContext(context);
      setPatientTimeline(timeline);
    }
    loadData();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Opens the preview confirmation modal for a message.
   * Creates a new PreviewConfirmationRecord if one doesn't exist.
   */
  function openPreviewConfirmation(messageId: string, message: ChatMessage) {
    if (!message.humanConfirmation || !message.executionPlan) return;

    // Check if we already have a record for this message
    let record = previewConfirmations.get(messageId);

    if (!record) {
      // Create a new preview confirmation record
      record = createPreviewConfirmationRecord({
        humanConfirmation: message.humanConfirmation,
        executionPlan: message.executionPlan,
        sessionRole: "Demo User",
      });

      // Store in session-only state
      setPreviewConfirmations((prev) => new Map(prev).set(messageId, record!));
    }

    // Only open modal if the record is in PROPOSAL_CREATED state
    if (record.state === "PROPOSAL_CREATED") {
      // Add audit event for opening preview
      const openEvent = createHumanConfirmationAuditEvent(
        messageId,
        (message.previewAudit?.length || 0),
        "HUMAN_CONFIRMATION_PREVIEW_OPENED",
        "clinician",
        message.relevance?.intent || "unknown"
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                previewAudit: [...(msg.previewAudit || []), openEvent],
              }
            : msg
        )
      );

      setActivePreviewModal({ messageId, record });
    }
  }

  /**
   * Handles the "Acknowledge Preview" action.
   * Updates session-only state — NO persistence, NO execution.
   */
  function handleAcknowledgePreview() {
    if (!activePreviewModal) return;

    const { messageId, record } = activePreviewModal;
    const updatedRecord = transitionPreviewState(record, "PREVIEW_ACKNOWLEDGED");

    if (updatedRecord) {
      setPreviewConfirmations((prev) =>
        new Map(prev).set(messageId, updatedRecord)
      );

      // Add audit event
      const msg = messages.find((m) => m.id === messageId);
      if (msg) {
        const ackEvent = createHumanConfirmationAuditEvent(
          messageId,
          (msg.previewAudit?.length || 0),
          "HUMAN_CONFIRMATION_PREVIEW_ACKNOWLEDGED",
          "clinician",
          msg.relevance?.intent || "unknown"
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  previewAudit: [...(m.previewAudit || []), ackEvent],
                }
              : m
          )
        );
      }
    }

    setActivePreviewModal(null);
  }

  /**
   * Handles the "Cancel" action (denial).
   * Updates session-only state — NO persistence, NO execution.
   */
  function handleDenyPreview() {
    if (!activePreviewModal) return;

    const { messageId, record } = activePreviewModal;
    const updatedRecord = transitionPreviewState(record, "PREVIEW_DENIED");

    if (updatedRecord) {
      setPreviewConfirmations((prev) =>
        new Map(prev).set(messageId, updatedRecord)
      );

      // Add audit event
      const msg = messages.find((m) => m.id === messageId);
      if (msg) {
        const denyEvent = createHumanConfirmationAuditEvent(
          messageId,
          (msg.previewAudit?.length || 0),
          "HUMAN_CONFIRMATION_PREVIEW_DENIED",
          "clinician",
          msg.relevance?.intent || "unknown"
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  previewAudit: [...(m.previewAudit || []), denyEvent],
                }
              : m
          )
        );
      }
    }

    setActivePreviewModal(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isProcessing || !patientTimeline) return;

    setIsProcessing(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate processing delay (100-300ms for realism)
    setTimeout(() => {
      // Compute relevance
      const relevance = selectRelevantItems(trimmed, patientTimeline);

      // Compute comparative insights
      const comparativeInsights = buildComparativeInsights({
        intent: relevance.intent,
        message: trimmed,
        relevantItems: relevance.selectedItems,
        timeline: patientTimeline.events,
      });

      // Compute confidence annotations
      const confidenceAnnotations = buildConfidenceAnnotations(
        relevance,
        comparativeInsights
      );

      // Compute action readiness
      const actionReadiness = evaluateActionReadiness(
        relevance.intent,
        relevance,
        confidenceAnnotations
      );

      // Compute human confirmation preview (only for non-informational intents)
      const overallConfidence = confidenceAnnotations.length > 0
        ? confidenceAnnotations.some(a => a.confidence === "Low")
          ? "Low"
          : confidenceAnnotations.some(a => a.confidence === "Medium")
            ? "Medium"
            : "High"
        : "Medium";
      
      const humanConfirmation = evaluateHumanConfirmation(
        relevance.intent,
        actionReadiness,
        overallConfidence
      );

      // Compute execution plan preview
      const executionPlan = generateExecutionPlan(
        relevance.intent,
        relevance,
        actionReadiness,
        overallConfidence
      );

      // Generate assistant response
      const responseContent = generateAssistantResponse(trimmed, relevance);

      const assistantId = generateId();

      // Compute preview audit trail
      const previewAudit = buildPreviewAuditTrail({
        messageId: assistantId,
        actorContext: { role: "clinician" }, // Demo default
        intent: {
          intent: relevance.intent,
          matchedKeywords: relevance.evidenceAttribution,
          confidence: overallConfidence === "High" ? "high" : "low",
        },
        relevance,
        confidence: confidenceAnnotations,
        readiness: actionReadiness,
        humanConfirmation,
        executionPlan,
      });

      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        relevance,
        comparativeInsights,
        confidenceAnnotations,
        actionReadiness,
        humanConfirmation,
        executionPlan,
        previewAudit,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 150 + Math.random() * 150);
  }

  const lastMessage = messages[messages.length - 1];
  const hasAssistantResponse = lastMessage?.role === "assistant";

  return (
    <div className="w-full">
      <Banners slice="Phase-M" />
      
      <DemoLayout
        leftColumn={
          <>
            {/* LEFT COLUMN — Context & Evidence */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowContext(!showContext)}
                className="text-xs px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 w-full"
              >
                {showContext ? "Hide" : "Show"} Patient Context
              </button>
            </div>

            {showContext && patientContext && patientTimeline && (
              <div className="space-y-4">
                <ContextPanel context={patientContext} />
                <PatientTimelinePanel timeline={patientTimeline} />
              </div>
            )}

            {hasAssistantResponse && lastMessage.relevance && (
              <div className="space-y-4">
                <RelevancePanel 
                  relevance={lastMessage.relevance} 
                  initialExpanded={shouldExpandPanel("relevance")} 
                />
                {lastMessage.comparativeInsights && (
                  <ComparativePanel 
                    insights={lastMessage.comparativeInsights} 
                    initialExpanded={shouldExpandPanel("comparative")} 
                  />
                )}
              </div>
            )}
          </>
        }
        centerColumn={
          <>
            {/* CENTER COLUMN — Conversation */}
            <div className="space-y-4">
              <DemoModeBanner />
              <DemoPerspectiveSelector />
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold">
                          Phase M Non-Executing Assistant
                        </h2>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-600/50 border border-slate-500/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                            DEMO MODE · READ-ONLY
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages area */}
                <div className={`h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50 ${chatDeemphasized ? "opacity-60" : ""}`}>
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p className="text-sm font-medium">Start a conversation</p>
                      <p className="text-xs mt-1">
                        Try: "What happened at the last visit?"
                      </p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] ${msg.role === "user" ? "order-2" : ""}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2.5 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          {/* Phase R-06: Apply perspective-aware framing to assistant messages */}
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.role === "assistant"
                              ? frameResponseForPerspective(msg.content, perspective).framedResponse
                              : msg.content}
                          </p>
                          <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {/* Interactive Preview Button in Chat - ONLY the button stays in chat flow */}
                        {msg.role === "assistant" && msg.humanConfirmation && 
                         msg.actionReadiness?.category !== "INFORMATIONAL_ONLY" &&
                         msg.humanConfirmation.requiredActor !== "NONE" && (
                          <div className="mt-2">
                            {previewConfirmations.get(msg.id)?.state !== "PROPOSAL_CREATED" &&
                             previewConfirmations.get(msg.id) && (
                              <PreviewAcknowledgmentBadge
                                record={previewConfirmations.get(msg.id)!}
                              />
                            )}

                            {(!previewConfirmations.get(msg.id) ||
                              previewConfirmations.get(msg.id)?.state === "PROPOSAL_CREATED") && (
                              <button
                                onClick={() => openPreviewConfirmation(msg.id, msg)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <span className="text-xs font-bold text-purple-700">Preview Confirmation</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isInputEnabled ? "Type a message..." : "Select a guided prompt..."}
                      disabled={isProcessing || !isInputEnabled}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 border-gray-300"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isProcessing || !isInputEnabled}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>

              <GuidedPromptList onSelectPrompt={setInputValue} isProcessing={isProcessing} />
            </div>
          </>
        }
        rightColumn={
          <div className="space-y-4">
            {/* RIGHT COLUMN — Governance & Trust */}
            {hasAssistantResponse && (
              <>
                <InsightPanel 
                  relevance={lastMessage.relevance!} 
                  initialExpanded={shouldExpandPanel("synthesis")} 
                />

                {lastMessage.confidenceAnnotations && (
                  <ConfidencePanel 
                    annotations={lastMessage.confidenceAnnotations} 
                    initialExpanded={shouldExpandPanel("confidence")}
                  />
                )}

                {lastMessage.actionReadiness && (
                  <ActionReadinessPanel 
                    readiness={lastMessage.actionReadiness} 
                    initialExpanded={shouldExpandPanel("readiness")}
                  />
                )}

                {lastMessage.humanConfirmation && lastMessage.actionReadiness?.category !== "INFORMATIONAL_ONLY" && (
                  <HumanConfirmationPanel 
                    confirmation={lastMessage.humanConfirmation} 
                    initialExpanded={shouldExpandPanel("confirmation")}
                  />
                )}

                {lastMessage.executionPlan && (
                  <ExecutionPlanPanel 
                    plan={lastMessage.executionPlan} 
                    initialExpanded={shouldExpandPanel("execution")}
                  />
                )}

                {lastMessage.previewAudit && (
                  <PreviewAuditPanel 
                    auditTrail={lastMessage.previewAudit} 
                    initialExpanded={shouldExpandPanel("audit")}
                  />
                )}
              </>
            )}

            {!hasAssistantResponse && (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">
                  Assistant governance panels will appear here during conversation.
                </p>
              </div>
            )}
          </div>
        }
      />

      {activePreviewModal && (
        <ConfirmationPreviewModal
          record={activePreviewModal.record}
          isOpen={true}
          onAcknowledge={handleAcknowledgePreview}
          onCancel={handleDenyPreview}
        />
      )}
    </div>
  );
}

/**
 * Loading fallback for Suspense boundary.
 * Shown while URL search params are being read.
 */
function AssistantLoadingFallback() {
  return (
    <div className="max-w-5xl mx-auto">
      <Banners slice="Phase-M" />
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-pulse flex items-center gap-2 text-gray-500">
            <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce" />
            <span className="text-sm">Loading demo mode...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inner wrapper that provides the demo mode context.
 * Separated to handle Suspense boundary for useSearchParams.
 */
function AssistantPageWithProviders() {
  return (
    <DemoModeProvider>
      <DemoPerspectiveProvider>
        <AssistantPageContent />
      </DemoPerspectiveProvider>
    </DemoModeProvider>
  );
}

/**
 * Main page component with provider wrappers.
 * Phase R-02: Demo perspective framing support.
 * Phase R-03: Demo narrative mode (guided vs free) support.
 */
export default function AssistantPage() {
  return (
    <Suspense fallback={<AssistantLoadingFallback />}>
      <AssistantPageWithProviders />
    </Suspense>
  );
}
