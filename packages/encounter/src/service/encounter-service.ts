/**
 * Encounter Service - Slice 01
 *
 * Layer 3: State Machine Implementation (In-Memory)
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
import crypto from "node:crypto";

export class DefaultEncounterService implements EncounterService {
  // In-memory storage for Slice 01 (No persistence)
  private encounters = new Map<string, EncounterDto>();

  async createEncounter(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: CreateEncounterRequest,
  ): Promise<EncounterServiceResponse<EncounterDto>> {
    const authError = validateAuthorization(tenantId, authority);
    if (authError) {
      return { success: false, error: authError };
    }

    const encounterId = `enc-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const encounter: EncounterDto = {
      encounterId,
      tenantId,
      patientId: input.patientId,
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.encounters.set(encounterId, encounter);

    return { success: true, data: encounter };
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

    const encounter = this.encounters.get(input.encounterId);

    if (!encounter) {
      return {
        success: false,
        error: { type: "NOT_FOUND", message: "Encounter not found" },
      };
    }

    if (encounter.tenantId !== tenantId) {
      return {
        success: false,
        error: { type: "FORBIDDEN", message: "Cross-tenant access rejected" },
      };
    }

    if (encounter.status !== "CREATED") {
      return {
        success: false,
        error: {
          type: "INVALID_STATE",
          message: `Cannot activate encounter in ${encounter.status} state`,
        },
      };
    }

    const updatedEncounter: EncounterDto = {
      ...encounter,
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    };

    this.encounters.set(input.encounterId, updatedEncounter);

    return { success: true, data: updatedEncounter };
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

    const encounter = this.encounters.get(input.encounterId);

    if (!encounter) {
      return {
        success: false,
        error: { type: "NOT_FOUND", message: "Encounter not found" },
      };
    }

    if (encounter.tenantId !== tenantId) {
      return {
        success: false,
        error: { type: "FORBIDDEN", message: "Cross-tenant access rejected" },
      };
    }

    if (encounter.status !== "ACTIVE") {
      return {
        success: false,
        error: {
          type: "INVALID_STATE",
          message: `Cannot complete encounter in ${encounter.status} state`,
        },
      };
    }

    const updatedEncounter: EncounterDto = {
      ...encounter,
      status: "COMPLETED",
      updatedAt: new Date().toISOString(),
    };

    this.encounters.set(input.encounterId, updatedEncounter);

    return { success: true, data: updatedEncounter };
  }
}
