/**
 * Clinical Note Write Model - Phase F.2 Slice 4
 *
 * Write operations for Clinical Note domain with fail-closed authority enforcement.
 */

import {
  type AuthorityContext,
  isValidAuthorityContext,
} from "../authority/types.js";
import type { ClinicalNoteRepository } from "./repository.js";
import type {
  ClinicalNoteRecord,
  CreateClinicalNoteInput,
  WriteResult,
} from "./types.js";

/**
 * Clinical Note Write Model - enforces authority boundary and domain rules.
 */
export class ClinicalNoteWriteModel {
  constructor(private readonly repository: ClinicalNoteRepository) {}

  /**
   * Create a new Clinical Note in draft status.
   *
   * Authority REQUIRED. Practitioner ID is derived from AuthorityContext.
   */
  createClinicalNote(
    input: CreateClinicalNoteInput,
    authority: AuthorityContext | undefined | null
  ): WriteResult<ClinicalNoteRecord> {
    // FAIL CLOSED: Verify authority context
    const authResult = this.validateAuthority(authority);
    if (!authResult.valid) {
      return authResult.error;
    }
    const validAuth = authResult.authority;

    // Validate input
    if (!input.encounterId) {
      return {
        success: false,
        error: { code: "ENCOUNTER_REQUIRED", message: "Encounter ID is required" },
      };
    }
    if (!input.patientId) {
      return {
        success: false,
        error: { code: "PATIENT_REQUIRED", message: "Patient ID is required" },
      };
    }
    if (!input.content || input.content.trim().length === 0) {
      return {
        success: false,
        error: { code: "CONTENT_REQUIRED", message: "Content cannot be empty" },
      };
    }

    const now = new Date().toISOString();
    const record: ClinicalNoteRecord = Object.freeze({
      clinicalNoteId: this.generateId(),
      tenantId: validAuth.tenantId,
      encounterId: input.encounterId,
      patientId: input.patientId,
      practitionerId: validAuth.clinicianId,
      status: "draft",
      content: input.content,
      createdAt: now,
      updatedAt: now,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Finalize a draft Clinical Note.
   * Once finalized, a note becomes immutable and cannot be finalized again.
   *
   * Authority REQUIRED.
   */
  finalizeClinicalNote(
    clinicalNoteId: string,
    authority: AuthorityContext | undefined | null
  ): WriteResult<ClinicalNoteRecord> {
    // FAIL CLOSED: Verify authority context
    const authResult = this.validateAuthority(authority);
    if (!authResult.valid) {
      return authResult.error;
    }
    const validAuth = authResult.authority;

    const existing = this.repository.findById(validAuth.tenantId, clinicalNoteId);
    if (!existing) {
      return {
        success: false,
        error: { code: "NOTE_NOT_FOUND", message: `Note ${clinicalNoteId} not found` },
      };
    }

    if (existing.status === "finalized") {
      return {
        success: false,
        error: { code: "ALREADY_FINALIZED", message: "Note is already finalized" },
      };
    }

    const now = new Date().toISOString();
    const record: ClinicalNoteRecord = Object.freeze({
      ...existing,
      status: "finalized",
      finalizedAt: now,
      updatedAt: now,
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
            message: "Authority context is required for write operations.",
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
            message: "Authority context is invalid or malformed.",
          },
        },
      };
    }

    return { valid: true, authority };
  }

  private generateId(): string {
    return `cn_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
