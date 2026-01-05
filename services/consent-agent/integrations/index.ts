/**
 * Integrations Layer for Consent Agent
 * 
 * Responsibilities:
 * - Wrap vendor APIs and external systems
 * - Enforce vendor eligibility and policy-awareness
 * 
 * Rules:
 * - No vendor SDKs outside this layer.
 * - Integrations must be replaceable.
 * 
 * TODO: Based on docs/05-services/consent-agent.md
 * - Currently, no external integrations are required for the base agent.
 */

export interface ExternalConsentProvider {
  /**
   * Placeholder for external consent synchronization (e.g., with a national registry).
   */
  syncConsent(patientId: string): Promise<void>;
}
