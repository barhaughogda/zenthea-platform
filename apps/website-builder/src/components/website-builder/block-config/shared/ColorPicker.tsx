'use client';

import React from 'react';
import { Label } from '@starter/ui';
import { Input } from '@starter/ui';

/**
 * Convert CSS variable to hex color value
 * Falls back to default hex if variable can't be resolved
 */
export function cssVarToHex(cssVar: string): string {
  // If it's already a hex color, return it
  if (cssVar.startsWith('#')) {
    return cssVar;
  }
  
  // If it's a CSS variable, try to resolve it
  const normalized = cssVar.toLowerCase();
  if (normalized.startsWith('var(--')) {
    // Extract variable name
    const varName = normalized.match(/var\(--([^)]+)\)/)?.[1];
    if (!varName) {
      return '#000000'; // Fallback
    }
    
    // Try to get computed value from document
    if (varName && typeof window !== 'undefined') {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
      if (computed) {
        // If it's already hex, return it
        if (computed.startsWith('#')) {
          return computed;
        }
        // Try to parse RGB/RGBA
        const rgbMatch = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
          const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
          const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
          const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`.toUpperCase();
        }
      }
    }
    
    // Known CSS variable defaults
    const knownVars: Record<string, string> = {
      'zenthea-teal': '#008080',
      'zenthea-purple': '#5F284A',
      'zenthea-coral': '#E07B7E',
      'zenthea-cream': '#F2DDC9',
    };
    
    return knownVars[varName] || '#000000';
  }
  
  // If it's not a CSS variable or hex, return fallback
  return '#000000';
}

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ label, value, onChange, disabled }: ColorPickerProps) {
  // Convert CSS variables to hex for the color input
  const hexValue = cssVarToHex(value);
  
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-border-primary overflow-hidden flex-shrink-0"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={hexValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
            aria-label={`Pick ${label} color`}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
