'use client';

import React, { useState } from 'react';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Input, Button } from '@starter/ui';
import {
  BackgroundTokens,
  TextTokens,
  DEFAULT_BLOCK_APPEARANCE,
  type BlockAppearance,
  type BackgroundToken,
  type TextToken,
} from '@/lib/website-builder/schema';

export interface AppearanceConfigFormProps {
  appearance: BlockAppearance | undefined;
  onUpdate: (appearance: BlockAppearance | undefined) => void;
  disabled?: boolean;
}

/**
 * Token display labels for UI
 */
const BACKGROUND_TOKEN_LABELS: Record<BackgroundToken, string> = {
  'default': 'Block Default',
  'primary': 'Light (Primary)',
  'secondary': 'Light Gray (Secondary)',
  'surface': 'Surface',
  'accent': 'Brand Color',
  'accent-light': 'Brand Color (Light)',
  'transparent': 'Transparent',
};

const TEXT_TOKEN_LABELS: Record<TextToken, string> = {
  'default': 'Block Default',
  'primary': 'Dark (Primary)',
  'secondary': 'Medium (Secondary)',
  'tertiary': 'Light (Tertiary)',
  'on-accent': 'On Brand Color (Auto)',
  'accent': 'Brand Color',
};

export function AppearanceConfigForm({
  appearance,
  onUpdate,
  disabled,
}: AppearanceConfigFormProps) {
  const [showCustomBg, setShowCustomBg] = useState(Boolean(appearance?.backgroundCustom));
  const [showCustomText, setShowCustomText] = useState(Boolean(appearance?.textCustom));

  const handleUpdate = (updates: Partial<BlockAppearance>) => {
    onUpdate({
      ...DEFAULT_BLOCK_APPEARANCE,
      ...appearance,
      ...updates,
    });
  };

  const handleBackgroundTokenChange = (value: BackgroundToken) => {
    handleUpdate({
      backgroundToken: value,
      backgroundCustom: showCustomBg ? appearance?.backgroundCustom : undefined,
    });
  };

  const handleTextTokenChange = (value: TextToken) => {
    handleUpdate({
      textToken: value,
      textCustom: showCustomText ? appearance?.textCustom : undefined,
    });
  };

  const handleCustomBgChange = (value: string) => {
    handleUpdate({
      backgroundCustom: value || undefined,
    });
  };

  const handleCustomTextChange = (value: string) => {
    handleUpdate({
      textCustom: value || undefined,
    });
  };

  const handleResetAppearance = () => {
    onUpdate(undefined);
    setShowCustomBg(false);
    setShowCustomText(false);
  };

  const hasCustomizations = 
    (appearance?.backgroundToken && appearance.backgroundToken !== 'default') ||
    (appearance?.textToken && appearance.textToken !== 'default') ||
    appearance?.backgroundCustom ||
    appearance?.textCustom ||
    (appearance?.paddingTop && appearance.paddingTop !== DEFAULT_BLOCK_APPEARANCE.paddingTop) ||
    (appearance?.paddingBottom && appearance.paddingBottom !== DEFAULT_BLOCK_APPEARANCE.paddingBottom) ||
    (appearance?.maxWidth && appearance.maxWidth !== DEFAULT_BLOCK_APPEARANCE.maxWidth) ||
    appearance?.borderTop ||
    appearance?.borderBottom;

  return (
    <div className="space-y-6">
      {/* Background Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Background</Label>
        
        <Select
          value={appearance?.backgroundToken || 'default'}
          onValueChange={(value) => handleBackgroundTokenChange(value as BackgroundToken)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            {BackgroundTokens.map((token) => (
              <SelectItem key={token} value={token}>
                {BACKGROUND_TOKEN_LABELS[token]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Background Color */}
        <div className="flex items-center gap-2">
          <Switch
            id="custom-bg"
            checked={showCustomBg}
            onCheckedChange={(checked) => {
              setShowCustomBg(checked);
              if (!checked) {
                handleCustomBgChange('');
              }
            }}
            disabled={disabled}
          />
          <Label htmlFor="custom-bg" className="text-xs text-text-secondary">
            Custom color override
          </Label>
        </div>

        {showCustomBg && (
          <div className="flex items-center gap-2 pl-1">
            <div
              className="w-8 h-8 rounded border border-border-primary overflow-hidden flex-shrink-0"
              style={{ backgroundColor: appearance?.backgroundCustom || '#ffffff' }}
            >
              <input
                type="color"
                value={appearance?.backgroundCustom || '#ffffff'}
                onChange={(e) => handleCustomBgChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
                disabled={disabled}
                aria-label="Custom background color"
              />
            </div>
            <Input
              value={appearance?.backgroundCustom || ''}
              onChange={(e) => handleCustomBgChange(e.target.value)}
              className="flex-1 font-mono text-xs h-8"
              placeholder="#ffffff"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Text Color Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Text Color</Label>
        
        <Select
          value={appearance?.textToken || 'default'}
          onValueChange={(value) => handleTextTokenChange(value as TextToken)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select text color" />
          </SelectTrigger>
          <SelectContent>
            {TextTokens.map((token) => (
              <SelectItem key={token} value={token}>
                {TEXT_TOKEN_LABELS[token]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Text Color */}
        <div className="flex items-center gap-2">
          <Switch
            id="custom-text"
            checked={showCustomText}
            onCheckedChange={(checked) => {
              setShowCustomText(checked);
              if (!checked) {
                handleCustomTextChange('');
              }
            }}
            disabled={disabled}
          />
          <Label htmlFor="custom-text" className="text-xs text-text-secondary">
            Custom color override
          </Label>
        </div>

        {showCustomText && (
          <div className="flex items-center gap-2 pl-1">
            <div
              className="w-8 h-8 rounded border border-border-primary overflow-hidden flex-shrink-0"
              style={{ backgroundColor: appearance?.textCustom || '#1a1a1a' }}
            >
              <input
                type="color"
                value={appearance?.textCustom || '#1a1a1a'}
                onChange={(e) => handleCustomTextChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
                disabled={disabled}
                aria-label="Custom text color"
              />
            </div>
            <Input
              value={appearance?.textCustom || ''}
              onChange={(e) => handleCustomTextChange(e.target.value)}
              className="flex-1 font-mono text-xs h-8"
              placeholder="#1a1a1a"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Layout Section */}
      <div className="space-y-4 pt-4 border-t border-border-primary">
        <Label className="text-sm font-medium">Layout & Spacing</Label>

        {/* Max Width */}
        <div className="space-y-2">
          <Label className="text-xs text-text-secondary">Maximum Content Width</Label>
          <Select
            value={appearance?.maxWidth || 'normal'}
            onValueChange={(value) => handleUpdate({ maxWidth: value as BlockAppearance['maxWidth'] })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="narrow">Narrow</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="wide">Wide</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Padding */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Top Padding</Label>
            <Select
              value={appearance?.paddingTop || 'medium'}
              onValueChange={(value) => handleUpdate({ paddingTop: value as BlockAppearance['paddingTop'] })}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Bottom Padding</Label>
            <Select
              value={appearance?.paddingBottom || 'medium'}
              onValueChange={(value) => handleUpdate({ paddingBottom: value as BlockAppearance['paddingBottom'] })}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Borders */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="border-top"
              checked={appearance?.borderTop || false}
              onCheckedChange={(checked) => handleUpdate({ borderTop: checked })}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="border-top" className="text-xs text-text-secondary">
              Top Border
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="border-bottom"
              checked={appearance?.borderBottom || false}
              onCheckedChange={(checked) => handleUpdate({ borderBottom: checked })}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="border-bottom" className="text-xs text-text-secondary">
              Bottom Border
            </Label>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {hasCustomizations && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAppearance}
          disabled={disabled}
          className="w-full text-xs text-text-secondary hover:text-text-primary mt-2"
        >
          Reset to Block Defaults
        </Button>
      )}
    </div>
  );
}
