/**
 * Slice: Slice 06: Clinical Note Signing Semantics
 * Operation: signNote
 * References:
 * - Goal: Add "sign/finalize" semantics required by Slice 06
 * - Endpoint: POST /api/v1/clinical-notes/:clinicalNoteId/sign
 */

import { expect, test, describe, beforeEach } from "vitest";
import { handleStartDraft, handleSignNote } from "../src/transport/routes.js";
import { ClinicalNoteService } from "../src/service/clinical-note-service.js";
import type { ClinicalNoteAuthoringService } from "../src/transport/types.js";
import { HEADER_KEYS } from "../src/transport/types.js";

describe("signNote Contract Tests (Slice 06)", () => {
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
   * S06-TM-01: Successful signing of a DRAFT note
   */
  test("S06-TM-01: Successful signing", async () => {
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

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(200);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.status).toBe("SIGNED");
    expect(reply._body.data.signedAt).toBeDefined();
  });

  /**
   * S06-TM-02: Fail if note does not exist
   */
  test("S06-TM-02: Note not found", async () => {
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

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(404);
    expect(reply._body.success).toBe(false);
  });

  /**
   * S06-TM-03: Fail if note is already SIGNED (Conflict)
   */
  test("S06-TM-03: Already signed", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    // First signing
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
    await handleSignNote(request1, reply1, service);
    expect(reply1._status).toBe(200);

    // Second signing
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
    await handleSignNote(request2, reply2, service);

    expect(reply2._status).toBe(409);
    expect(reply2._body.success).toBe(false);
  });

  /**
   * S06-TM-04: Fail if tenantId mismatch
   */
  test("S06-TM-04: Tenant mismatch", async () => {
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

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
  });

  /**
   * S06-TM-05: Fail if non-author attempts to sign
   */
  test("S06-TM-05: Non-author signing", async () => {
    const noteId = await createDraft("tenant-1", "clinician-1");

    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-2",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: noteId },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
  });

  /**
   * S06-TM-06: Fail if x-tenant-id is missing
   */
  test("S06-TM-06: Missing tenant header", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: "some-id" },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
  });

  /**
   * S06-TM-07: Fail if x-clinician-id is missing
   */
  test("S06-TM-07: Missing clinician header", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: "some-id" },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
  });

  /**
   * S06-TM-08: Fail if x-authorized-at is missing
   */
  test("S06-TM-08: Missing authorized-at header", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: "some-id" },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(400);
  });

  /**
   * S06-TM-09: Fail if x-correlation-id is missing
   */
  test("S06-TM-09: Missing correlation-id header", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
      },
      params: { clinicalNoteId: "some-id" },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(400);
  });

  /**
   * S06-TM-10: Fail if x-authorized-at is invalid format
   */
  test("S06-TM-10: Invalid authorized-at format", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: "not-a-date",
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: "some-id" },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(403);
  });

  /**
   * S06-TM-11: Fail if clinicalNoteId is empty string
   */
  test("S06-TM-11: Empty clinicalNoteId", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: " " },
    };

    await handleSignNote(request, reply, service);

    expect(reply._status).toBe(400);
  });

  /**
   * S06-TM-12: Irreversibility check: SIGNED note cannot be edited
   */
  test("S06-TM-12: Signed note is immutable", async () => {
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const noteId = await createDraft(tenantId, clinicianId);

    // Sign it
    const signReply = mockReply();
    const signRequest: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-456",
      },
      params: { clinicalNoteId: noteId },
    };
    await handleSignNote(signRequest, signReply, service);
    expect(signReply._status).toBe(200);

    // Try to update it - using existing handleUpdateDraft
    const { handleUpdateDraft } = await import("../src/transport/routes.js");
    const updateReply = mockReply();
    const updateRequest: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-789",
      },
      params: { clinicalNoteId: noteId },
      body: { content: "New content after sign" },
    };
    await handleUpdateDraft(updateRequest, updateReply, service);

    expect(updateReply._status).toBe(409);
  });
});
