import { describe, it, expect } from "vitest";
import { buildDemoTrustLedger } from "../demoTrustLedger";

describe("demoTrustLedger", () => {
  it("should return a deterministic list of trust ledger entries", () => {
    const ledger = buildDemoTrustLedger();
    const ledger2 = buildDemoTrustLedger();

    expect(ledger).toEqual(ledger2);
    expect(ledger.length).toBeGreaterThan(0);
  });

  it("should contain all expected layers", () => {
    const ledger = buildDemoTrustLedger();
    const labels = ledger.map((entry) => entry.label);

    expect(labels).toContain("Question Type Classification");
    expect(labels).toContain("Evidence Routing");
    expect(labels).toContain("Response Composition");
    expect(labels).toContain("Perspective Framing");
    expect(labels).toContain("Narrative Subject Mapping");
    expect(labels).toContain("Subject Normalization");
    expect(labels).toContain("Identity Resolution");
    expect(labels).toContain("Perspective Content Ordering");
  });

  it("should have no duplicate IDs", () => {
    const ledger = buildDemoTrustLedger();
    const ids = ledger.map((entry) => entry.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have all entries in APPLIED status and UI_ONLY scope", () => {
    const ledger = buildDemoTrustLedger();

    ledger.forEach((entry) => {
      expect(entry.status).toBe("APPLIED");
      expect(entry.scope).toBe("UI_ONLY");
      expect(entry.description.length).toBeGreaterThan(0);
    });
  });

  it("should maintain a specific order", () => {
    const ledger = buildDemoTrustLedger();
    const ids = ledger.map((entry) => entry.id);

    // Verify the specific order required
    expect(ids[0]).toBe("question-type-classification");
    expect(ids[1]).toBe("evidence-routing");
    expect(ids[2]).toBe("response-composition");
    expect(ids[3]).toBe("perspective-framing");
    expect(ids[4]).toBe("narrative-subject-mapping");
    expect(ids[5]).toBe("subject-normalization");
    expect(ids[6]).toBe("identity-resolution");
    expect(ids[7]).toBe("perspective-content-ordering");
  });
});
