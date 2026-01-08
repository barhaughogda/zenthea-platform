/* eslint-disable */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const ZentheaThemeProvider = ({ children }: any) => <>{children}</>;
export const useTheme = () => ({ theme: 'light', setTheme: (t: string) => {} });
