'use client';

import React, { useState } from 'react';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Input } from '@starter/ui';
import {
  BackgroundTokens,
  TextTokens,
  type BackgroundToken,
  type TextToken,
  type ButtonAppearance,
  type CTABandBlockProps,
  type HeroBlockProps,
} from '@/lib/website-builder/schema';

export interface ButtonAppearanceFormProps {
  props: Record<string, unknown>;
  onUpdate: (props: Record<string, unknown>) => void;
  disabled?: boolean;
}

/**
 * Button token labels for UI - more appropriate for button styling
 */
const BUTTON_BACKGROUND_TOKEN_LABELS: Record<BackgroundToken, string> = {
  'default': 'Auto (Smart Default)',
  'primary': 'White',
  'secondary': 'Light Gray',
  'surface': 'Surface',
  'accent': 'Brand Color',
  'accent-light': 'Brand Color (Light)',
  'transparent': 'Transparent',
};

const BUTTON_TEXT_TOKEN_LABELS: Record<TextToken, string> = {
  'default': 'Auto (Smart Default)',
  'primary': 'Dark',
  'secondary': 'Medium',
  'tertiary': 'Light',
  'on-accent': 'Auto Contrast',
  'accent': 'Brand Color',
};

export function ButtonAppearanceForm({
  props,
  onUpdate,
  disabled,
}: ButtonAppearanceFormProps) {
  const blockProps = props as unknown as (CTABandBlockProps | HeroBlockProps);
  
  // Primary button appearance
  const primaryBtnAppearance = blockProps.primaryButtonAppearance || {};
  const [showPrimaryBgCustom, setShowPrimaryBgCustom] = useState(Boolean(primaryBtnAppearance.backgroundCustom));
  const [showPrimaryTextCustom, setShowPrimaryTextCustom] = useState(Boolean(primaryBtnAppearance.textCustom));
  
  // Secondary button appearance
  const secondaryBtnAppearance = blockProps.secondaryButtonAppearance || {};
  const [showSecondaryBgCustom, setShowSecondaryBgCustom] = useState(Boolean(secondaryBtnAppearance.backgroundCustom));
  const [showSecondaryTextCustom, setShowSecondaryTextCustom] = useState(Boolean(secondaryBtnAppearance.textCustom));

  const updatePrimaryButton = (updates: Partial<ButtonAppearance>) => {
    const newAppearance = { ...primaryBtnAppearance, ...updates };
    // Clean up undefined values
    if (!newAppearance.backgroundToken || newAppearance.backgroundToken === 'default') delete newAppearance.backgroundToken;
    if (!newAppearance.backgroundCustom) delete newAppearance.backgroundCustom;
    if (!newAppearance.textToken || newAppearance.textToken === 'default') delete newAppearance.textToken;
    if (!newAppearance.textCustom) delete newAppearance.textCustom;
    
    onUpdate({
      ...props,
      primaryButtonAppearance: Object.keys(newAppearance).length > 0 ? newAppearance : undefined,
    });
  };

  const updateSecondaryButton = (updates: Partial<ButtonAppearance>) => {
    const newAppearance = { ...secondaryBtnAppearance, ...updates };
    // Clean up undefined values
    if (!newAppearance.backgroundToken || newAppearance.backgroundToken === 'default') delete newAppearance.backgroundToken;
    if (!newAppearance.backgroundCustom) delete newAppearance.backgroundCustom;
    if (!newAppearance.textToken || newAppearance.textToken === 'default') delete newAppearance.textToken;
    if (!newAppearance.textCustom) delete newAppearance.textCustom;
    
    onUpdate({
      ...props,
      secondaryButtonAppearance: Object.keys(newAppearance).length > 0 ? newAppearance : undefined,
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border-primary">
      <Label className="text-sm font-medium">Button Colors</Label>
      
      {/* Primary Button */}
      <div className="space-y-3 p-3 bg-surface-secondary rounded-lg">
        <Label className="text-xs font-medium text-text-secondary">Primary Button</Label>
        
        {/* Background */}
        <div className="space-y-2">
          <Label className="text-xs">Background</Label>
          <Select
            value={primaryBtnAppearance.backgroundToken || 'default'}
            onValueChange={(value) => updatePrimaryButton({ backgroundToken: value as BackgroundToken })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              {BackgroundTokens.map((token) => (
                <SelectItem key={token} value={token} className="text-xs">
                  {BUTTON_BACKGROUND_TOKEN_LABELS[token]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch
              id="primary-btn-bg-custom"
              checked={showPrimaryBgCustom}
              onCheckedChange={(checked) => {
                setShowPrimaryBgCustom(checked);
                if (!checked) updatePrimaryButton({ backgroundCustom: undefined });
              }}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="primary-btn-bg-custom" className="text-xs text-text-tertiary">
              Custom color
            </Label>
          </div>
          
          {showPrimaryBgCustom && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                style={{ backgroundColor: primaryBtnAppearance.backgroundCustom || '#ffffff' }}
              >
                <input
                  type="color"
                  value={primaryBtnAppearance.backgroundCustom || '#ffffff'}
                  onChange={(e) => updatePrimaryButton({ backgroundCustom: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                  disabled={disabled}
                />
              </div>
              <Input
                value={primaryBtnAppearance.backgroundCustom || ''}
                onChange={(e) => updatePrimaryButton({ backgroundCustom: e.target.value || undefined })}
                className="flex-1 font-mono text-xs h-7"
                placeholder="#ffffff"
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <Label className="text-xs">Text</Label>
          <Select
            value={primaryBtnAppearance.textToken || 'default'}
            onValueChange={(value) => updatePrimaryButton({ textToken: value as TextToken })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select text color" />
            </SelectTrigger>
            <SelectContent>
              {TextTokens.map((token) => (
                <SelectItem key={token} value={token} className="text-xs">
                  {BUTTON_TEXT_TOKEN_LABELS[token]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch
              id="primary-btn-text-custom"
              checked={showPrimaryTextCustom}
              onCheckedChange={(checked) => {
                setShowPrimaryTextCustom(checked);
                if (!checked) updatePrimaryButton({ textCustom: undefined });
              }}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="primary-btn-text-custom" className="text-xs text-text-tertiary">
              Custom color
            </Label>
          </div>
          
          {showPrimaryTextCustom && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                style={{ backgroundColor: primaryBtnAppearance.textCustom || '#008080' }}
              >
                <input
                  type="color"
                  value={primaryBtnAppearance.textCustom || '#008080'}
                  onChange={(e) => updatePrimaryButton({ textCustom: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                  disabled={disabled}
                />
              </div>
              <Input
                value={primaryBtnAppearance.textCustom || ''}
                onChange={(e) => updatePrimaryButton({ textCustom: e.target.value || undefined })}
                className="flex-1 font-mono text-xs h-7"
                placeholder="#008080"
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>

      {/* Secondary Button */}
      <div className="space-y-3 p-3 bg-surface-secondary rounded-lg">
        <Label className="text-xs font-medium text-text-secondary">Secondary Button</Label>
        
        {/* Background */}
        <div className="space-y-2">
          <Label className="text-xs">Background</Label>
          <Select
            value={secondaryBtnAppearance.backgroundToken || 'default'}
            onValueChange={(value) => updateSecondaryButton({ backgroundToken: value as BackgroundToken })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              {BackgroundTokens.map((token) => (
                <SelectItem key={token} value={token} className="text-xs">
                  {BUTTON_BACKGROUND_TOKEN_LABELS[token]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch
              id="secondary-btn-bg-custom"
              checked={showSecondaryBgCustom}
              onCheckedChange={(checked) => {
                setShowSecondaryBgCustom(checked);
                if (!checked) updateSecondaryButton({ backgroundCustom: undefined });
              }}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="secondary-btn-bg-custom" className="text-xs text-text-tertiary">
              Custom color
            </Label>
          </div>
          
          {showSecondaryBgCustom && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                style={{ backgroundColor: secondaryBtnAppearance.backgroundCustom || 'transparent' }}
              >
                <input
                  type="color"
                  value={secondaryBtnAppearance.backgroundCustom || '#ffffff'}
                  onChange={(e) => updateSecondaryButton({ backgroundCustom: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                  disabled={disabled}
                />
              </div>
              <Input
                value={secondaryBtnAppearance.backgroundCustom || ''}
                onChange={(e) => updateSecondaryButton({ backgroundCustom: e.target.value || undefined })}
                className="flex-1 font-mono text-xs h-7"
                placeholder="transparent"
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <Label className="text-xs">Text / Border</Label>
          <Select
            value={secondaryBtnAppearance.textToken || 'default'}
            onValueChange={(value) => updateSecondaryButton({ textToken: value as TextToken })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select text color" />
            </SelectTrigger>
            <SelectContent>
              {TextTokens.map((token) => (
                <SelectItem key={token} value={token} className="text-xs">
                  {BUTTON_TEXT_TOKEN_LABELS[token]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch
              id="secondary-btn-text-custom"
              checked={showSecondaryTextCustom}
              onCheckedChange={(checked) => {
                setShowSecondaryTextCustom(checked);
                if (!checked) updateSecondaryButton({ textCustom: undefined });
              }}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="secondary-btn-text-custom" className="text-xs text-text-tertiary">
              Custom color
            </Label>
          </div>
          
          {showSecondaryTextCustom && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                style={{ backgroundColor: secondaryBtnAppearance.textCustom || '#ffffff' }}
              >
                <input
                  type="color"
                  value={secondaryBtnAppearance.textCustom || '#ffffff'}
                  onChange={(e) => updateSecondaryButton({ textCustom: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                  disabled={disabled}
                />
              </div>
              <Input
                value={secondaryBtnAppearance.textCustom || ''}
                onChange={(e) => updateSecondaryButton({ textCustom: e.target.value || undefined })}
                className="flex-1 font-mono text-xs h-7"
                placeholder="#ffffff"
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
