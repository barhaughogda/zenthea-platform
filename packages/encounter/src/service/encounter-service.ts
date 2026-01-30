/**
 * Encounter Service - Slice 01
 *
 * Layer 2: Authorization Boundary Implementation
 */

import {
  EncounterService,
  EncounterServiceResponse,
  EncounterDto,
  CreateEncounterRequest,
  ActivateEncounterRequest,
  CompleteEncounterRequest,
  TransportAuthorityContext,
} from "../transport/types.js";
import { validateAuthorization } from "./authorization.js";

export class DefaultEncounterService implements EncounterService {
  async createEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: CreateEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>> {
    const authError = validateAuthorization(tenantId, authority);
    if (authError) {
      return { success: false, error: authError };
    }

    // Layer 3+ (Persistence, State Machine, Audit) NOT allowed in this slice layer
    throw new Error("Layer 3+ not implemented");
  }

  async activateEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: ActivateEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>> {
    const authError = validateAuthorization(tenantId, authority);
    if (authError) {
      return { success: false, error: authError };
    }

    // Layer 3+ (Persistence, State Machine, Audit) NOT allowed in this slice layer
    throw new Error("Layer 3+ not implemented");
  }

  async completeEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: CompleteEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>> {
    const authError = validateAuthorization(tenantId, authority);
    if (authError) {
      return { success: false, error: authError };
    }

    // Layer 3+ (Persistence, State Machine, Audit) NOT allowed in this slice layer
    throw new Error("Layer 3+ not implemented");
  }
}
