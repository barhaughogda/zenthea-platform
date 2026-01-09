'use client';

import React from 'react';
import { Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@starter/ui';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function GenericConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <div className="space-y-4">
      {props.title !== undefined && (
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={(props.title as string) || ''}
            onChange={(e) => onUpdate({ ...props, title: e.target.value })}
            disabled={disabled}
          />
        </div>
      )}

      {props.subtitle !== undefined && (
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={(props.subtitle as string) || ''}
            onChange={(e) => onUpdate({ ...props, subtitle: e.target.value })}
            rows={2}
            disabled={disabled}
          />
        </div>
      )}

      {props.layout !== undefined && (
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
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
