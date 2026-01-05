/* eslint-disable */
import React from 'react';

export const Progress = ({ value, className }: any) => {
  return (
    <div className={`h-2 w-full bg-secondary ${className}`}>
      <div 
        className="h-full bg-primary transition-all" 
        style={{ width: `${value || 0}%` }}
      />
    </div>
  );
};
