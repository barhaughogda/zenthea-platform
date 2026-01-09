'use client';

import React from 'react';
import { Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@starter/ui';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function ServicesConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={(props.title as string) || ''}
          onChange={(e) => onUpdate({ ...props, title: e.target.value })}
          placeholder="Our Services"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea
          value={(props.subtitle as string) || ''}
          onChange={(e) => onUpdate({ ...props, subtitle: e.target.value })}
          placeholder="Comprehensive healthcare services"
          rows={2}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={(props.layout as string) || 'grid'}
          onValueChange={(value) => onUpdate({ ...props, layout: value })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="cards">Cards</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Columns</Label>
        <Select
          value={String((props.columns as number) || 3)}
          onValueChange={(value) => onUpdate({ ...props, columns: parseInt(value) })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-duration">Show Duration</Label>
        <Switch
          id="show-duration"
          checked={(props.showDuration as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ ...props, showDuration: checked })}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-price">Show Price</Label>
        <Switch
          id="show-price"
          checked={(props.showPrice as boolean) ?? false}
          onCheckedChange={(checked) => onUpdate({ ...props, showPrice: checked })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
