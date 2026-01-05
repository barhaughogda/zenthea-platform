/* eslint-disable */
import React from 'react';

export const TenantBranding = (props: any) => {
  const { tenantId, size, className } = props;
  return (
    <div className={className}>
      <span className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
        Zenthea Patient Portal
      </span>
    </div>
  );
};
