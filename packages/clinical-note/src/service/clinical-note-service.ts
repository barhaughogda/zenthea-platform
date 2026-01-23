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
}
