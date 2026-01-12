"use server";

import { executeSchedulingProposal } from "@starter/patient-portal-agent/orchestration";
import { MOCK_PATIENT_SESSION } from "@/lib/mocks";

export async function generateSchedulingProposal(formData: FormData) {
  const intent = formData.get("intent") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const appointmentType = formData.get("appointmentType") as string;
  const reason = formData.get("reason") as string;

  if (!intent) {
    throw new Error("Intent is required");
  }

  const result = await executeSchedulingProposal(MOCK_PATIENT_SESSION, {
    intent,
    preferredTime: preferredTime || undefined,
    appointmentType: appointmentType || undefined,
    reason: reason || undefined,
  });

  return result;
}
