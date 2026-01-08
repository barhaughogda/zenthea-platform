import React from 'react';
export const ProviderPreferencesProvider = ({ children }: any) => <>{children}</>;
export const formatDate = (...args: any[]) => "";
export const formatTime = (...args: any[]) => "";
export const DATETIME_PREFERENCES_KEYS = {
  DATE_FORMAT: 'DATE_FORMAT',
  TIME_FORMAT: 'TIME_FORMAT',
  TIMEZONE: 'TIMEZONE',
  LANGUAGE: 'LANGUAGE'
};
export const TIME_FORMAT_OPTIONS = [];
export const DATE_FORMAT_OPTIONS = [];
export type TimeFormat = any;
export type DateFormat = any;
