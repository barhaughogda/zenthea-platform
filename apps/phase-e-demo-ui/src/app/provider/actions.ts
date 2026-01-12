"use server";

import { executeProviderReview } from "@starter/patient-portal-agent/orchestration";
import { ProviderReviewOutcome } from "@starter/patient-portal-agent/orchestration/provider-review-workflow";
import { MOCK_PATIENT_SESSION, MOCK_INVALID_PATIENT_SESSION, MOCK_PROVIDER } from "@/lib/mocks";

export async function submitProviderDecision(
  proposalId: string,
  outcome: ProviderReviewOutcome,
  reasonCode?: string,
  useInvalidSession: boolean = false
) {
  const session = useInvalidSession ? MOCK_INVALID_PATIENT_SESSION : MOCK_PATIENT_SESSION;

  const result = await executeProviderReview(session, MOCK_PROVIDER, {
    proposalId,
    outcome,
    reasonCode,
  });

  return result;
}
