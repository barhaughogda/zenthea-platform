import { PatientSessionContext, ActorType } from "@starter/patient-scope-gate";
import { ClinicianIdentity } from "@starter/patient-portal-agent/orchestration/clinical-drafting-workflow";
import { ProviderIdentity } from "@starter/patient-portal-agent/orchestration/provider-review-workflow";

export const MOCK_PATIENT_SESSION: PatientSessionContext = {
  sessionId: "demo-session-123",
  actor: {
    id: "patient-456",
    type: ActorType.PATIENT,
    tenantId: "tenant-789",
  },
  sessionMetadata: {
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
  },
};

export const MOCK_INVALID_PATIENT_SESSION: PatientSessionContext = {
  sessionId: "invalid-session-999",
  actor: {
    id: "unauthorized-user",
    type: ActorType.PATIENT,
    tenantId: "WRONG_TENANT",
  },
  sessionMetadata: {
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
  },
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
