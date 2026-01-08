import React from 'react';

export function ClinicLayout({ children, ...props }: any) {
  return <div className="clinic-layout-stub" data-props={JSON.stringify(Object.keys(props))}>{children}</div>;
}
