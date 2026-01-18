"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { PilotSessionShell, AudioInputSim, PreparingDraftState } from "@/components/pilot";
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";
import { generateSoapDraftFromTranscript } from "@/app/clinician/actions";

const persistenceAdapter = createPilotPersistenceAdapter();

/**
 * Pilot Clinical Experience Page
 * 
 * A visually guided demo experience with:
 * - REAL push-to-talk audio capture (user-initiated only)
 * - Transcription for draft seeding
 * - Skip recording fallback for reliable demos
 * - Clear session lifecycle
 * - Deterministic "Preparing your notes draft" transition
 * 
 * SAFETY INVARIANTS:
 * - Audio capture is user-initiated ONLY (button click)
 * - Audio is held in memory only during transcription
 * - Audio blob is discarded immediately after draft generation
 * - No audio persistence or upload
 * - No background or passive listening
 * - Persistence behavior unchanged (reuses existing logic)
 */

type PilotStep = "idle" | "session_active" | "preparing" | "draft_ready" | "finalized";

// Speaker attribution types - EPHEMERAL (React state only)
type Speaker = "clinician" | "patient";

interface TranscriptSegment {
  speaker: Speaker;
  text: string;
  timestamp: number;
}

/**
 * Deterministic transcript text formatter
 * 
 * Improves readability by adding punctuation and paragraph breaks
 * WITHOUT changing, removing, or rewording any spoken content.
 * 
 * SAFETY: Pure function, no LLM/AI, no persistence, no logging.
 * 
 * @param rawText - The raw transcript text (words exactly as spoken)
 * @returns Formatted text with sentence boundaries and paragraphs
 */
function formatTranscriptText(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;
  
  const text = rawText.trim();
  
  // Split into words while preserving whitespace structure
  const words = text.split(/\s+/);
  if (words.length === 0) return text;
  
  // Conjunction patterns that often indicate sentence boundaries
  // These are common speech patterns where speakers naturally pause
  const sentenceBreakPatterns = [
    /^(so)$/i,
    /^(and)$/i,
    /^(but)$/i,
    /^(then)$/i,
    /^(now)$/i,
    /^(okay)$/i,
    /^(ok)$/i,
    /^(well)$/i,
    /^(also)$/i,
    /^(anyway)$/i,
    /^(actually)$/i,
    /^(basically)$/i,
  ];
  
  // Multi-word patterns that indicate boundaries (check previous + current word)
  const multiWordBreakPatterns = [
    ["and", "then"],
    ["and", "so"],
    ["so", "then"],
    ["and", "now"],
    ["but", "then"],
    ["okay", "so"],
    ["ok", "so"],
  ];
  
  const sentences: string[] = [];
  let currentSentence: string[] = [];
  let wordsSinceLastBreak = 0;
  const minWordsPerSentence = 5; // Minimum words before allowing a break
  const maxWordsPerSentence = 20; // Force break after this many words
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1].toLowerCase() : "";
    const currentWordLower = word.toLowerCase();
    
    // Check if we should break before this word
    let shouldBreak = false;
    
    // Only consider breaking if we have enough words
    if (wordsSinceLastBreak >= minWordsPerSentence) {
      // Check multi-word patterns (break BEFORE current word)
      for (const [first, second] of multiWordBreakPatterns) {
        if (prevWord === first && currentWordLower === second) {
          shouldBreak = true;
          break;
        }
      }
      
      // Check single-word patterns at word boundaries
      if (!shouldBreak && sentenceBreakPatterns.some(p => p.test(word))) {
        shouldBreak = true;
      }
    }
    
    // Force break if sentence is too long
    if (wordsSinceLastBreak >= maxWordsPerSentence) {
      shouldBreak = true;
    }
    
    // Execute break if needed
    if (shouldBreak && currentSentence.length > 0) {
      sentences.push(currentSentence.join(" "));
      currentSentence = [];
      wordsSinceLastBreak = 0;
    }
    
    currentSentence.push(word);
    wordsSinceLastBreak++;
  }
  
  // Add remaining words as final sentence
  if (currentSentence.length > 0) {
    sentences.push(currentSentence.join(" "));
  }
  
  // Format sentences: capitalize first letter, add period at end
  const formattedSentences = sentences.map(sentence => {
    const trimmed = sentence.trim();
    if (!trimmed) return "";
    
    // Capitalize first letter
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    
    // Add period if not already ending with punctuation
    const lastChar = capitalized.slice(-1);
    if (!/[.!?]/.test(lastChar)) {
      return capitalized + ".";
    }
    return capitalized;
  }).filter(s => s.length > 0);
  
  // Group sentences into paragraphs (2-3 sentences per paragraph)
  const paragraphs: string[] = [];
  const sentencesPerParagraph = 3;
  
  for (let i = 0; i < formattedSentences.length; i += sentencesPerParagraph) {
    const paragraphSentences = formattedSentences.slice(i, i + sentencesPerParagraph);
    paragraphs.push(paragraphSentences.join(" "));
  }
  
  // Join paragraphs with double newline for visual separation
  // For short transcripts (1 paragraph), just return the text
  if (paragraphs.length <= 1) {
    return paragraphs.join("");
  }
  
  return paragraphs.join("\n\n");
}

// Demo draft content for the pilot experience
const DEMO_DRAFT = {
  text: `SUBJECTIVE:
Patient presents for a routine follow-up appointment. Reports generally feeling well with no new complaints. Denies any chest pain, shortness of breath, or palpitations. Sleep and appetite are normal. No recent changes to medications.

OBJECTIVE:
Vital Signs: BP 122/78 mmHg, HR 72 bpm, RR 16, Temp 98.4°F, SpO2 98% on room air
General: Alert and oriented, no acute distress
HEENT: Normocephalic, PERRLA, oropharynx clear
Cardiovascular: Regular rate and rhythm, no murmurs
Respiratory: Clear to auscultation bilaterally
Extremities: No edema, pulses intact

ASSESSMENT:
1. Hypertension - well controlled on current regimen
2. Type 2 Diabetes - A1c pending, patient reports good glucose control
3. Hyperlipidemia - stable on statin therapy

PLAN:
1. Continue current medications
2. Review labs at next visit
3. Return in 3 months for routine follow-up
4. Patient to continue home BP monitoring`,
  labels: ["AI Suggested", "Pilot Demo", "Requires Review"],
  metadata: {
    generatedAt: new Date().toISOString(),
    draftVersion: "1.0",
    source: "pilot-demo-simulation",
    disclaimer: "This is a demonstration draft. Not for clinical use.",
  },
};

/**
 * Placeholder transcription function
 * 
 * In a production environment, this would call a speech-to-text API.
 * For the demo, we use the Web Speech API if available, otherwise
 * return the demo draft content.
 * 
 * IMPORTANT: Audio blob is discarded after transcription attempt.
 */
async function transcribeAudio(audioBlob: Blob): Promise<{ 
  success: boolean; 
  text: string | null; 
  error?: string;
}> {
  // Attempt to use Web Speech API for demo purposes
  // Note: This is a placeholder - real transcription would require
  // a proper speech-to-text service
  
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, we'll indicate that the audio was captured
    // but use the demo SOAP note template since we don't have a real
    // transcription service
    
    // The audio blob will be discarded after this function returns
    // regardless of success or failure
    
    return {
      success: true,
      text: null, // No actual transcription - will use demo draft
    };
  } catch (error) {
    console.error("Transcription error:", error);
    return {
      success: false,
      text: null,
      error: "Could not transcribe audio. You may edit the draft manually.",
    };
  }
}

export default function PilotPage() {
  const [step, setStep] = useState<PilotStep>("idle");
  const [isListening, setIsListening] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [draftGenerationError, setDraftGenerationError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Editable draft state - source of truth for finalization
  const [editableDraft, setEditableDraft] = useState<string>("");
  
  // Transcript state - EPHEMERAL (React state only, never persisted)
  // SAFETY: Transcript exists ONLY in memory. On reset or page refresh, it is lost.
  // SAFETY: No localStorage, sessionStorage, indexedDB, filesystem, or logging.
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [currentSegmentText, setCurrentSegmentText] = useState<string>("");
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(true);
  
  
  // Audio blob ref - held in memory only during processing
  // IMPORTANT: This is set to null after draft generation
  const audioBlobRef = useRef<Blob | null>(null);

  const handleStartSession = useCallback(() => {
    setStep("session_active");
    setIsListening(false);
    setHasRecorded(false);
    setTranscriptionError(null);
    setDraftGenerationError(null);
    // Clear transcript state (ephemeral - memory only)
    setTranscriptSegments([]);
    setCurrentSegmentText("");
    audioBlobRef.current = null;
  }, []);

  /**
   * Automatically infer speaker from transcript content using conservative rules.
   * 
   * Conservative approach: Default to "clinician" unless there are strong indicators
   * of patient speech. This errs on the side of caution since the clinician is
   * operating the system and most medical terminology comes from them.
   * 
   * The user can correct any misattributions during the review phase.
   */
  const inferSpeaker = useCallback((text: string): Speaker => {
    const lowerText = text.toLowerCase();
    
    // Conservative patient indicators: first-person health complaints
    // Only trigger on strong indicators to avoid false positives
    const patientIndicators = [
      /^i('m| am| have| feel| think| was| got| had| need)/,  // First person start
      /^my (head|back|chest|stomach|arm|leg|throat|pain|symptom)/,  // Possessive health
      /^it (hurts|aches|burns|itches|started)/,  // Symptom descriptions
      /^(yes|no|yeah|nope|uh-huh|okay),? (i|my|it)/i,  // Responses + first person
    ];
    
    for (const pattern of patientIndicators) {
      if (pattern.test(lowerText)) {
        return "patient";
      }
    }
    
    // Default to clinician (conservative)
    return "clinician";
  }, []);

  // Handle transcript updates from speech recognition (ephemeral - React state only)
  const handleTranscriptUpdate = useCallback((transcript: string, isFinal: boolean) => {
    // SAFETY: Transcript is stored ONLY in React state
    // No persistence to localStorage, sessionStorage, indexedDB, or filesystem
    // No logging to console
    
    // Update current segment text (interim)
    setCurrentSegmentText(transcript);
    
    if (isFinal && transcript.trim()) {
      // When recording stops, finalize the current segment with inferred speaker
      const trimmedText = transcript.trim();
      const newSegment: TranscriptSegment = {
        speaker: inferSpeaker(trimmedText),
        text: trimmedText,
        timestamp: Date.now(),
      };
      setTranscriptSegments(prev => [...prev, newSegment]);
      setCurrentSegmentText("");
    }
  }, [inferSpeaker]);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      // Stopping - mark as having recorded something
      setHasRecorded(true);
    }
    setIsListening(!isListening);
  }, [isListening]);

  // Called when audio recording stops and blob is available
  const handleAudioCaptured = useCallback((audioBlob: Blob | null) => {
    if (audioBlob) {
      audioBlobRef.current = audioBlob;
    }
  }, []);

  // Process audio and generate draft
  const processCapturedAudioAndGenerateDraft = useCallback(async () => {
    let transcribedText: string | null = null;
    
    if (audioBlobRef.current) {
      try {
        const result = await transcribeAudio(audioBlobRef.current);
        
        if (result.success && result.text) {
          transcribedText = result.text;
        } else if (result.error) {
          setTranscriptionError(result.error);
        }
      } catch (error) {
        console.error("Transcription failed:", error);
        setTranscriptionError("Could not transcribe audio. You may edit the draft manually.");
      } finally {
        // CRITICAL: Discard audio blob after transcription attempt
        // Audio is never persisted or retained after draft generation
        audioBlobRef.current = null;
      }
    }
    
    // Seed draft with transcribed text or fall back to demo draft
    const draftText = transcribedText 
      ? `[Transcribed from recording]\n\n${transcribedText}`
      : DEMO_DRAFT.text;
    
    return draftText;
  }, []);

  const handleEndSession = useCallback(async () => {
    // Stop any active listening
    setIsListening(false);
    
    // Finalize any pending current segment text
    if (currentSegmentText.trim()) {
      const trimmedText = currentSegmentText.trim();
      const finalSegment: TranscriptSegment = {
        speaker: inferSpeaker(trimmedText),
        text: trimmedText,
        timestamp: Date.now(),
      };
      setTranscriptSegments(prev => [...prev, finalSegment]);
      setCurrentSegmentText("");
    }
    
    setDraftGenerationError(null);
    
    // Show preparing state
    setStep("preparing");
    
    // Record draft generation (reuses existing persistence logic)
    await persistenceAdapter.recordDraftGenerated("HUMAN_CONFIRMED_END_SESSION", {
      draftId: `pilot-draft-${Date.now()}`,
      labels: DEMO_DRAFT.labels,
      authorId: "pilot-demo-clinician",
      ...({ source: "pilot-ui", humanAction: true } as any),
    } as any);

    // Build transcript text from segments for draft generation
    // Include speaker labels for context, with formatted text for better readability
    const transcriptToUse = transcriptSegments
      .map(seg => `[${seg.speaker === "clinician" ? "Clinician" : "Patient"}]: ${formatTranscriptText(seg.text)}`)
      .join("\n\n");

    // Generate SOAP draft from transcript if available
    let draftText: string;
    
    if (transcriptToUse) {
      try {
        // Call server action to generate SOAP draft from transcript
        const result = await generateSoapDraftFromTranscript(transcriptToUse);
        
        if (result.success && result.draft) {
          draftText = result.draft;
        } else {
          // Draft generation failed, show error but allow manual editing
          setDraftGenerationError(result.error || "Could not generate draft from transcript. You may edit manually.");
          draftText = DEMO_DRAFT.text;
        }
      } catch {
        // Server action failed, fall back to demo draft
        setDraftGenerationError("Could not generate draft from transcript. You may edit manually.");
        draftText = DEMO_DRAFT.text;
      }
    } else {
      // No transcript available, use demo draft
      draftText = await processCapturedAudioAndGenerateDraft();
    }
    
    // Additional deterministic delay for UI consistency (1-2 seconds total)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Initialize editable draft
    setEditableDraft(draftText);
    setStep("draft_ready");
    
    // Discard audio blob after draft generation
    audioBlobRef.current = null;
  }, [currentSegmentText, transcriptSegments, processCapturedAudioAndGenerateDraft, inferSpeaker]);

  // Skip recording and use demo draft directly
  const handleSkipRecording = useCallback(async () => {
    // Stop any active listening
    setIsListening(false);
    
    // Discard any captured audio and transcript (ephemeral - memory only)
    audioBlobRef.current = null;
    setTranscriptSegments([]);
    setCurrentSegmentText("");
    setDraftGenerationError(null);
    
    // Show preparing state
    setStep("preparing");
    
    // Record draft generation
    await persistenceAdapter.recordDraftGenerated("HUMAN_SKIPPED_RECORDING", {
      draftId: `pilot-draft-${Date.now()}`,
      labels: DEMO_DRAFT.labels,
      authorId: "pilot-demo-clinician",
      ...({ source: "pilot-ui", humanAction: true, skippedRecording: true } as any),
    } as any);

    // Deterministic delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Initialize editable draft with demo content
    setEditableDraft(DEMO_DRAFT.text);
    setStep("draft_ready");
  }, []);

  const handleFinalize = useCallback(async () => {
    setIsFinalizing(true);
    
    // Reuse existing finalize logic (persistence behavior unchanged)
    // Uses the CURRENT edited draft text as source of truth
    await persistenceAdapter.recordFinalizedNote("HUMAN_SIGNED_FINALIZE", {
      noteId: `pilot-note-${Date.now()}`,
      authorId: "pilot-demo-clinician",
      signedAt: new Date(),
      content: editableDraft, // Edited draft content
      ...({ source: "pilot-ui", humanAction: true } as any),
    } as any);
    
    setIsFinalizing(false);
    setStep("finalized");
  }, [editableDraft]);

  // Handler to correct speaker attribution during review
  const handleSpeakerCorrection = useCallback((index: number) => {
    setTranscriptSegments(prev => prev.map((segment, i) => {
      if (i === index) {
        // Toggle between clinician and patient
        return {
          ...segment,
          speaker: segment.speaker === "clinician" ? "patient" : "clinician",
        };
      }
      return segment;
    }));
  }, []);

  // Handler to regenerate draft after speaker corrections
  const handleRegenerateDraft = useCallback(async () => {
    if (transcriptSegments.length === 0) return;
    
    setIsRegenerating(true);
    setDraftGenerationError(null);
    
    try {
      // Build transcript text from corrected segments
      const transcriptToUse = transcriptSegments
        .map(seg => `[${seg.speaker === "clinician" ? "Clinician" : "Patient"}]: ${formatTranscriptText(seg.text)}`)
        .join("\n\n");
      
      const result = await generateSoapDraftFromTranscript(transcriptToUse);
      
      if (result.success && result.draft) {
        setEditableDraft(result.draft);
      } else {
        setDraftGenerationError(result.error || "Could not regenerate draft. You may continue editing manually.");
      }
    } catch {
      setDraftGenerationError("Could not regenerate draft. You may continue editing manually.");
    } finally {
      setIsRegenerating(false);
    }
  }, [transcriptSegments]);

  const handleReset = useCallback(() => {
    setStep("idle");
    setIsListening(false);
    setHasRecorded(false);
    setIsFinalizing(false);
    setIsRegenerating(false);
    setTranscriptionError(null);
    setDraftGenerationError(null);
    setEditableDraft(""); // Discard any draft changes
    // Clear all transcript state (ephemeral - memory only)
    // SAFETY: On reset, transcript is lost. This is intended.
    setTranscriptSegments([]);
    setCurrentSegmentText("");
    setIsTranscriptExpanded(true);
    audioBlobRef.current = null; // Ensure no audio is retained
  }, []);

  return (
    <PilotSessionShell>
      {/* Preparing Draft State (modal overlay) */}
      <PreparingDraftState isVisible={step === "preparing"} />

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {[
            { key: "idle", label: "1. Start" },
            { key: "session_active", label: "2. Record" },
            { key: "draft_ready", label: "3. Review" },
            { key: "finalized", label: "4. Finalize" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.key}>
              <div
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${step === s.key || (s.key === "idle" && step === "preparing") || 
                    (s.key === "draft_ready" && step === "preparing") ||
                    (arr.findIndex(x => x.key === step) > i) ||
                    (step === "finalized" && s.key !== "finalized")
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  arr.findIndex(x => x.key === step) > i || step === "finalized"
                    ? "bg-emerald-300" 
                    : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Idle - Start Session */}
      {step === "idle" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Start Clinical Session
            </h2>
            <p className="text-slate-600 mb-6">
              Begin a consultation session. You&apos;ll be able to use 
              push-to-talk to capture audio notes during the encounter.
            </p>
            <button
              onClick={handleStartSession}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Start Clinical Session
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Session Active - Audio Input */}
      {step === "session_active" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Session in Progress
              </h2>
              <p className="text-sm text-slate-500">
                Use push-to-talk to capture consultation audio
              </p>
            </div>

            <AudioInputSim
              isListening={isListening}
              onToggle={handleToggleListening}
              onAudioCaptured={handleAudioCaptured}
              onTranscriptUpdate={handleTranscriptUpdate}
            />

            {/* Live transcript display during recording */}
            {(isListening || transcriptSegments.length > 0 || currentSegmentText) && (
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Live transcript (reference only · not saved)
                  </span>
                  {isListening && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <div className="space-y-3 min-h-[60px]">
                  {/* Render completed segments with formatted text */}
                  {transcriptSegments.map((segment, index) => (
                    <div key={index} className="flex gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                        segment.speaker === "clinician"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {segment.speaker === "clinician" ? "Clinician" : "Patient"}
                      </span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{formatTranscriptText(segment.text)}</p>
                    </div>
                  ))}
                  {/* Current segment being transcribed (live - show raw for immediacy) */}
                  {currentSegmentText && (() => {
                    const inferredSpeaker = inferSpeaker(currentSegmentText);
                    return (
                      <div className="flex gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                          inferredSpeaker === "clinician"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {inferredSpeaker === "clinician" ? "Clinician" : "Patient"}
                          <span className="ml-1 opacity-60">(auto)</span>
                        </span>
                        <p className="text-sm text-slate-700 italic">{currentSegmentText}</p>
                      </div>
                    );
                  })()}
                  {/* Empty state */}
                  {transcriptSegments.length === 0 && !currentSegmentText && (
                    <span className="text-slate-400 italic text-sm">
                      {isListening ? "Listening... speak now" : "No transcript captured"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {hasRecorded && !isListening && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700 text-center">
                  <span className="font-medium">Audio captured.</span> You can continue recording or end the session.
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSkipRecording}
                disabled={isListening}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-colors
                  ${isListening 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                Skip recording and use demo draft
              </button>
              <button
                onClick={handleEndSession}
                disabled={isListening}
                className={`
                  px-8 py-3 rounded-lg font-semibold transition-colors
                  ${isListening 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-slate-800 text-white hover:bg-slate-900 shadow-lg"
                  }
                `}
              >
                End Session
              </button>
            </div>
            
            {isListening && (
              <p className="text-xs text-center text-gray-500">
                Stop recording before ending the session
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3 & 4: Draft Ready - Review and Finalize */}
      {step === "draft_ready" && (
        <div className="space-y-6">
          {/* Transcription error notice */}
          {transcriptionError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 text-center">
                {transcriptionError}
              </p>
            </div>
          )}

          {/* Draft generation error notice */}
          {draftGenerationError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 text-center">
                {draftGenerationError}
              </p>
            </div>
          )}

          {/* Transcript reference panel (collapsible) */}
          {transcriptSegments.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg 
                    className={`w-4 h-4 text-slate-500 transition-transform ${isTranscriptExpanded ? "rotate-90" : ""}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">
                    Transcript (reference only · not saved)
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {isTranscriptExpanded ? "Click to collapse" : "Click to expand"}
                </span>
              </button>
              {isTranscriptExpanded && (
                <div className="px-4 pb-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mt-3 mb-2 italic">
                    The transcript is not part of the medical record unless you copy content into the note.
                    <span className="block mt-1 text-slate-400">
                      Click a speaker label to correct attribution if needed.
                    </span>
                  </p>
                  <div className="p-3 bg-white rounded border border-slate-200 max-h-48 overflow-y-auto space-y-2">
                    {transcriptSegments.map((segment, index) => (
                      <div key={index} className="flex gap-2">
                        <button
                          onClick={() => handleSpeakerCorrection(index)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 h-fit cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all ${
                            segment.speaker === "clinician"
                              ? "bg-emerald-100 text-emerald-700 hover:ring-emerald-400"
                              : "bg-blue-100 text-blue-700 hover:ring-blue-400"
                          }`}
                          title="Click to change speaker"
                        >
                          {segment.speaker === "clinician" ? "Clinician" : "Patient"}
                        </button>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{formatTranscriptText(segment.text)}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleRegenerateDraft}
                    disabled={isRegenerating}
                    className="mt-3 text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-300 transition-colors disabled:opacity-50"
                  >
                    {isRegenerating ? "Regenerating..." : "Regenerate draft from transcript"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                    DRAFT ONLY
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                    Not signed
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                    Requires clinician review
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label htmlFor="clinical-draft" className="block font-bold text-gray-700 mb-2 pb-2 border-b border-gray-200">
                Clinical draft (review and edit before finalizing)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                This draft will not be saved until you sign and finalize.
              </p>
              <textarea
                id="clinical-draft"
                value={editableDraft}
                onChange={(e) => setEditableDraft(e.target.value)}
                className="w-full min-h-[400px] text-gray-800 font-serif leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-y"
                placeholder="Clinical draft content..."
              />
            </div>

            <div className="px-6 pb-6">
              <h4 className="font-bold text-gray-700 mb-2 text-sm">Labels:</h4>
              <div className="flex flex-wrap gap-2">
                {DEMO_DRAFT.labels.map((label, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Start New Session
              </button>
              <button
                onClick={handleFinalize}
                disabled={isFinalizing || !editableDraft.trim()}
                className="px-8 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFinalizing ? "Finalizing..." : "✓ Sign and Finalize"}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center max-w-md">
              You are signing this note as final. By clicking &quot;Sign and Finalize&quot;, 
              you confirm this documentation is accurate and complete.
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Finalized */}
      {step === "finalized" && (
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Notes Finalized
            </h2>
            <p className="text-slate-600 mb-6">
              The clinical notes have been signed and finalized. In a production environment,
              this would be persisted to the clinical record.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Start New Session
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </PilotSessionShell>
  );
}
