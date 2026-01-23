import { expect, test, describe, beforeEach } from "vitest";
import { handleReadNote } from "../src/transport/routes.js";
import { ClinicalNoteService } from "../src/service/clinical-note-service.js";
import type { ClinicalNoteAuthoringService } from "../src/transport/types.js";
import { HEADER_KEYS } from "../src/transport/types.js";

/**
 * CONTRACT TESTS for Slice 02: Clinical Note Read Expansion (Non-Author Read Access)
 *
 * These tests verify the boundary-level behavior of the readNote route.
 * Assertions are limited to HTTP status, response shape, and observable audit requirements.
 *
 * Boundary: handleReadNote (Transport) -> ClinicalNoteAuthoringService (Domain)
 */
describe("readNote.nonAuthor.contract.test", () => {
  let service: ClinicalNoteAuthoringService;

  beforeEach(async () => {
    // Using real service implementation as per contract test rules (no internal mocks)
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
   * S02-TM-01: Golden Path
   * Non-author clinician authenticated; Note exists in SIGNED state within same tenant.
   */
  test("S02-TM-01", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "non-author-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-01",
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    // Expected to fail (RED) as implementation is not yet updated for non-author access
    expect(reply._status).toBe(200);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.content).toBeDefined();
    expect(reply._body.data.status).toBe("SIGNED");
  });

  /**
   * S02-TM-02: S02-FM-01
   * Request initiated without a valid identity context.
   */
  test("S02-TM-02", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        // Missing CLINICIAN_ID, AUTHORIZED_AT, CORRELATION_ID
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-03: S02-FM-02
   * Request contains structurally malformed identity or role metadata.
   */
  test("S02-TM-03", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: "not-a-date", // Malformed
        [HEADER_KEYS.CORRELATION_ID]: "corr-03",
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-04: S02-FM-03
   * Requestor Tenant ID does not match the Target Note Tenant ID.
   */
  test("S02-TM-04", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-2", // Mismatch
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-04",
        "x-auth-tenant-id": "tenant-2",
      },
      params: {
        clinicalNoteId: "tenant-1-signed-note",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-05: S02-FM-04
   * Target Note ID does not exist in the persistence layer.
   */
  test("S02-TM-05", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-05",
      },
      params: {
        clinicalNoteId: "non-existent-id",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(404);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-06: S02-FM-05
   * Target Note exists but is in the DRAFT state.
   */
  test("S02-TM-06", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "non-author-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-06",
      },
      params: {
        clinicalNoteId: "draft-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-07: S02-FM-06
   * Requestor ID matches the Note Author ID.
   */
  test("S02-TM-07", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "author-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-07",
      },
      params: {
        clinicalNoteId: "author-1-note",
      },
    };

    await handleReadNote(request, reply, service);

    // Expected to fail (RED) initially if Slice 02 logic is intended to explicitly deny Author
    // (Author access is handled by Slice 01, Slice 02 is for Non-Author)
    expect(reply._status).toBe(403);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined();
  });

  /**
   * S02-TM-08: S02-FM-07
   * Request lacks a specific Tenant ID for scoping.
   */
  test("S02-TM-08", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-08",
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined(); // Fail-closed
  });

  /**
   * S02-TM-09: S02-FM-08
   * The audit sink is unavailable.
   */
  test("S02-TM-09", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "non-author-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-09-audit-fail",
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    // Fail-closed on audit failure
    expect(reply._status).toBe(500);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined();
  });

  /**
   * S02-TM-10: S02-FM-09
   * The persistence layer is unreachable or returns a fatal error.
   */
  test("S02-TM-10", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "non-author-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-10-db-fail",
      },
      params: {
        clinicalNoteId: "signed-note-1",
      },
    };

    await handleReadNote(request, reply, service);

    // Fail-safe behavior on system failure
    expect(reply._status).toBe(500);
    expect(reply._body.success).toBe(false);
    expect(reply._body.data).toBeUndefined();
  });
});
