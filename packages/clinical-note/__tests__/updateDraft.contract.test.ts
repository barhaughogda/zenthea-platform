/**
 * Slice: Slice 01: Clinical Note Lifecycle
 * Operation: updateDraft
 * References:
 * - Golden Path: docs/04-execution/slices/slice-01-clinical-note-golden-path.md
 * - Failure Matrix: docs/04-execution/slices/slice-01-clinical-note-failure-matrix.md
 * - Test Matrix: docs/04-execution/slices/slice-01-clinical-note-test-matrix.md
 *
 * This is a contract test skeleton. No implementation exists yet.
 */

import { expect, test, describe, beforeEach } from "vitest";
import {
  handleUpdateDraft,
  handleStartDraft,
  handleFinalizeNote,
} from "../src/transport/routes.js";
import { ClinicalNoteService } from "../src/service/clinical-note-service.js";
import { HEADER_KEYS } from "../src/transport/types.js";
import { ClinicalNoteRepository } from "../src/persistence/clinical-note-repository.js";

describe("updateDraft Contract Tests", () => {
  let service: ClinicalNoteService;
  let repository: ClinicalNoteRepository;

  beforeEach(async () => {
    repository = new ClinicalNoteRepository();
    service = new ClinicalNoteService(repository);
  });

  const mockReply = () => {
    const reply: any = {
      _status: 200,
      _body: null,
      status: (s: number) => {
        reply._status = s;
        return reply;
      },
      send: (b: any) => {
        reply._body = b;
        return reply;
      },
    };
    return reply;
  };

  const createDraft = async (tenantId: string, clinicianId: string) => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        encounterId: "enc-123",
        patientId: "pat-123",
        content: "Initial content",
      },
    };
    await handleStartDraft(request, reply, service);
    return reply._body.data.clinicalNoteId;
  };

  /**
   * S01-GP-02: Successful draft update
   * Expected behavior: Update an existing draft with new sections.
   * Expected outcome: Success (200)
   * Expected state change: New DraftVersion created
   * Expected audit emission: NOTE_DRAFT_UPDATED
   */
  test("S01-GP-02", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(200);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.content).toBe("Updated content");
    expect(reply._body.data.status).toBe("DRAFT");
  });

  /**
   * S01-FM-10: Note not found
   * Expected behavior: Reject update if noteId does not exist.
   * Expected outcome: NotFoundError (404)
   * Expected state change: None
   * Expected audit emission: ClinicalNoteUpdateRequested
   */
  test("S01-FM-10", async () => {
    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: "non-existent" },
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(404);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toContain("not found");
  });

  /**
   * S01-FM-11: Cross-tenant access
   * Expected behavior: Reject update if note belongs to a different tenant.
   * Expected outcome: AuthError (403)
   * Expected state change: None
   * Expected audit emission: SecurityEvidence
   */
  test("S01-FM-11", async () => {
    const noteId = await createDraft("tenant-A", "clinician-1");

    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-B", // Different tenant
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Access denied");
  });

  /**
   * S01-FM-12: Update after signing
   * Expected behavior: Reject update if note status is SIGNED.
   * Expected outcome: ConflictError (409)
   * Expected state change: None
   * Expected audit emission: ClinicalNoteUpdateRequested
   */
  test("S01-FM-12", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    // Finalize the note
    const finalizeReply = mockReply();
    const finalizeRequest: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-finalize",
      },
    };
    await handleFinalizeNote(finalizeRequest, finalizeReply, service);
    expect(finalizeReply._status).toBe(200);

    // Attempt update
    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-update",
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(409);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Resource conflict");
  });

  /**
   * Additional requirement: Non-author clinicians
   */
  test("S01-FM-NonAuthor", async () => {
    const noteId = await createDraft("tenant-1", "clinician-author");

    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-other", // Not the author
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Access denied");
  });

  /**
   * Additional requirement: Missing authority context
   */
  test("S01-FM-MissingAuthority", async () => {
    const noteId = await createDraft("tenant-1", "clinician-1");

    const reply = mockReply();
    const request: any = {
      params: { clinicalNoteId: noteId },
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        // Missing other headers
      },
      body: {
        content: "Updated content",
      },
    };

    await handleUpdateDraft(request, reply, service);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Authority context required");
  });
});
