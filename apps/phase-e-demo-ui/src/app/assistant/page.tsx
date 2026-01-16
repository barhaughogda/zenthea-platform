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

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
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
import { DemoTrustLedgerPanel } from "@/components/DemoTrustLedgerPanel";
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
import {
  SandboxExecutionAdapter,
  type SandboxExecutionReceipt,
} from "@/lib/sandboxExecutionAdapter";
import {
  haltSandboxExecution,
  resetSandboxExecution,
  SANDBOX_EXECUTION_HALTED,
} from "@/lib/sandboxKillSwitch";
import { getIntentLabel } from "@/lib/intentClassifier";
import { classifyQuestionType } from "@/lib/questionTypeClassifier";
import { routeEvidence } from "@/lib/evidenceRouter";
import { composePrimaryResponse } from "@/lib/responseComposer";
import {
  DemoPerspectiveProvider,
  useDemoPerspective,
  PanelId,
} from "@/lib/demoPerspectiveContext";
import {
  DemoModeProvider,
  useDemoMode,
} from "@/lib/demoModeContext";
import { frameResponseForPerspective } from "@/lib/perspectiveFramingEngine";
import { mapNarrativeSubject } from "@/lib/narrativeSubjectMapper";
import { normalizeNarrativeSubject } from "@/lib/narrativeNormalizer";
import { getSectionOrder } from "@/lib/perspectiveContentOrder";
import { resolveIdentity } from "@/lib/identityResolver";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";
import type {
  ChatMessage,
  RelevanceResult,
  PreviewConfirmationRecord,
} from "@/lib/types";

const persistenceAdapter = createPilotPersistenceAdapter();

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Phase V-01: Force explicit selection if perspective or mode is missing
  useEffect(() => {
    const p = searchParams.get("perspective");
    const m = searchParams.get("mode");
    const storedP = sessionStorage.getItem("zenthea_demo_perspective");
    const storedM = sessionStorage.getItem("zenthea_demo_mode");

    if ((!p || !m) && (!storedP || !storedM)) {
      router.replace("/demo");
    }
  }, [searchParams, router]);

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
  const { mode, isInputEnabled, currentGuidedPrompt, advanceGuidedStep, isGuidedComplete } = useDemoMode();

  // Phase U-03: Sandbox Kill-Switch (Internal Only)
  const [isSandboxHalted, setIsSandboxHalted] = useState(SANDBOX_EXECUTION_HALTED);

  const handleHaltSandbox = () => {
    const reason = window.prompt("Enter reason for halting sandbox execution:", "Manual override for safety validation");
    if (reason) {
      haltSandboxExecution(reason);
      setIsSandboxHalted(true);
    }
  };

  const handleResetSandbox = () => {
    resetSandboxExecution();
    setIsSandboxHalted(false);
  };

  // Phase V-01: Session reset and end
  const handleResetSession = useCallback(async () => {
    const persistenceResult = await persistenceAdapter.recordSessionStarted("HUMAN_CONFIRMED_START", {
      sessionId: `demo-${Date.now()}`,
      providerId: "demo-provider",
      mockPatientId: "PAT-12345",
      timestamp: new Date(),
      ...({ source: "ui", humanAction: true } as any)
    } as any);

    setMessages([]);
    setPreviewConfirmations(new Map());
    resetSandboxExecution();
    setIsSandboxHalted(false);
  }, []);

  const handleEndSession = useCallback(() => {
    sessionStorage.removeItem("zenthea_demo_perspective");
    sessionStorage.removeItem("zenthea_demo_mode");
    router.push("/demo");
  }, [router]);

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

      // Phase U-02: SANDBOX EXECUTION SPIKE (INTERNAL ONLY)
      // If the intent is scheduling and it's acknowledged, simulate a sandbox execution
      const msg = messages.find((m) => m.id === messageId);
      if (msg && msg.relevance?.intent === "scheduling") {
        const receipt = SandboxExecutionAdapter.executeAppointmentConfirmation(
          "PAT-12345",
          "DR-67890",
          "SLOT-ABC"
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  sandboxExecutionReceipt: receipt,
                }
              : m
          )
        );
      }

      // Add audit event
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

    // Phase V-01: Advance guided step if in guided mode
    if (mode === "guided" && currentGuidedPrompt === trimmed) {
      advanceGuidedStep();
    }

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

      // Generate assistant response (Phase R-07 Question-Type Routing)
      const questionType = classifyQuestionType(trimmed);
      const routed = routeEvidence({
        message: trimmed,
        questionType,
        patientContext: patientContext!,
        patientTimeline: patientTimeline!,
      });
      const primary = composePrimaryResponse({
        message: trimmed,
        questionType,
        routed,
      });

      // Visually combine headline and body with footer
      const responseContent = `${primary.headline}\n\n${primary.body}\n\nBased on:\n${primary.basedOn.map(b => `• ${b}`).join("\n")}`;

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

            {hasAssistantResponse && (
              <div className="space-y-4">
                {/* 
                  Phase R-10: Left column panels are also reordered if they are in the perspective order.
                  For simplicity and to maintain DemoLayout structure, we keep the order of these 
                  specific panels but respect their visibility rules. 
                */}
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetSession}
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-600/50 hover:bg-slate-600 text-slate-200 border border-slate-500/50 transition-colors"
                      >
                        Reset Session
                      </button>
                      <button
                        onClick={handleEndSession}
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 transition-colors"
                      >
                        End Session
                      </button>
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
                          {/* Phase R-06, R-08 & R-09: Apply perspective-aware framing and normalization to assistant messages */}
                          {/* Phase R-11: Apply final-pass identity resolution */}
                          {/* Phase V-01: Separation of primary response vs evidence */}
                          <div className="text-sm whitespace-pre-wrap">
                            {msg.role === "assistant"
                              ? (() => {
                                  const framed = resolveIdentity(
                                    normalizeNarrativeSubject(
                                      mapNarrativeSubject(
                                        frameResponseForPerspective(msg.content, perspective).framedResponse,
                                        perspective
                                      ),
                                      perspective
                                    ),
                                    perspective,
                                    patientContext?.fullName
                                  );
                                  
                                  // Split into primary and evidence blocks
                                  const evidenceMarker = "\n\nBased on:\n";
                                  const parts = framed.split(evidenceMarker);
                                  const primary = parts[0];
                                  const evidence = parts[1];

                                  return (
                                    <>
                                      <p>{primary}</p>
                                      {evidence && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                            Based on: {evidence.split('\n')[0].replace('• ', '')}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()
                              : msg.content}
                          </div>
                          <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {/* Phase U-02: SANDBOX EXECUTION RECEIPT */}
                        {msg.sandboxExecutionReceipt && (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-[11px]">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span className="font-bold text-green-800 uppercase tracking-tight">Sandbox Execution Receipt</span>
                            </div>
                            <div className="space-y-1 text-green-700 font-mono">
                              <p>ID: {msg.sandboxExecutionReceipt.executionId}</p>
                              <p>STATUS: {msg.sandboxExecutionReceipt.status}</p>
                              <p>PATIENT: {msg.sandboxExecutionReceipt.patientName}</p>
                              <p>CLINICIAN: {msg.sandboxExecutionReceipt.clinicianName}</p>
                              <p>GOV_HASH: {msg.sandboxExecutionReceipt.governanceHash}</p>
                              <p className="mt-2 font-bold italic text-green-900 text-center">
                                "{msg.sandboxExecutionReceipt.disclaimer}"
                              </p>
                            </div>
                          </div>
                        )}

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

              <div className="flex items-center justify-between">
                <GuidedPromptList onSelectPrompt={setInputValue} isProcessing={isProcessing} />
                
                {/* Phase V-01: Guided Script Runner */}
                {mode === "guided" && !isGuidedComplete && (
                  <button
                    onClick={() => {
                      if (currentGuidedPrompt) {
                        setInputValue(currentGuidedPrompt);
                        // Trigger submit manually or just let user click send
                        // Constraint says: "No auto-run. No timers."
                        // But "It should inject the next guided prompt as if the user clicked it."
                        // Injecting is enough, but to make it feel like a "runner" 
                        // we can either auto-submit or just pre-fill. 
                        // Given "No auto-run", pre-filling is safer.
                      }
                    }}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    Run next demo step
                  </button>
                )}
              </div>
            </div>
          </>
        }
        rightColumn={
          <div className="space-y-4">
            {/* RIGHT COLUMN — Perspective-Specific Ordered Panels */}
            {hasAssistantResponse && (
              <>
                {getSectionOrder(perspective).map((panelId) => {
                  switch (panelId) {
                    case "synthesis":
                      return (
                        <InsightPanel 
                          key="synthesis"
                          relevance={lastMessage.relevance!} 
                          initialExpanded={shouldExpandPanel("synthesis")} 
                        />
                      );
                    case "confidence":
                      return lastMessage.confidenceAnnotations && (
                        <ConfidencePanel 
                          key="confidence"
                          annotations={lastMessage.confidenceAnnotations} 
                          initialExpanded={shouldExpandPanel("confidence")}
                        />
                      );
                    case "readiness":
                      return lastMessage.actionReadiness && (
                        <ActionReadinessPanel 
                          key="readiness"
                          readiness={lastMessage.actionReadiness} 
                          initialExpanded={shouldExpandPanel("readiness")}
                        />
                      );
                    case "confirmation":
                      return lastMessage.humanConfirmation && lastMessage.actionReadiness?.category !== "INFORMATIONAL_ONLY" && (
                        <HumanConfirmationPanel 
                          key="confirmation"
                          confirmation={lastMessage.humanConfirmation} 
                          initialExpanded={shouldExpandPanel("confirmation")}
                        />
                      );
                    case "execution":
                      return lastMessage.executionPlan && (
                        <ExecutionPlanPanel 
                          key="execution"
                          plan={lastMessage.executionPlan} 
                          initialExpanded={shouldExpandPanel("execution")}
                        />
                      );
                    case "audit":
                      return lastMessage.previewAudit && (
                        <PreviewAuditPanel 
                          key="audit"
                          auditTrail={lastMessage.previewAudit} 
                          initialExpanded={shouldExpandPanel("audit")}
                        />
                      );
                    case "relevance":
                      return lastMessage.relevance && (
                        <RelevancePanel 
                          key="relevance"
                          relevance={lastMessage.relevance} 
                          initialExpanded={shouldExpandPanel("relevance")} 
                        />
                      );
                    case "comparative":
                      return lastMessage.comparativeInsights && (
                        <ComparativePanel 
                          key="comparative"
                          insights={lastMessage.comparativeInsights} 
                          initialExpanded={shouldExpandPanel("comparative")} 
                        />
                      );
                    case "ledger":
                      return (
                        <DemoTrustLedgerPanel
                          key="ledger"
                          initialExpanded={shouldExpandPanel("ledger")}
                        />
                      );
                    default:
                      return null;
                  }
                })}
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
          canSandboxExecute={
            messages.find(m => m.id === activePreviewModal.messageId)?.relevance?.intent === "scheduling"
          }
        />
      )}

      {/* PHASE U-03: INTERNAL KILL-SWITCH CONTROL SURFACE */}
      <div className="mt-12 mb-8 p-6 border-2 border-dashed border-red-200 rounded-xl bg-red-50/30 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">
            Internal Validation Surface · Objective U-03
          </span>
          <p className="text-xs text-slate-500 max-w-md">
            Use these controls to validate sandbox halt capabilities. 
            Internal only. Not a product feature.
          </p>
        </div>

        <div className="flex gap-4">
          {!isSandboxHalted ? (
            <button
              onClick={handleHaltSandbox}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              HALT SANDBOX EXECUTION (INTERNAL)
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="px-4 py-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs font-bold uppercase">
                Status: Sandbox Execution Halted
              </div>
              <button
                onClick={handleResetSandbox}
                className="text-[10px] text-slate-400 font-bold uppercase hover:text-slate-600 underline underline-offset-4"
              >
                Reset Sandbox (Dev Only)
              </button>
            </div>
          )}
        </div>
      </div>
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
