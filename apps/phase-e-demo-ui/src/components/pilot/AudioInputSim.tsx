"use client";

import React from "react";

interface AudioInputSimProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * AudioInputSim - Simulated audio input component
 * 
 * IMPORTANT: This is a UI-only simulation.
 * - No real microphone access
 * - No MediaRecorder
 * - No Web Audio API
 * - State lives only in component memory
 * - Audio is NOT stored
 */
export function AudioInputSim({ isListening, onToggle, disabled }: AudioInputSimProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300 
          flex items-center justify-center
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
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
        
        {/* Microphone icon */}
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
            : "Click to start simulated recording"
          }
        </p>
      </div>

      {/* Simulated waveform visualization when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 h-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-400 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 24 + 8}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.3 + Math.random() * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Demo mode notice */}
      <div className="mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
        <p className="text-xs text-amber-700 font-medium">
          Demo mode · Audio is not stored
        </p>
      </div>
    </div>
  );
}
