/**
 * Encounter Service - Slice 01
 *
 * Layer 3: State Machine Implementation (Persistence Boundary)
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
import { EncounterRepository } from "../persistence/encounter-repository.js";
import { InMemoryEncounterRepository } from "../persistence/in-memory-encounter-repository.js";
import { EncounterRecord } from "../persistence/types.js";
import crypto from "node:crypto";

export class DefaultEncounterService implements EncounterService {
  private repository: EncounterRepository;

  constructor(repository?: EncounterRepository) {
    this.repository = repository ?? new InMemoryEncounterRepository();
  }

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

    const record: EncounterRecord = {
      encounterId,
      tenantId,
      patientId: input.patientId,
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    try {
      await this.repository.create(record);
      return { success: true, data: this.mapRecordToDto(record) };
    } catch (error: any) {
      if (error.code === "CONFLICT") {
        return {
          success: false,
          error: { type: "CONFLICT", message: error.message },
        };
      }
      return {
        success: false,
        error: { type: "SYSTEM_ERROR", message: "Persistence failure" },
      };
    }
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

    try {
      const record = await this.repository.getById(input.encounterId);

      if (!record) {
        return {
          success: false,
          error: { type: "NOT_FOUND", message: "Encounter not found" },
        };
      }

      if (record.tenantId !== tenantId) {
        return {
          success: false,
          error: { type: "FORBIDDEN", message: "Cross-tenant access rejected" },
        };
      }

      if (record.status !== "CREATED") {
        return {
          success: false,
          error: {
            type: "INVALID_STATE",
            message: `Cannot activate encounter in ${record.status} state`,
          },
        };
      }

      const updatedRecord: EncounterRecord = {
        ...record,
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
      };

      await this.repository.update(updatedRecord);

      return { success: true, data: this.mapRecordToDto(updatedRecord) };
    } catch (error: any) {
      return {
        success: false,
        error: { type: "SYSTEM_ERROR", message: "Persistence failure" },
      };
    }
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

    try {
      const record = await this.repository.getById(input.encounterId);

      if (!record) {
        return {
          success: false,
          error: { type: "NOT_FOUND", message: "Encounter not found" },
        };
      }

      if (record.tenantId !== tenantId) {
        return {
          success: false,
          error: { type: "FORBIDDEN", message: "Cross-tenant access rejected" },
        };
      }

      if (record.status !== "ACTIVE") {
        return {
          success: false,
          error: {
            type: "INVALID_STATE",
            message: `Cannot complete encounter in ${record.status} state`,
          },
        };
      }

      const updatedRecord: EncounterRecord = {
        ...record,
        status: "COMPLETED",
        updatedAt: new Date().toISOString(),
      };

      await this.repository.update(updatedRecord);

      return { success: true, data: this.mapRecordToDto(updatedRecord) };
    } catch (error: any) {
      return {
        success: false,
        error: { type: "SYSTEM_ERROR", message: "Persistence failure" },
      };
    }
  }

  private mapRecordToDto(record: EncounterRecord): EncounterDto {
    return {
      encounterId: record.encounterId,
      tenantId: record.tenantId,
      patientId: record.patientId,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
