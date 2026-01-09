'use client';

import React, { useState } from 'react';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Input } from '@starter/ui';
import { Slider } from '@/components/ui/slider';
import {
  TextTokens,
  DEFAULT_BLOCK_APPEARANCE,
  type BlockAppearance,
  type TextToken,
} from '@/lib/website-builder/schema';
import { ColorPicker } from '../shared/ColorPicker';
import { ImageUpload } from '../../ImageUpload';

export interface HeroBackgroundConfigFormProps {
  props: Record<string, unknown>;
  onUpdate: (props: Record<string, unknown>) => void;
  disabled?: boolean;
}

/**
 * Text token labels for Hero text styling
 */
const HERO_TEXT_TOKEN_LABELS: Record<TextToken, string> = {
  'default': 'Auto (Smart Default)',
  'primary': 'Dark',
  'secondary': 'Medium',
  'tertiary': 'Light',
  'on-accent': 'White (High Contrast)',
  'accent': 'Brand Color',
};

/**
 * Consolidated background configuration for Hero blocks.
 * Supports gradient, solid color, and image backgrounds in one unified control.
 * Also includes text color controls for heading and tagline.
 */
export function HeroBackgroundConfigForm({
  props,
  onUpdate,
  disabled,
  appearance,
  onAppearanceUpdate,
}: HeroBackgroundConfigFormProps & { 
  appearance?: BlockAppearance; 
  onAppearanceUpdate?: (appearance: BlockAppearance | undefined) => void 
}) {
  const backgroundType = (props.backgroundType as string) || 'gradient';
  
  // Text appearance state
  const headingAppearance = (props.headingTextAppearance as { textToken?: string; textCustom?: string }) || {};
  const taglineAppearance = (props.taglineTextAppearance as { textToken?: string; textCustom?: string }) || {};
  
  const [showHeadingCustom, setShowHeadingCustom] = useState(Boolean(headingAppearance.textCustom));
  const [showTaglineCustom, setShowTaglineCustom] = useState(Boolean(taglineAppearance.textCustom));
  
  const updateHeadingText = (updates: { textToken?: string; textCustom?: string }) => {
    const newAppearance = { ...headingAppearance, ...updates };
    // Clean up undefined values
    if (!newAppearance.textToken || newAppearance.textToken === 'default') delete newAppearance.textToken;
    if (!newAppearance.textCustom) delete newAppearance.textCustom;
    
    onUpdate({
      ...props,
      headingTextAppearance: Object.keys(newAppearance).length > 0 ? newAppearance : undefined,
    });
  };
  
  const updateTaglineText = (updates: { textToken?: string; textCustom?: string }) => {
    const newAppearance = { ...taglineAppearance, ...updates };
    // Clean up undefined values
    if (!newAppearance.textToken || newAppearance.textToken === 'default') delete newAppearance.textToken;
    if (!newAppearance.textCustom) delete newAppearance.textCustom;
    
    onUpdate({
      ...props,
      taglineTextAppearance: Object.keys(newAppearance).length > 0 ? newAppearance : undefined,
    });
  };

  const handleLayoutUpdate = (updates: Partial<BlockAppearance>) => {
    if (onAppearanceUpdate) {
      onAppearanceUpdate({
        ...DEFAULT_BLOCK_APPEARANCE,
        ...appearance,
        ...updates,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Background</Label>
        </div>
        
        {/* Background Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-text-secondary">Type</Label>
          <Select
            value={backgroundType}
            onValueChange={(value) => onUpdate({ ...props, backgroundType: value })}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="solid">Solid Color</SelectItem>
              <SelectItem value="image">Background Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gradient Controls */}
        {backgroundType === 'gradient' && (
          <div className="space-y-4 p-3 bg-surface-secondary rounded-lg">
            <ColorPicker
              label="Start Color"
              value={(props.gradientFrom as string) || 'var(--zenthea-teal)'}
              onChange={(value) => onUpdate({ ...props, gradientFrom: value })}
              disabled={disabled}
            />
            <ColorPicker
              label="End Color"
              value={(props.gradientTo as string) || 'var(--zenthea-purple)'}
              onChange={(value) => onUpdate({ ...props, gradientTo: value })}
              disabled={disabled}
            />
            <div className="space-y-2">
              <Label className="text-xs text-text-secondary">Direction</Label>
              <Select
                value={(props.gradientDirection as string) || 'to-br'}
                onValueChange={(value) => onUpdate({ ...props, gradientDirection: value })}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-r">→ Right</SelectItem>
                  <SelectItem value="to-l">← Left</SelectItem>
                  <SelectItem value="to-t">↑ Up</SelectItem>
                  <SelectItem value="to-b">↓ Down</SelectItem>
                  <SelectItem value="to-tr">↗ Top Right</SelectItem>
                  <SelectItem value="to-tl">↖ Top Left</SelectItem>
                  <SelectItem value="to-br">↘ Bottom Right</SelectItem>
                  <SelectItem value="to-bl">↙ Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Solid Color Controls */}
        {backgroundType === 'solid' && (
          <div className="p-3 bg-surface-secondary rounded-lg">
            <ColorPicker
              label="Background Color"
              value={(props.backgroundColor as string) || 'var(--zenthea-teal)'}
              onChange={(value) => onUpdate({ ...props, backgroundColor: value })}
              disabled={disabled}
            />
          </div>
        )}

        {/* Image Controls */}
        {backgroundType === 'image' && (
          <div className="space-y-4 p-3 bg-surface-secondary rounded-lg">
            <div className="space-y-2">
              <Label className="text-xs text-text-secondary">Background Image</Label>
              <ImageUpload
                value={(props.backgroundImage as string) || ''}
                onChange={(url) => onUpdate({ ...props, backgroundImage: url })}
                disabled={disabled}
                aspectRatio="landscape"
                maxSize={10}
                imageType="hero"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-text-secondary">
                Overlay Darkness: {Math.round(((props.backgroundOverlay as number) || 0.4) * 100)}%
              </Label>
              <Slider
                value={[((props.backgroundOverlay as number) || 0.4) * 100]}
                onValueChange={(values) => {
                  const val = values[0];
                  if (val !== undefined) {
                    onUpdate({ ...props, backgroundOverlay: val / 100 });
                  }
                }}
                min={0}
                max={80}
                step={5}
                disabled={disabled}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary">
                Darkens the image to improve text readability
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Layout & Spacing Section */}
      <div className="space-y-4 pt-4 border-t border-border-primary">
        <Label className="text-sm font-medium">Layout & Spacing</Label>

        {/* Padding */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Top Padding</Label>
            <Select
              value={appearance?.paddingTop || 'medium'}
              onValueChange={(value) => handleLayoutUpdate({ paddingTop: value as BlockAppearance['paddingTop'] })}
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
              onValueChange={(value) => handleLayoutUpdate({ paddingBottom: value as BlockAppearance['paddingBottom'] })}
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
              id="hero-border-top"
              checked={appearance?.borderTop || false}
              onCheckedChange={(checked) => handleLayoutUpdate({ borderTop: checked })}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="hero-border-top" className="text-xs text-text-secondary">
              Top Border
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="hero-border-bottom"
              checked={appearance?.borderBottom || false}
              onCheckedChange={(checked) => handleLayoutUpdate({ borderBottom: checked })}
              disabled={disabled}
              className="scale-75"
            />
            <Label htmlFor="hero-border-bottom" className="text-xs text-text-secondary">
              Bottom Border
            </Label>
          </div>
        </div>
      </div>

      {/* Text Colors Section */}
      <div className="space-y-4 pt-4 border-t border-border-primary">
        <Label className="text-sm font-medium">Text Colors</Label>
        
        {/* Heading Text Color */}
        <div className="space-y-3 p-3 bg-surface-secondary rounded-lg">
          <Label className="text-xs font-medium text-text-secondary">Heading</Label>
          
          <div className="space-y-2">
            <Label className="text-xs">Color</Label>
            <Select
              value={headingAppearance.textToken || 'default'}
              onValueChange={(value) => updateHeadingText({ textToken: value as TextToken })}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {TextTokens.map((token) => (
                  <SelectItem key={token} value={token} className="text-xs">
                    {HERO_TEXT_TOKEN_LABELS[token]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Switch
                id="heading-text-custom"
                checked={showHeadingCustom}
                onCheckedChange={(checked) => {
                  setShowHeadingCustom(checked);
                  if (!checked) updateHeadingText({ textCustom: undefined });
                }}
                disabled={disabled}
                className="scale-75"
              />
              <Label htmlFor="heading-text-custom" className="text-xs text-text-tertiary">
                Custom color
              </Label>
            </div>
            
            {showHeadingCustom && (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: headingAppearance.textCustom || '#ffffff' }}
                >
                  <input
                    type="color"
                    value={headingAppearance.textCustom || '#ffffff'}
                    onChange={(e) => updateHeadingText({ textCustom: e.target.value })}
                    className="w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                  />
                </div>
                <Input
                  value={headingAppearance.textCustom || ''}
                  onChange={(e) => updateHeadingText({ textCustom: e.target.value || undefined })}
                  className="flex-1 font-mono text-xs h-7"
                  placeholder="#ffffff"
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Tagline Text Color */}
        <div className="space-y-3 p-3 bg-surface-secondary rounded-lg">
          <Label className="text-xs font-medium text-text-secondary">Tagline</Label>
          
          <div className="space-y-2">
            <Label className="text-xs">Color</Label>
            <Select
              value={taglineAppearance.textToken || 'default'}
              onValueChange={(value) => updateTaglineText({ textToken: value as TextToken })}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {TextTokens.map((token) => (
                  <SelectItem key={token} value={token} className="text-xs">
                    {HERO_TEXT_TOKEN_LABELS[token]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Switch
                id="tagline-text-custom"
                checked={showTaglineCustom}
                onCheckedChange={(checked) => {
                  setShowTaglineCustom(checked);
                  if (!checked) updateTaglineText({ textCustom: undefined });
                }}
                disabled={disabled}
                className="scale-75"
              />
              <Label htmlFor="tagline-text-custom" className="text-xs text-text-tertiary">
                Custom color
              </Label>
            </div>
            
            {showTaglineCustom && (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-border-primary overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: taglineAppearance.textCustom || '#ffffff' }}
                >
                  <input
                    type="color"
                    value={taglineAppearance.textCustom || '#ffffff'}
                    onChange={(e) => updateTaglineText({ textCustom: e.target.value })}
                    className="w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                  />
                </div>
                <Input
                  value={taglineAppearance.textCustom || ''}
                  onChange={(e) => updateTaglineText({ textCustom: e.target.value || undefined })}
                  className="flex-1 font-mono text-xs h-7"
                  placeholder="#ffffff"
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
