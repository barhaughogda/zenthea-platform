import React from 'react';
export const ZentheaThemeProvider = ({ children }: any) => <>{children}</>;
export const useTheme = () => ({ theme: 'light', setTheme: (t: string) => {} });
