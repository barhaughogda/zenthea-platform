'use client';

import React from 'react';
import { CustomTextBlockFormFields } from '@/components/website-blocks/editors/CustomTextBlockFormFields';
import type { ConfigFormProps } from '../hero/HeroConfigForm';

export function CustomTextConfigForm({ props, onUpdate, disabled }: ConfigFormProps) {
  return (
    <CustomTextBlockFormFields
      props={props}
      onUpdate={onUpdate}
      disabled={disabled}
      isSidebar={true}
    />
  );
}
