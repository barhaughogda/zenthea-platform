import { useMemo } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { ConsentAgentAdapter, MockConsentAdapter } from '@/lib/consent/adapter';
import { ConsentService } from '@/lib/contracts/consent';
import { ControlPlaneContext } from '@starter/service-control-adapter';

/**
 * Hook to access the Consent Service.
 * Automatically switches between the real Consent Agent and the mock based on feature flags.
 */
export function useConsents() {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_CONSENT_AGENT');
  const enableWrites = useFeatureFlag('USE_CONSENT_WRITES');

  // CP-21: Derive Governance Context from Session
  const ctx = useMemo<ControlPlaneContext | null>(() => {
    if (!session?.user?.id) return null;
    return {
      traceId: crypto.randomUUID(),
      actorId: session.user.id,
      policyVersion: '1.0.0',
    };
  }, [session]);

  const consentService = useMemo<ConsentService>(() => {
    if (useRealAgent && ctx) {
      return new ConsentAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_CONSENT_AGENT_URL || 'http://localhost:3001',
        enableWrites,
        ctx,
        // In a real app, we would pass a token getter
        // getToken: async () => session?.user?.accessToken || '',
      });
    }
    return new MockConsentAdapter();
  }, [useRealAgent, enableWrites, ctx]);

  return {
    consentService,
    patientId: session?.user?.id,
  };
}
