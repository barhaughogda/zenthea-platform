"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface AudioInputSimProps {
  isListening: boolean;
  onToggle: () => void;
  onAudioCaptured?: (audioBlob: Blob | null) => void;
  disabled?: boolean;
}

type PermissionState = "prompt" | "granted" | "denied" | "error";

/**
 * AudioInputSim - Real push-to-talk audio capture component
 * 
 * SAFETY INVARIANTS:
 * - Audio capture is user-initiated ONLY (button click required)
 * - Push-to-talk model: click to start, click to stop
 * - Audio blob is passed to parent for transcription, then discarded
 * - No background or passive listening
 * - No audio persistence or upload
 * - No auto-start recording
 * 
 * Uses:
 * - navigator.mediaDevices.getUserMedia (user-initiated)
 * - MediaRecorder for audio capture
 */
export function AudioInputSim({ 
  isListening, 
  onToggle, 
  onAudioCaptured,
  disabled 
}: AudioInputSimProps) {
  const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup function to release media resources
  const cleanupMediaResources = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaResources();
    };
  }, [cleanupMediaResources]);

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
      
      // Create MediaRecorder
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
        
        // Pass audio blob to parent for transcription
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
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      onToggle();
      
    } catch (error) {
      console.error("Microphone access error:", error);
      
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
  }, [onToggle, onAudioCaptured]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    onToggle();
  }, [onToggle]);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  // Check if browser supports required APIs
  const isSupported = typeof navigator !== "undefined" && 
    "mediaDevices" in navigator && 
    "getUserMedia" in navigator.mediaDevices;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Permission error message */}
      {permissionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-sm text-center">
          <p className="text-sm text-red-700">{permissionError}</p>
        </div>
      )}

      {/* Browser not supported message */}
      {!isSupported && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-sm text-center">
          <p className="text-sm text-amber-700">
            Your browser doesn&apos;t support audio recording. 
            Please use &quot;Skip recording&quot; to continue with the demo draft.
          </p>
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={disabled || !isSupported}
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300 
          flex items-center justify-center
          ${disabled || !isSupported ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
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
            ? "Listening (demo mode · audio is not stored)"
            : "Demo mode · Audio is not stored"
          }
        </p>
      </div>
    </div>
  );
}
