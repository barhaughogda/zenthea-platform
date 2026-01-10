import { useMemo, useState, useEffect } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { MedicalAdvisorAgentAdapter, MockMedicalAdvisorAdapter } from '@/lib/medical-advisor/adapter';
import { MedicalAdvisorService, MedicalAdvisory } from '@/lib/contracts/medical-advisor';
import { ControlPlaneContext } from '@starter/service-control-adapter';

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

  // CP-21: Derive Governance Context from Session
  const ctx = useMemo<ControlPlaneContext | null>(() => {
    if (!session?.user?.id) return null;
    return {
      traceId: crypto.randomUUID(),
      actorId: session.user.id,
      policyVersion: '1.0.0',
    };
  }, [session]);

  const medicalAdvisorService = useMemo<MedicalAdvisorService>(() => {
    if (useRealAgent && ctx) {
      return new MedicalAdvisorAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_MEDICAL_ADVISOR_AGENT_URL || 'http://localhost:3004',
        ctx,
      });
    }
    return new MockMedicalAdvisorAdapter();
  }, [useRealAgent, ctx]);

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
