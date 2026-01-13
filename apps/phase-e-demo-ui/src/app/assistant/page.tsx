"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase M/O Assistant Demo with intent-aware reasoning and interactive
 * human confirmation preview (Phase O-02).
 *
 * This is a non-executing assistant that displays contextual relevance
 * information alongside assistant responses. The human confirmation preview
 * flow allows users to experience a realistic confirmation UX while
 * understanding that NOTHING actually happens.
 *
 * NO actions are executed. All data is from static demo fixtures.
 */

import React, { useState, useRef, useEffect } from "react";
import { Banners } from "@/components/Banners";
import { RelevancePanel } from "@/components/RelevancePanel";
import { InsightPanel } from "@/components/InsightPanel";
import { ComparativePanel } from "@/components/ComparativePanel";
import { ConfidencePanel } from "@/components/ConfidencePanel";
import { ActionReadinessPanel } from "@/components/ActionReadinessPanel";
import { HumanConfirmationPanel } from "@/components/HumanConfirmationPanel";
import { ExecutionPlanPanel } from "@/components/ExecutionPlanPanel";
import { ContextPanel } from "@/components/ContextPanel";
import { PatientTimelinePanel } from "@/components/PatientTimelinePanel";
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
  createPreviewConfirmationRecord,
  transitionPreviewState,
} from "@/lib/interactivePreviewEngine";
import { getIntentLabel } from "@/lib/intentClassifier";
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

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);
  const [patientTimeline, setPatientTimeline] = useState<PatientTimeline | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        relevance,
        comparativeInsights,
        confidenceAnnotations,
        actionReadiness,
        humanConfirmation,
        executionPlan,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 150 + Math.random() * 150);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Banners slice="Phase-M" />

      {/* Patient context toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowContext(!showContext)}
          className="text-xs px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-600"
        >
          {showContext ? "Hide" : "Show"} Patient Context
        </button>
      </div>

      {/* Patient context panels (collapsible) */}
      {showContext && patientContext && patientTimeline && (
        <div className="space-y-4 mb-6">
          <ContextPanel context={patientContext} />
          <PatientTimelinePanel timeline={patientTimeline} />
        </div>
      )}

      {/* Main assistant interface */}
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
                    DEMO MODE · READ-ONLY · NO ACTIONS EXECUTED
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Intent-aware reasoning over static demo data. No actions executed.
          </p>
        </div>

        {/* Messages area */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50">
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
                Try: "What happened at the last visit?" or "Can I schedule an
                appointment?"
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}
              >
                {/* Message bubble */}
                <div
                  className={`rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      “Here’s a careful summary based on the information available.”
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.role === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {/* Narrative Panels (UI-only ordering) */}
                {msg.role === "assistant" && msg.relevance && (
                  <div className="space-y-1">
                    {/* 2. Synthesis summary */}
                    <InsightPanel relevance={msg.relevance} initialExpanded={true} />

                    {/* 3. Confidence & Uncertainty */}
                    {msg.confidenceAnnotations && (
                      <ConfidencePanel 
                        annotations={msg.confidenceAnnotations} 
                        initialExpanded={false}
                      />
                    )}

                    {/* 4. Action Readiness Framing */}
                    {msg.actionReadiness && (
                      <ActionReadinessPanel 
                        readiness={msg.actionReadiness} 
                        initialExpanded={false}
                      />
                    )}

                    {/* 5. Human Confirmation Preview */}
                    {msg.humanConfirmation && msg.actionReadiness?.category !== "INFORMATIONAL_ONLY" && (
                      <HumanConfirmationPanel 
                        confirmation={msg.humanConfirmation} 
                        initialExpanded={false}
                      />
                    )}

                    {/* Phase O-02: Interactive Confirmation Preview Button & Badge */}
                    {msg.humanConfirmation && 
                     msg.actionReadiness?.category !== "INFORMATIONAL_ONLY" &&
                     msg.humanConfirmation.requiredActor !== "NONE" && (
                      <div className="mt-3">
                        {/* Show badge if already acknowledged/denied */}
                        {previewConfirmations.get(msg.id)?.state !== "PROPOSAL_CREATED" &&
                         previewConfirmations.get(msg.id) && (
                          <PreviewAcknowledgmentBadge
                            record={previewConfirmations.get(msg.id)!}
                          />
                        )}

                        {/* Show button if not yet interacted or in proposal state */}
                        {(!previewConfirmations.get(msg.id) ||
                          previewConfirmations.get(msg.id)?.state === "PROPOSAL_CREATED") && (
                          <button
                            onClick={() => openPreviewConfirmation(msg.id, msg)}
                            className="w-full mt-2 px-4 py-3 rounded-lg border-2 border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition-colors group"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span className="text-sm font-bold text-purple-700">
                                Preview Confirmation
                              </span>
                              <span className="text-[10px] font-black text-purple-500 uppercase tracking-wider px-2 py-0.5 bg-purple-200 rounded">
                                PREVIEW ONLY
                              </span>
                            </div>
                            <p className="text-[10px] text-purple-600 mt-1 group-hover:text-purple-700">
                              Experience the human confirmation flow — no action will be taken
                            </p>
                          </button>
                        )}
                      </div>
                    )}

                    {/* 6. Execution Plan Preview */}
                    {msg.executionPlan && (
                      <ExecutionPlanPanel 
                        plan={msg.executionPlan} 
                        initialExpanded={false}
                      />
                    )}

                    {/* 7. Supporting Evidence Panels */}
                    <RelevancePanel relevance={msg.relevance} initialExpanded={false} />
                    {msg.comparativeInsights && (
                      <ComparativePanel 
                        insights={msg.comparativeInsights} 
                        initialExpanded={false} 
                      />
                    )}
                    
                    <div className="flex justify-center pt-2">
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        More detail available above
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    Analyzing intent...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about scheduling, records, clinical notes..."
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            This is a non-executing demo. All responses are based on static
            timeline data. No actions are performed.
          </p>
        </form>
      </div>

      {/* Sample prompts */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          Try these sample prompts:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "What happened at the last visit?",
            "Can I schedule an appointment?",
            "Show me the lab results",
            "Draft a clinical note summary",
            "Tell me about my medications",
            "What was the diagnosis?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInputValue(prompt);
              }}
              disabled={isProcessing}
              className="text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-700 disabled:opacity-50 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Phase O-02: Interactive Confirmation Preview Modal */}
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
