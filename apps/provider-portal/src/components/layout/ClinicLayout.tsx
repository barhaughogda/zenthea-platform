/* eslint-disable */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export function ClinicLayout({ children, ...props }: any) {
  return <div className="clinic-layout-stub" data-props={JSON.stringify(Object.keys(props))}>{children}</div>;
}
