import { useMemo } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { ConsentAgentAdapter, MockConsentAdapter } from '@/lib/consent/adapter';
import { ConsentService } from '@/lib/contracts/consent';

/**
 * Hook to access the Consent Service.
 * Automatically switches between the real Consent Agent and the mock based on feature flags.
 */
export function useConsents() {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_CONSENT_AGENT');
  const enableWrites = useFeatureFlag('USE_CONSENT_WRITES');

  const consentService = useMemo<ConsentService>(() => {
    if (useRealAgent) {
      return new ConsentAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_CONSENT_AGENT_URL || 'http://localhost:3001',
        enableWrites,
        // In a real app, we would pass a token getter
        // getToken: async () => session?.user?.accessToken || '',
      });
    }
    return new MockConsentAdapter();
  }, [useRealAgent, enableWrites]);

  return {
    consentService,
    patientId: session?.user?.id,
  };
}
