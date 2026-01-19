/**
 * Practitioner Write Model - Phase F.2 Slice 2
 *
 * Write operations for Practitioner entity with fail-closed authority enforcement.
 */

import {
  type AuthorityContext,
  isValidAuthorityContext,
} from "../authority/types.js";
import type { PractitionerRepository } from "./repository.js";
import type {
  CreatePractitionerInput,
  PractitionerRecord,
  UpdatePractitionerInput,
  WriteResult,
  WriteError,
} from "./types.js";

export class PractitionerWriteModel {
  private readonly repository: PractitionerRepository;

  constructor(repository: PractitionerRepository) {
    this.repository = repository;
  }

  /**
   * Create a new practitioner.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  createPractitioner(
    authority: AuthorityContext | undefined | null,
    input: CreatePractitionerInput
  ): WriteResult<PractitionerRecord> {
    const auth = this.validateAuthority(authority);
    if (!auth.success) {
      return auth;
    }
    const validAuthority = auth.data;

    if (!input.displayName || input.displayName.trim().length === 0) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Display name is required" },
      };
    }

    const now = new Date().toISOString();
    const record: PractitionerRecord = Object.freeze({
      id: this.generateId(),
      tenantId: validAuthority.tenantId,
      displayName: input.displayName,
      role: "clinician",
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Update practitioner profile.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  updatePractitioner(
    authority: AuthorityContext | undefined | null,
    input: UpdatePractitionerInput
  ): WriteResult<PractitionerRecord> {
    const auth = this.validateAuthority(authority);
    if (!auth.success) {
      return auth;
    }
    const validAuthority = auth.data;

    const existing = this.repository.findById(
      validAuthority.tenantId,
      input.practitionerId
    );
    if (!existing) {
      return {
        success: false,
        error: {
          code: "PRACTITIONER_NOT_FOUND",
          message: "Practitioner not found in tenant",
        },
      };
    }

    const record: PractitionerRecord = Object.freeze({
      ...existing,
      displayName: input.displayName ?? existing.displayName,
      active: input.active ?? existing.active,
      updatedAt: new Date().toISOString(),
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  private validateAuthority(
    authority: AuthorityContext | undefined | null
  ): WriteResult<AuthorityContext> {
    if (!authority) {
      return {
        success: false,
        error: {
          code: "AUTHORITY_MISSING",
          message: "Authority context is required for write operations.",
        },
      };
    }

    if (!isValidAuthorityContext(authority)) {
      return {
        success: false,
        error: {
          code: "AUTHORITY_INVALID",
          message: "Authority context is invalid or not properly constructed.",
        },
      };
    }

    return { success: true, data: authority };
  }

  private generateId(): string {
    return `prac_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
