/**
 * Feature flags for the Patient Portal application
 */
export const FEATURES = {
  // Migration Phase Slice 02B - Step 4.1: Consent Agent Integration
  // Default to false (mock-enabled) to ensure reversibility
  USE_REAL_CONSENT_AGENT: process.env.NEXT_PUBLIC_USE_REAL_CONSENT_AGENT === 'true' || false,
};

export type FeatureKey = keyof typeof FEATURES;

/**
 * Hook to check if a feature is enabled
 */
export const useFeatureFlag = (key: FeatureKey): boolean => {
  return FEATURES[key];
};
