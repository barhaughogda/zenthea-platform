/**
 * Slice: Slice 01: Clinical Note Lifecycle
 * Operation: finalizeNote
 * References:
 * - Golden Path: docs/04-execution/slices/slice-01-clinical-note-golden-path.md
 * - Failure Matrix: docs/04-execution/slices/slice-01-clinical-note-failure-matrix.md
 * - Test Matrix: docs/04-execution/slices/slice-01-clinical-note-test-matrix.md
 */

import { expect, test, describe, beforeEach } from "vitest";
import {
  handleStartDraft,
  handleFinalizeNote,
} from "../src/transport/routes.js";
import { ClinicalNoteService } from "../src/service/clinical-note-service.js";
import type { ClinicalNoteAuthoringService } from "../src/transport/types.js";
import { HEADER_KEYS } from "../src/transport/types.js";

describe("finalizeNote Contract Tests", () => {
  let service: ClinicalNoteAuthoringService;

  beforeEach(async () => {
    service = new ClinicalNoteService();
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
   * S01-GP-03: Successful note finalization
   */
  test("S01-GP-03", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: noteId },
    };

    await handleFinalizeNote(request, reply, service);

    expect(reply._status).toBe(200);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.status).toBe("SIGNED");
    expect(reply._body.data.signedAt).toBeDefined();
  });

  /**
   * S01-FM-15: Note not found
   */
  test("S01-FM-15", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: "non-existent" },
    };

    await handleFinalizeNote(request, reply, service);

    expect(reply._status).toBe(404);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Resource not found");
  });

  /**
   * S01-FM-16: Draft already signed
   */
  test("S01-FM-16", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    // First finalization
    const reply1 = mockReply();
    const request1: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: noteId },
    };
    await handleFinalizeNote(request1, reply1, service);
    expect(reply1._status).toBe(200);

    // Second finalization
    const reply2 = mockReply();
    const request2: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-789",
      },
      params: { clinicalNoteId: noteId },
    };
    await handleFinalizeNote(request2, reply2, service);

    expect(reply2._status).toBe(409);
    expect(reply2._body.success).toBe(false);
    expect(reply2._body.error).toBe("Resource conflict");
  });

  /**
   * S01-FM-11: Cross-tenant access (Reused from updateDraft matrix)
   */
  test("S01-FM-11", async () => {
    const noteId = await createDraft("tenant-1", "clinician-1");

    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-2",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: noteId },
    };

    await handleFinalizeNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Access denied");
  });
});
