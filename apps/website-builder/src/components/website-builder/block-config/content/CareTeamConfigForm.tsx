'use client';

import React from 'react';
import { Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@starter/ui';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function CareTeamConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={(props.title as string) || ''}
          onChange={(e) => onUpdate({ ...props, title: e.target.value })}
          placeholder="Meet Our Care Team"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea
          value={(props.subtitle as string) || ''}
          onChange={(e) => onUpdate({ ...props, subtitle: e.target.value })}
          placeholder="Experienced healthcare professionals"
          rows={2}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Providers</Label>
        <Select
          value={String((props.displayCount as number) || 4)}
          onValueChange={(value) => onUpdate({ ...props, displayCount: parseInt(value) })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="8">8</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-credentials">Show Credentials</Label>
        <Switch
          id="show-credentials"
          checked={(props.showCredentials as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showCredentials: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-specialties">Show Specialties</Label>
        <Switch
          id="show-specialties"
          checked={(props.showSpecialties as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showSpecialties: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-photo">Show Photos</Label>
        <Switch
          id="show-photo"
          checked={(props.showPhoto as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showPhoto: checked })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
