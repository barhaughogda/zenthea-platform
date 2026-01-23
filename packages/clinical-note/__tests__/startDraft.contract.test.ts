import { expect, test, describe, beforeEach } from "vitest";
import { handleStartDraft } from "../src/transport/routes.js";
import type {
  ClinicalNoteAuthoringService,
  ClinicalNoteDto,
} from "../src/transport/types.js";
import { HEADER_KEYS } from "../src/transport/types.js";

describe("startDraft Contract Tests", () => {
  let mockService: ClinicalNoteAuthoringService;

  beforeEach(async () => {
    mockService = {
      startDraft: async (tenantId, authority, input) => {
        return {
          success: true,
          data: {
            clinicalNoteId: "cn_123",
            tenantId,
            encounterId: input.encounterId,
            patientId: input.patientId,
            practitionerId: authority.clinicianId,
            status: "DRAFT",
            content: input.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    } as ClinicalNoteAuthoringService;
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
   * S01-GP-01: Successful draft creation
   */
  test("S01-GP-01", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        encounterId: "enc-123",
        patientId: "pat-123",
        content: "Initial content",
      },
    };

    await handleStartDraft(request, reply, mockService);

    expect(reply._status).toBe(201);
    expect(reply._body.success).toBe(true);
    expect(reply._body.data.status).toBe("DRAFT");
  });

  /**
   * S01-FM-01: Missing tenantId
   */
  test("S01-FM-01", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.CLINICIAN_ID]: "clinician-1",
        [HEADER_KEYS.AUTHORIZED_AT]: new Date().toISOString(),
        [HEADER_KEYS.CORRELATION_ID]: "corr-123",
      },
      body: {
        encounterId: "enc-123",
        patientId: "pat-123",
        content: "Initial content",
      },
    };

    await handleStartDraft(request, reply, mockService);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Tenant context required");
  });

  /**
   * S01-FM-03: Missing AuthorityContext
   */
  test("S01-FM-03", async () => {
    const reply = mockReply();
    const request: any = {
      headers: {
        [HEADER_KEYS.TENANT_ID]: "tenant-1",
      },
      body: {
        encounterId: "enc-123",
        patientId: "pat-123",
        content: "Initial content",
      },
    };

    await handleStartDraft(request, reply, mockService);

    expect(reply._status).toBe(400);
    expect(reply._body.success).toBe(false);
    expect(reply._body.error).toBe("Authority context required");
  });
});
