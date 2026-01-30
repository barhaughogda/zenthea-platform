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
import { AuditSink } from "../audit/audit-sink.js";
import { InMemoryAuditSink } from "../audit/in-memory-audit-sink.js";
import crypto from "node:crypto";

export class DefaultEncounterService implements EncounterService {
  private repository: EncounterRepository;
  private auditSink: AuditSink;

  constructor(repository?: EncounterRepository, auditSink?: AuditSink) {
    this.repository = repository ?? new InMemoryEncounterRepository();
    this.auditSink = auditSink ?? new InMemoryAuditSink();
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

      await this.auditSink.emit({
        tenantId,
        encounterId,
        actorId: authority.actorId,
        action: "ENCOUNTER_CREATED",
        timestamp: now,
        correlationId: authority.correlationId,
      });

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
        error: {
          type: "SYSTEM_ERROR",
          message:
            error.message === "Audit failure"
              ? "Audit failure"
              : "Persistence failure",
        },
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
            type: "CONFLICT",
            message: `Conflict: Cannot activate encounter in ${record.status} state`,
          },
        };
      }

      const now = new Date().toISOString();
      const updatedRecord: EncounterRecord = {
        ...record,
        status: "ACTIVE",
        updatedAt: now,
      };

      await this.repository.update(updatedRecord);

      await this.auditSink.emit({
        tenantId,
        encounterId: record.encounterId,
        actorId: authority.actorId,
        action: "ENCOUNTER_ACTIVATED",
        timestamp: now,
        correlationId: authority.correlationId,
      });

      return { success: true, data: this.mapRecordToDto(updatedRecord) };
    } catch (error: any) {
      return {
        success: false,
        error: {
          type: "SYSTEM_ERROR",
          message:
            error.message === "Audit failure"
              ? "Audit failure"
              : "Persistence failure",
        },
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
            type: "CONFLICT",
            message: `Conflict: Cannot complete encounter in ${record.status} state`,
          },
        };
      }

      const now = new Date().toISOString();
      const updatedRecord: EncounterRecord = {
        ...record,
        status: "COMPLETED",
        updatedAt: now,
      };

      await this.repository.update(updatedRecord);

      await this.auditSink.emit({
        tenantId,
        encounterId: record.encounterId,
        actorId: authority.actorId,
        action: "ENCOUNTER_COMPLETED",
        timestamp: now,
        correlationId: authority.correlationId,
      });

      return { success: true, data: this.mapRecordToDto(updatedRecord) };
    } catch (error: any) {
      return {
        success: false,
        error: {
          type: "SYSTEM_ERROR",
          message:
            error.message === "Audit failure"
              ? "Audit failure"
              : "Persistence failure",
        },
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
