"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// SpeechRecognition types for browser compatibility
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface AudioInputSimProps {
  isListening: boolean;
  onToggle: () => void;
  onAudioCaptured?: (audioBlob: Blob | null) => void;
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  disabled?: boolean;
}

type PermissionState = "prompt" | "granted" | "denied" | "error";
type SpeechSupportState = "checking" | "supported" | "unsupported";

/**
 * AudioInputSim - Real push-to-talk audio capture with live transcription
 * 
 * SAFETY INVARIANTS:
 * - Audio capture is user-initiated ONLY (button click required)
 * - Transcription is user-initiated ONLY (starts with recording)
 * - Push-to-talk model: click to start, click to stop
 * - Transcript exists only in React state (passed via callback)
 * - No transcript persistence (localStorage, sessionStorage, indexedDB, filesystem)
 * - No transcript logging to console
 * - Audio blob is passed to parent for backup, then discarded
 * - No background or passive listening
 * - No audio persistence or upload
 * - No auto-start recording/transcription
 * 
 * Uses:
 * - Web Speech API (SpeechRecognition) for real-time transcription
 * - navigator.mediaDevices.getUserMedia (user-initiated)
 * - MediaRecorder for audio capture (fallback)
 */
export function AudioInputSim({ 
  isListening, 
  onToggle, 
  onAudioCaptured,
  onTranscriptUpdate,
  disabled 
}: AudioInputSimProps) {
  const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [speechSupport, setSpeechSupport] = useState<SpeechSupportState>("checking");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedTranscriptRef = useRef<string>("");

  // Check for SpeechRecognition support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = 
      typeof window !== "undefined" 
        ? window.SpeechRecognition || window.webkitSpeechRecognition 
        : null;
    
    setSpeechSupport(SpeechRecognitionAPI ? "supported" : "unsupported");
  }, []);

  // Cleanup function to release media resources
  const cleanupMediaResources = useCallback(() => {
    // Stop speech recognition
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
      speechRecognitionRef.current = null;
    }
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    // Clear accumulated transcript (ephemeral - memory only)
    accumulatedTranscriptRef.current = "";
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaResources();
    };
  }, [cleanupMediaResources]);

  // Initialize and start speech recognition (user-initiated only)
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognitionAPI = 
      typeof window !== "undefined" 
        ? window.SpeechRecognition || window.webkitSpeechRecognition 
        : null;
    
    if (!SpeechRecognitionAPI) {
      return; // Speech recognition not supported, but don't block recording
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      // Reset accumulated transcript at start
      accumulatedTranscriptRef.current = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscriptPart = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscriptPart += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Accumulate final transcript parts
        if (finalTranscriptPart) {
          accumulatedTranscriptRef.current += finalTranscriptPart;
        }

        // Build full current transcript: accumulated finals + current interim
        const fullTranscript = accumulatedTranscriptRef.current + interimTranscript;
        
        // Pass transcript to parent (ephemeral - React state only)
        if (onTranscriptUpdate) {
          onTranscriptUpdate(fullTranscript.trim(), false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Handle non-fatal errors silently - don't break the recording
        if (event.error === "no-speech") {
          // User hasn't spoken yet - this is normal, restart recognition
          try {
            recognition.stop();
            setTimeout(() => {
              if (speechRecognitionRef.current === recognition) {
                recognition.start();
              }
            }, 100);
          } catch {
            // Ignore restart errors
          }
        }
        // For other errors, we let recording continue without transcription
      };

      recognition.onend = () => {
        // If we're still supposed to be listening, restart recognition
        // This handles the case where recognition auto-stops (timeout)
        // The ref check ensures we don't restart after manual stop (when ref is null)
        if (speechRecognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            // Recognition may have been aborted, which is fine
          }
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      // Speech recognition failed to start, but don't block recording
    }
  }, [onTranscriptUpdate]);

  // Stop speech recognition
  const stopSpeechRecognition = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
      speechRecognitionRef.current = null;
      
      // Send final transcript to parent
      if (onTranscriptUpdate && accumulatedTranscriptRef.current) {
        onTranscriptUpdate(accumulatedTranscriptRef.current.trim(), true);
      }
    }
  }, [onTranscriptUpdate]);

  const startRecording = useCallback(async () => {
    try {
      setPermissionError(null);
      
      // Request microphone access (user-initiated via button click)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      streamRef.current = stream;
      setPermissionState("granted");
      
      // Create MediaRecorder for audio blob capture (fallback)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create blob from recorded chunks
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        // Pass audio blob to parent (backup in case transcription fails)
        if (onAudioCaptured) {
          onAudioCaptured(audioBlob);
        }
        
        // Clear chunks immediately after creating blob
        audioChunksRef.current = [];
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      // Start media recording
      mediaRecorder.start(1000); // Collect data every second
      
      // Start speech recognition for live transcription (user-initiated)
      startSpeechRecognition();
      
      onToggle();
      
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setPermissionState("denied");
          setPermissionError("Microphone access was denied. Please allow microphone access or use 'Skip recording'.");
        } else if (error.name === "NotFoundError") {
          setPermissionState("error");
          setPermissionError("No microphone found. Please connect a microphone or use 'Skip recording'.");
        } else {
          setPermissionState("error");
          setPermissionError("Could not access microphone. Please use 'Skip recording'.");
        }
      } else {
        setPermissionState("error");
        setPermissionError("Could not access microphone. Please use 'Skip recording'.");
      }
    }
  }, [onToggle, onAudioCaptured, startSpeechRecognition]);

  const stopRecording = useCallback(() => {
    // Stop speech recognition first to get final transcript
    stopSpeechRecognition();
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    onToggle();
  }, [onToggle, stopSpeechRecognition]);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  // Check if browser supports required APIs for audio recording
  const isRecordingSupported = typeof navigator !== "undefined" && 
    "mediaDevices" in navigator && 
    "getUserMedia" in navigator.mediaDevices;
  
  // Transcription requires speech recognition support
  const isTranscriptionSupported = speechSupport === "supported";

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Permission error message */}
      {permissionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-sm text-center">
          <p className="text-sm text-red-700">{permissionError}</p>
        </div>
      )}

      {/* Browser not supported message for recording */}
      {!isRecordingSupported && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-sm text-center">
          <p className="text-sm text-amber-700">
            Your browser doesn&apos;t support audio recording. 
            Please use &quot;Skip recording&quot; to continue with the demo draft.
          </p>
        </div>
      )}

      {/* Transcription not supported notice */}
      {isRecordingSupported && !isTranscriptionSupported && speechSupport !== "checking" && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-sm text-center">
          <p className="text-sm text-blue-700">
            Live transcription is not available in this browser. 
            Recording will work, but you may want to use Chrome or Edge for live transcription, 
            or use &quot;Skip recording&quot; to continue with the demo draft.
          </p>
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={disabled || !isRecordingSupported}
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300 
          flex items-center justify-center
          ${disabled || !isRecordingSupported ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isListening 
            ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50" 
            : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"
          }
        `}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {/* Pulsing ring animation when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
            <span className="absolute inset-[-4px] rounded-full border-2 border-red-400 animate-pulse" />
            <span className="absolute inset-[-8px] rounded-full border border-red-300 animate-pulse opacity-50" />
          </>
        )}
        
        {/* Microphone / Stop icon */}
        <svg 
          className="w-10 h-10 text-white relative z-10" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          {isListening ? (
            // Stop icon (square)
            <rect x="6" y="6" width="12" height="12" rx="2" />
          ) : (
            // Microphone icon
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          )}
        </svg>
      </button>

      <div className="text-center space-y-1">
        <p className={`font-semibold ${isListening ? "text-red-600" : "text-gray-700"}`}>
          {isListening ? "Listening..." : "Push to talk"}
        </p>
        <p className="text-xs text-gray-500">
          {isListening 
            ? "Click to stop recording" 
            : permissionState === "granted" 
              ? "Click to start recording"
              : "Click to start (requires microphone permission)"
          }
        </p>
      </div>

      {/* Animated waveform visualization when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 h-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-400 rounded-full waveform-bar"
              style={{
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes waveform {
              0%, 100% { height: 8px; }
              50% { height: 32px; }
            }
            .waveform-bar {
              animation: waveform 0.6s ease-in-out infinite;
              height: 8px;
            }
          `}</style>
        </div>
      )}

      {/* Demo mode notice - different text when listening */}
      <div className="mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
        <p className="text-xs text-amber-700 font-medium">
          {isListening 
            ? "Listening (audio and transcript are not stored)"
            : "Demo mode · Audio and transcript are not stored"
          }
        </p>
      </div>
    </div>
  );
}
