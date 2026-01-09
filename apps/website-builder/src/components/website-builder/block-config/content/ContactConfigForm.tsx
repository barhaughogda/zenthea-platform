'use client';

import React from 'react';
import { Label, Input, Textarea, Switch } from '@starter/ui';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function ContactConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={(props.title as string) || ''}
          onChange={(e) => onUpdate({ ...props, title: e.target.value })}
          placeholder="Contact Us"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea
          value={(props.subtitle as string) || ''}
          onChange={(e) => onUpdate({ ...props, subtitle: e.target.value })}
          placeholder="We're here to help"
          rows={2}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-map">Show Map</Label>
        <Switch
          id="show-map"
          checked={(props.showMap as boolean) ?? false}
          onCheckedChange={(checked) => onUpdate({ ...props, showMap: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-hours">Show Hours</Label>
        <Switch
          id="show-hours"
          checked={(props.showHours as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showHours: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-phone">Show Phone</Label>
        <Switch
          id="show-phone"
          checked={(props.showPhone as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showPhone: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-email">Show Email</Label>
        <Switch
          id="show-email"
          checked={(props.showEmail as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showEmail: checked })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
