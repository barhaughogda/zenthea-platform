import { useMemo, useState, useEffect } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { MedicalAdvisorAgentAdapter, MockMedicalAdvisorAdapter } from '@/lib/medical-advisor/adapter';
import { MedicalAdvisorService, MedicalAdvisory } from '@/lib/contracts/medical-advisor';

/**
 * Hook to access the Medical Advisor Service.
 * Automatically switches between the real Medical Advisor Agent and the mock based on feature flags.
 * 
 * Safety Guardrail: 
 * - Output is displayed as NON-AUTHORITATIVE guidance.
 * - READ-ONLY access.
 */
export function useMedicalAdvisor() {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_MEDICAL_ADVISOR_AGENT');
  const patientId = session?.user?.id || 'mock-patient-id';

  const [advisory, setAdvisory] = useState<MedicalAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const medicalAdvisorService = useMemo<MedicalAdvisorService>(() => {
    if (useRealAgent) {
      return new MedicalAdvisorAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_MEDICAL_ADVISOR_AGENT_URL || 'http://localhost:3004',
      });
    }
    return new MockMedicalAdvisorAdapter();
  }, [useRealAgent]);

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      medicalAdvisorService.getAdvisory(patientId)
        .then(data => {
          setAdvisory(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('[useMedicalAdvisor] Error fetching advisory:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch clinical advisory');
          setIsLoading(false);
        });
    }
  }, [medicalAdvisorService, patientId]);

  return {
    advisory,
    isLoading,
    error,
    isMock: !useRealAgent,
  };
}
