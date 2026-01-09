'use client';

import React from 'react';
import { Label, Input, Textarea } from '@starter/ui';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function CTABandConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
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
            placeholder="Ready to Get Started?"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Tagline</Label>
          <Textarea
            value={(props.subheadline as string) || ''}
            onChange={(e) => onUpdate({ ...props, subheadline: e.target.value || undefined })}
            placeholder="Book your appointment today"
            rows={2}
            disabled={disabled}
          />
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
            placeholder="Book Now"
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
      <div className="space-y-4 pb-4 border-b border-border-primary">
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
              placeholder="#contact"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Note: Background is now controlled via Appearance section */}
    </div>
  );
}
