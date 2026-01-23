/**
 * Clinical Note Service - Slice 01
 *
 * Layer 3: Service Logic implementation for Clinical Note Lifecycle.
 *
 * INVARIANTS:
 * - Only a clinician may start a draft.
 * - Drafts always start in DRAFT state.
 * - noteId is generated exactly once at creation.
 * - Logic is synchronous and deterministic.
 * - Failures are fail-closed.
 */

import { randomUUID } from "node:crypto";
import { ClinicalNoteRepository } from "../persistence/clinical-note-repository.js";
import { AuditSink, NoOpAuditSink } from "../audit/audit-sink.js";
import type {
  ClinicalNoteAuthoringService,
  ClinicalNoteDto,
  ServiceResult,
  TransportAuthorityContext,
  StartDraftClinicalNoteRequest,
  UpdateDraftClinicalNoteRequest,
} from "../transport/types.js";

/**
 * Domain errors for Clinical Note Service.
 * These are mapped to transport errors by the transport layer.
 */
export class InvalidAuthorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAuthorError";
  }
}

export class InvalidStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidStateError";
  }
}

export class ClinicalNoteService implements ClinicalNoteAuthoringService {
  constructor(
    private readonly repository: ClinicalNoteRepository = new ClinicalNoteRepository(),
    private readonly auditSink: AuditSink = new NoOpAuditSink(),
  ) {}

  /**
   * Starts a new clinical note draft.
   *
   * @param tenantId - The tenant context for the note.
   * @param authority - The authorized clinician context.
   * @param input - The draft details (encounter, patient, content).
   * @returns A pure domain result object.
   */
  async startDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: StartDraftClinicalNoteRequest,
  ): Promise<ServiceResult<ClinicalNoteDto>> {
    // 1. Enforce domain invariant: Only a clinician may start a draft.
    // In this slice, we assume authority.clinicianId presence is sufficient
    // as lower layers have already validated the authority context.
    if (!authority.clinicianId) {
      return {
        success: false,
        error: {
          type: "AuthorityError",
          message: "Only a clinician may start a draft",
        },
      };
    }

    // 2. Generate noteId exactly once at creation.
    const clinicalNoteId = `cn_${randomUUID()}`;

    // 3. Drafts always start in DRAFT state.
    const now = new Date().toISOString();

    const draft: ClinicalNoteDto = {
      clinicalNoteId,
      tenantId,
      encounterId: input.encounterId,
      patientId: input.patientId,
      practitionerId: authority.clinicianId,
      status: "DRAFT",
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };

    // 4. Persistence Boundary: Persist the draft and initial version.
    // This happens AFTER authorization and service validation.
    // If this throws, the service logic fails and no result is returned.
    await this.repository.saveNewDraft(
      {
        noteId: clinicalNoteId,
        tenantId,
        encounterId: input.encounterId,
        patientId: input.patientId,
        practitionerId: authority.clinicianId,
        status: "DRAFT",
        createdAt: now,
      },
      input.content,
    );

    // 5. Audit Boundary: Emit audit event on success.
    // This happens AFTER persistence succeeds.
    // Audit emission MUST NOT mutate business state.
    // Audit failures MUST fail the request (fail-closed).
    this.auditSink.emit("NOTE_DRAFT_STARTED", {
      tenantId,
      clinicianId: authority.clinicianId,
      noteId: clinicalNoteId,
      encounterId: input.encounterId,
      timestamp: now,
      correlationId: authority.correlationId || "unknown",
    });

    return {
      success: true,
      data: draft,
    };
  }

  /**
   * Updates an existing clinical note draft.
   *
   * @param tenantId - The tenant context.
   * @param authority - The authorized clinician context.
   * @param clinicalNoteId - The ID of the note to update.
   * @param input - The update details (content).
   * @returns A pure domain result object.
   */
  async updateDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    clinicalNoteId: string,
    input: UpdateDraftClinicalNoteRequest,
  ): Promise<ServiceResult<ClinicalNoteDto>> {
    // 1. Authorization Boundary: Only the original author may update.
    // AND Cross-tenant isolation (already checked in transport, but enforced here too).
    const existing = await this.repository.findById(clinicalNoteId);

    if (!existing) {
      return {
        success: false,
        error: {
          type: "NotFoundError",
          message: `Clinical note ${clinicalNoteId} not found`,
        },
      };
    }

    const { note, latestVersion } = existing;

    // Tenant isolation
    if (note.tenantId !== tenantId) {
      return {
        success: false,
        error: {
          type: "AuthorityError",
          message: "Not authorized",
        },
      };
    }

    // Author ownership
    if (note.practitionerId !== authority.clinicianId) {
      return {
        success: false,
        error: {
          type: "AuthorityError",
          message: "Only the original author may update a draft",
        },
      };
    }

    // 2. Service Logic: Draft must be in DRAFT state.
    if (note.status !== "DRAFT") {
      return {
        success: false,
        error: {
          type: "ConflictError",
          message: "Signed notes are immutable",
        },
      };
    }

    // 3. Persistence Boundary: Create new immutable DraftVersion.
    const now = new Date().toISOString();
    const newVersion = await this.repository.saveNewVersion(
      clinicalNoteId,
      input.content,
      now,
    );

    // 4. Audit Boundary: Emit NOTE_DRAFT_UPDATED event.
    this.auditSink.emit("NOTE_DRAFT_UPDATED", {
      tenantId,
      clinicianId: authority.clinicianId,
      noteId: clinicalNoteId,
      encounterId: note.encounterId,
      versionNumber: newVersion.versionNumber,
      timestamp: now,
      correlationId: authority.correlationId || "unknown",
    });

    return {
      success: true,
      data: {
        clinicalNoteId: note.noteId,
        tenantId: note.tenantId,
        encounterId: note.encounterId,
        patientId: note.patientId,
        practitionerId: note.practitionerId,
        status: note.status,
        content: newVersion.content,
        createdAt: note.createdAt,
        updatedAt: now,
      },
    };
  }
}
