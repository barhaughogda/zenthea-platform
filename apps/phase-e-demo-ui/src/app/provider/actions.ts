"use server";

import { executeProviderReview } from "@starter/patient-portal-agent/orchestration";
import { ProviderReviewOutcome } from "@starter/patient-portal-agent/orchestration/provider-review-workflow";
import { MOCK_PATIENT_SESSION, MOCK_PROVIDER } from "@/lib/mocks";

export async function submitProviderDecision(
  proposalId: string,
  outcome: ProviderReviewOutcome,
  reasonCode?: string
) {
  const result = await executeProviderReview(MOCK_PATIENT_SESSION, MOCK_PROVIDER, {
    proposalId,
    outcome,
    reasonCode,
  });

  return result;
}
