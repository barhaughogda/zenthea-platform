/* eslint-disable */
import React from 'react';

export const Checkbox = ({ checked, onCheckedChange, className }: any) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className={className} />
);
