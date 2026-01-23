import { expect, test, describe, beforeEach } from "vitest";
import { handleReadNote } from "../src/transport/routes.js";
import { ClinicalNoteService } from "../src/service/clinical-note-service.js";
import type { ClinicalNoteAuthoringService } from "../src/transport/types.js";
import { HEADER_KEYS } from "../src/transport/types.js";

describe("readNote Contract Tests", () => {
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

  /**
   * S01-GP-04: Successful read of signed note
   */
  test("S01-GP-04", async () => {
    // 1. Setup: Create and finalize a note
    const tenantId = "tenant-1";
    const clinicianId = "clinician-1";
    const authContext = {
      clinicianId,
      tenantId,
      authorizedAt: new Date().toISOString(),
      correlationId: "corr-123",
    };

    const startResult = await service.startDraft(tenantId, authContext, {
      encounterId: "enc-123",
      patientId: "pat-123",
      content: "Final content",
    });

    if (!startResult.success) throw new Error("Setup failed: startDraft");
    const noteId = startResult.data.clinicalNoteId;

    const finalizeResult = await service.finalizeNote(
      tenantId,
      authContext,
      noteId,
    );
    if (!finalizeResult.success) throw new Error("Setup failed: finalizeNote");

    // 2. Test: Read the signed note
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: clinicianId,
        [HEADER_KEYS.AUTHORIZED_AT]: authContext.authorizedAt,
        [HEADER_KEYS.CORRELATION_ID]: authContext.correlationId,
      },
      params: { clinicalNoteId: noteId },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(200);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.status).toBe("SIGNED");
    expect(reply._body.data.content).toBe("Final content");
  });

  /**
   * S01-FM-18: Note not found
   */
  test("S01-FM-18", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      params: { clinicalNoteId: "non-existent" },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(404);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Resource not found");
  });

  /**
   * S01-FM-19: Cross-tenant access
   */
  test("S01-FM-19", async () => {
    // 1. Setup: Create a note in tenant-1
    const tenant1 = "tenant-1";
    const auth1 = {
      clinicianId: "clinician-1",
      tenantId: tenant1,
      authorizedAt: new Date().toISOString(),
      correlationId: "corr-1",
    };

    const startResult = await service.startDraft(tenant1, auth1, {
      encounterId: "enc-123",
      patientId: "pat-123",
      content: "Content",
    });

    if (!startResult.success) throw new Error("Setup failed");
    const noteId = startResult.data.clinicalNoteId;
    await service.finalizeNote(tenant1, auth1, noteId);

    // 2. Test: Try to read from tenant-2
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-2",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-2",
      },
      params: { clinicalNoteId: noteId },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Access denied");
  });

  /**
   * S01-FM-20: Draft state -> ConflictError
   */
  test("S01-FM-20", async () => {
    // 1. Setup: Create a draft note (don't finalize)
    const tenantId = "tenant-1";
    const authContext = {
      clinicianId: "clinician-1",
      tenantId,
      authorizedAt: new Date().toISOString(),
      correlationId: "corr-123",
    };

    const startResult = await service.startDraft(tenantId, authContext, {
      encounterId: "enc-123",
      patientId: "pat-123",
      content: "Draft content",
    });

    if (!startResult.success) throw new Error("Setup failed");
    const noteId = startResult.data.clinicalNoteId;

    // 2. Test: Try to read the draft
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: tenantId,
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: authContext.authorizedAt,
        [HEADER_KEYS.CORRELATION_ID]: authContext.correlationId,
      },
      params: { clinicalNoteId: noteId },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(409);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Resource conflict");
  });
});
