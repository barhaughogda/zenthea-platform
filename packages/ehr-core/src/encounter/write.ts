/**
 * Encounter Write Model - Phase F.2 Slice 3
 *
 * Write operations for Encounter entity with fail-closed authority enforcement.
 *
 * INVARIANTS (from Phase F-00, F-01, F-02):
 * - Writes MUST require explicit AuthorityContext representing human clinician action
 * - Writes MUST fail closed when AuthorityContext is absent or invalid
 * - Writes MUST be attributable to a human clinician
 * - Operations return result types (no exceptions for control flow)
 */

import {
  type AuthorityContext,
  isValidAuthorityContext,
} from "../authority/types.js";
import type { EncounterRepository } from "./repository.js";
import type {
  CreateEncounterInput,
  EncounterRecord,
  EncounterStatus,
  WriteError,
  WriteResult,
} from "./types.js";

/**
 * Encounter Write Model - enforces authority boundary for all mutations.
 */
export class EncounterWriteModel {
  private readonly repository: EncounterRepository;

  constructor(repository: EncounterRepository) {
    this.repository = repository;
  }

  /**
   * Create a new encounter record.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  createEncounter(
    input: CreateEncounterInput,
    authority: AuthorityContext | undefined | null
  ): WriteResult<EncounterRecord> {
    // FAIL CLOSED: Verify authority context
    const authorityValidation = this.validateAuthority(authority);
    if (!authorityValidation.valid) {
      return authorityValidation.error;
    }
    const validAuthority = authorityValidation.authority;

    // Validate input
    const inputValidation = this.validateCreateInput(input);
    if (inputValidation !== null) {
      return inputValidation;
    }

    // Create the record
    const now = new Date().toISOString();
    const record: EncounterRecord = Object.freeze({
      encounterId: this.generateId(),
      tenantId: validAuthority.tenantId,
      patientId: input.patientId,
      practitionerId: input.practitionerId,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      lastModifiedBy: validAuthority.clinicianId,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Update encounter status.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  updateEncounterStatus(
    encounterId: string,
    status: EncounterStatus,
    authority: AuthorityContext | undefined | null
  ): WriteResult<EncounterRecord> {
    // FAIL CLOSED: Verify authority context
    const authorityValidation = this.validateAuthority(authority);
    if (!authorityValidation.valid) {
      return authorityValidation.error;
    }
    const validAuthority = authorityValidation.authority;

    // Find existing encounter
    const existing = this.repository.findById(
      validAuthority.tenantId,
      encounterId
    );
    if (!existing) {
      return {
        success: false,
        error: {
          code: "ENCOUNTER_NOT_FOUND",
          message: `Encounter ${encounterId} not found in tenant`,
        },
      };
    }

    // Verify tenant match (defense in depth)
    if (existing.tenantId !== validAuthority.tenantId) {
      return {
        success: false,
        error: {
          code: "TENANT_MISMATCH",
          message: "Encounter belongs to different tenant",
        },
      };
    }

    // Create updated record
    const record: EncounterRecord = Object.freeze({
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: validAuthority.clinicianId,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Validate authority context - FAIL CLOSED on any issue.
   */
  private validateAuthority(
    authority: AuthorityContext | undefined | null
  ):
    | { valid: true; authority: AuthorityContext }
    | { valid: false; error: WriteResult<never> } {
    if (authority === undefined || authority === null) {
      return {
        valid: false,
        error: {
          success: false,
          error: {
            code: "AUTHORITY_MISSING",
            message:
              "Authority context is required for write operations. " +
              "All writes must be attributable to a verified human clinician.",
          },
        },
      };
    }

    if (!isValidAuthorityContext(authority)) {
      return {
        valid: false,
        error: {
          success: false,
          error: {
            code: "AUTHORITY_INVALID",
            message:
              "Authority context is invalid or not properly constructed.",
          },
        },
      };
    }

    return { valid: true, authority };
  }

  /**
   * Validate create encounter input.
   */
  private validateCreateInput(
    input: CreateEncounterInput
  ): WriteResult<never> | null {
    if (!input.patientId || input.patientId.trim().length === 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Patient ID is required",
        },
      };
    }

    if (!input.practitionerId || input.practitionerId.trim().length === 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Practitioner ID is required",
        },
      };
    }

    if (!input.status) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Status is required",
        },
      };
    }

    return null;
  }

  /**
   * Generate a unique ID for a new encounter.
   */
  private generateId(): string {
    return `enc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
