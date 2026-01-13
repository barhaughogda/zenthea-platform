"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase M Assistant Demo with intent-aware reasoning.
 * This is a non-executing assistant that displays contextual relevance
 * information alongside assistant responses.
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
import { ContextPanel } from "@/components/ContextPanel";
import { PatientTimelinePanel } from "@/components/PatientTimelinePanel";
import { DEMO_PATIENT_CONTEXT } from "@/lib/demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "@/lib/demoPatientTimeline";
import { selectRelevantItems } from "@/lib/relevanceSelector";
import { buildComparativeInsights } from "@/lib/comparativeEngine";
import { buildConfidenceAnnotations } from "@/lib/confidenceEngine";
import { evaluateActionReadiness } from "@/lib/actionReadinessEngine";
import { evaluateHumanConfirmation } from "@/lib/confirmationPreviewEngine";
import { getIntentLabel } from "@/lib/intentClassifier";
import type { ChatMessage, RelevanceResult } from "@/lib/types";

/**
 * Generates a deterministic "assistant response" based on the intent.
 * This is a static simulation — no LLM, no execution.
 */
function generateAssistantResponse(
  message: string,
  relevance: RelevanceResult
): string {
  const intentLabel = getIntentLabel(relevance.intent);

  // Phase M: Clarifying Question Rule
  const threshold = 3;
  if (relevance.intent === "unknown" || relevance.maxScore < threshold) {
    // Generate exactly ONE clarifying question
    if (message.toLowerCase().includes("appointment") || message.toLowerCase().includes("visit")) {
      return "Are you asking about an upcoming appointment or a past visit?";
    }
    if (message.toLowerCase().includes("note") || message.toLowerCase().includes("summary")) {
      return "Do you want a summary of your last visit or help drafting a note?";
    }
    return "Could you please clarify if you are looking for information about your medical history, current medications, or scheduling?";
  }

  if (!relevance.hasEvidence) {
    return `I understand you're asking about "${message.slice(0, 50)}${message.length > 50 ? "..." : ""}". However, I couldn't find any relevant information in the patient's demo timeline for this query. This is a demo with limited static data. Please try asking about visits, appointments, or clinical notes.`;
  }

  const topItem = relevance.selectedItems[0];
  const itemCount = relevance.selectedItems.length;

  // Generate intent-specific responses (all read-only, no actions)
  let response = "";
  switch (relevance.intent) {
    case "scheduling":
      response = `Based on the patient timeline, I found ${itemCount} relevant record${itemCount > 1 ? "s" : ""}. The most recent is from ${topItem.date}: "${topItem.title}". This is read-only demo data — no scheduling actions can be performed.`;
      break;

    case "clinical_drafting":
      response = `I found ${itemCount} clinical record${itemCount > 1 ? "s" : ""} that may be relevant. The most relevant is from ${topItem.date}: "${topItem.title}". Summary: "${topItem.summary.slice(0, 100)}${topItem.summary.length > 100 ? "..." : ""}". Note: This is demo data only — no clinical notes can be drafted or saved.`;
      break;

    case "record_summary":
      response = `Here's what I found in the patient's demo timeline: ${itemCount} relevant item${itemCount > 1 ? "s" : ""}. Most relevant: ${topItem.date} — "${topItem.title}". ${topItem.summary}. This is static demo data for demonstration purposes only.`;
      break;

    case "billing_explanation":
      response = `I searched for billing-related information. Found ${itemCount} item${itemCount > 1 ? "s" : ""}: ${topItem.date} — "${topItem.title}". Note: The demo timeline has limited billing data. No billing actions can be performed.`;
      break;

    default:
      response = `I found ${itemCount} potentially relevant item${itemCount > 1 ? "s" : ""} in the demo timeline. Most relevant: ${topItem.date} — "${topItem.title}". This is read-only demo data for demonstration purposes.`;
  }

  // Phase M: Evidence Attribution Footer
  const footer = `\n\nBased on:\n${relevance.evidenceAttribution.map(a => `• ${a}`).join("\n")}`;
  return response + footer;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isProcessing) return;

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
      const relevance = selectRelevantItems(trimmed, DEMO_PATIENT_TIMELINE);

      // Compute comparative insights
      const comparativeInsights = buildComparativeInsights({
        intent: relevance.intent,
        message: trimmed,
        relevantItems: relevance.selectedItems,
        timeline: DEMO_PATIENT_TIMELINE.events,
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
      {showContext && (
        <div className="space-y-4 mb-6">
          <ContextPanel context={DEMO_PATIENT_CONTEXT} />
          <PatientTimelinePanel timeline={DEMO_PATIENT_TIMELINE} />
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
              <h2 className="text-sm font-bold">
                Phase M Non-Executing Assistant
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase bg-red-500 px-2 py-0.5 rounded">
              READ-ONLY DEMO
            </span>
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
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.role === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {/* Relevance panel for assistant messages */}
                {msg.role === "assistant" && msg.relevance && (
                  <>
                    <RelevancePanel relevance={msg.relevance} />
                    <InsightPanel relevance={msg.relevance} />
                    {msg.comparativeInsights && (
                      <ComparativePanel insights={msg.comparativeInsights} />
                    )}
                    {msg.confidenceAnnotations && (
                      <ConfidencePanel annotations={msg.confidenceAnnotations} />
                    )}
                    {msg.actionReadiness && (
                      <ActionReadinessPanel readiness={msg.actionReadiness} />
                    )}
                    {msg.humanConfirmation && msg.actionReadiness?.category !== "INFORMATIONAL_ONLY" && (
                      <HumanConfirmationPanel confirmation={msg.humanConfirmation} />
                    )}
                  </>
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
    </div>
  );
}
