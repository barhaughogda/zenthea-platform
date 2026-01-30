/**
 * Encounter Transport Types - Slice 01
 */

export const HEADER_KEYS = {
  TENANT_ID: "x-tenant-id",
  CLINICIAN_ID: "x-clinician-id",
  AUTHORIZED_AT: "x-authorized-at",
  CORRELATION_ID: "x-correlation-id",
  CAPABILITIES: "x-capabilities",
} as const;

export interface TransportAuthorityContext {
  clinicianId: string;
  tenantId: string;
  authorizedAt: string;
  correlationId: string;
  capabilities: string[];
}

export interface EncounterDto {
  encounterId: string;
  tenantId: string;
  patientId: string;
  status: "CREATED" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateEncounterRequest {
  patientId: string;
}

export interface ActivateEncounterRequest {
  encounterId: string;
}

export interface CompleteEncounterRequest {
  encounterId: string;
}

export interface TransportSuccessResponse<T> {
  success: true;
  data: T;
}

export interface TransportErrorResponse {
  success: false;
  error: string;
  details?: readonly string[];
}

export type EncounterServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: EncounterServiceError };

export interface EncounterServiceError {
  type: string;
  message: string;
}

export interface EncounterService {
  createEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: CreateEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>>;

  activateEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: ActivateEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>>;

  completeEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: CompleteEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>>;
}
