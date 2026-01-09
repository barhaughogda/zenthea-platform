'use client';

import React from 'react';
import { Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@starter/ui';

export interface ConfigFormProps {
  props: Record<string, unknown>;
  onUpdate: (props: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function HeroConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <div className="space-y-4 pb-4 border-b border-border-primary">
        <h4 className="font-medium text-text-primary">Content</h4>
        
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={(props.headline as string) || ''}
            onChange={(e) => onUpdate({ ...props, headline: e.target.value })}
            placeholder="Welcome to Our Clinic"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Tagline</Label>
          <Textarea
            value={(props.tagline as string) || ''}
            onChange={(e) => onUpdate({ ...props, tagline: e.target.value })}
            placeholder="Quality healthcare for you and your family"
            rows={2}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <Select
            value={(props.alignment as string) || 'center'}
            onValueChange={(value) => onUpdate({ ...props, alignment: value })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Primary Button Section */}
      <div className="space-y-4 pb-4 border-b border-border-primary">
        <h4 className="font-medium text-text-primary">Primary Button</h4>
        
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={(props.primaryCtaText as string) || ''}
            onChange={(e) => onUpdate({ ...props, primaryCtaText: e.target.value })}
            placeholder="Book Appointment"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input
            value={(props.primaryCtaLink as string) || ''}
            onChange={(e) => onUpdate({ ...props, primaryCtaLink: e.target.value || undefined })}
            placeholder="/book"
            disabled={disabled}
          />
          <p className="text-xs text-text-tertiary">
            Leave empty to use your default booking page
          </p>
        </div>
      </div>

      {/* Secondary Button Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Secondary Button</h4>
        
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={(props.secondaryCtaText as string) || ''}
            onChange={(e) => onUpdate({ ...props, secondaryCtaText: e.target.value || undefined })}
            placeholder="Learn More"
            disabled={disabled}
          />
          <p className="text-xs text-text-tertiary">
            Leave empty to hide the secondary button
          </p>
        </div>

        {(props.secondaryCtaText as string) && (
          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={(props.secondaryCtaLink as string) || ''}
              onChange={(e) => onUpdate({ ...props, secondaryCtaLink: e.target.value || undefined })}
              placeholder="#services"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Note: Background is now controlled via Appearance section */}
    </div>
  );
}
