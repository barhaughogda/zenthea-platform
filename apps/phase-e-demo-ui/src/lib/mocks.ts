import { PatientSessionContext, ActorType } from "@starter/patient-scope-gate";
import { ClinicianIdentity } from "@starter/patient-portal-agent/orchestration/clinical-drafting-workflow";
import { ProviderIdentity } from "@starter/patient-portal-agent/orchestration/provider-review-workflow";

export const MOCK_PATIENT_SESSION: PatientSessionContext = {
  sessionId: "demo-session-123",
  patientId: "patient-456",
  actor: {
    id: "patient-456",
    type: ActorType.PATIENT,
    tenantId: "tenant-789",
  },
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  scope: ["read", "write"],
};

export const MOCK_CLINICIAN: ClinicianIdentity = {
  id: "clinician-101",
  type: ActorType.CLINICIAN,
  tenantId: "tenant-789",
  role: "CLINICIAN",
};

export const MOCK_PROVIDER: ProviderIdentity = {
  id: "provider-202",
  type: ActorType.CLINICIAN,
  tenantId: "tenant-789",
  role: "CLINICIAN",
};
