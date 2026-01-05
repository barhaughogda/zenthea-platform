/**
 * Feature flags for the Patient Portal application
 */
export const FEATURES = {
  // Migration Phase Slice 02B - Step 4.1: Consent Agent Integration
  // Default to false (mock-enabled) to ensure reversibility
  USE_REAL_CONSENT_AGENT: process.env.NEXT_PUBLIC_USE_REAL_CONSENT_AGENT === 'true' || false,

  // Migration Phase Slice 02B - Step 4.2: Appointment Booking Agent Integration
  // Default to false (mock-enabled) to ensure reversibility
  USE_REAL_APPOINTMENT_BOOKING_AGENT: process.env.NEXT_PUBLIC_USE_REAL_APPOINTMENT_BOOKING_AGENT === 'true' || false,

  // Migration Phase Slice 02B - Step 4.3: Messaging / Chat Agent Integration
  // Default to false (mock-enabled) to ensure reversibility
  USE_REAL_CHAT_AGENT: process.env.NEXT_PUBLIC_USE_REAL_CHAT_AGENT === 'true' || false,

  // Migration Phase Slice 02B - Step 4.4: Medical Advisor Agent Integration
  // Default to false (mock-enabled) to ensure reversibility
  USE_REAL_MEDICAL_ADVISOR_AGENT: process.env.NEXT_PUBLIC_USE_REAL_MEDICAL_ADVISOR_AGENT === 'true' || false,

  // Migration Phase Slice 02B - Step 5.1: Controlled Consent Write Enablement
  // Kill switch for all consent write operations. Default to false for safety.
  USE_CONSENT_WRITES: process.env.NEXT_PUBLIC_USE_CONSENT_WRITES === 'true' || false,

  // Migration Phase Slice 02B - Step 5.2: Controlled Messaging Write Enablement
  // Kill switch for all messaging write operations. Default to false for safety.
  USE_CHAT_WRITES: process.env.NEXT_PUBLIC_USE_CHAT_WRITES === 'true' || false,

  // Migration Phase Slice 02B - Step 5.3: Controlled Appointment Write Enablement
  // Kill switch for all appointment write operations. Default to false for safety.
  USE_APPOINTMENT_WRITES: process.env.NEXT_PUBLIC_USE_APPOINTMENT_WRITES === 'true' || false,
};

export type FeatureKey = keyof typeof FEATURES;

declare global {
  interface Window {
    ZENTHEA_FEATURES_OVERRIDE?: Partial<Record<string, boolean>>;
  }
}

/**
 * Hook to check if a feature is enabled
 */
export const useFeatureFlag = (key: FeatureKey): boolean => {
  // Allow runtime overrides for emergency disabling without redeploy
  if (typeof window !== 'undefined' && window.ZENTHEA_FEATURES_OVERRIDE?.[key] !== undefined) {
    const override = window.ZENTHEA_FEATURES_OVERRIDE[key];
    if (typeof override === 'boolean') {
      return override;
    }
  }
  return FEATURES[key];
};
