import { describe, it, expect, vi } from "vitest";
import { SHADOW_MODE } from "../shadowMode";
import { LiveDataAdapter, mutatePatientData } from "../liveDataAdapter";
import { getPatientContext, getPatientTimeline } from "../dataSourceSelector";
import { DEMO_PATIENT_CONTEXT } from "../demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "../demoPatientTimeline";

describe("Shadow Mode & Live Data Adapter", () => {
  it("SHADOW_MODE should be true", () => {
    expect(SHADOW_MODE).toBe(true);
  });

  it("LiveDataAdapter should return read-only data", async () => {
    const context = await LiveDataAdapter.getPatientContextReadOnly("TEST-123");
    expect(context.patientId).toBe("TEST-123");
    expect(context.fullName).toBe(DEMO_PATIENT_CONTEXT.fullName);

    const timeline = await LiveDataAdapter.getPatientTimelineReadOnly("TEST-123");
    expect(timeline.patientId).toBe("TEST-123");
    expect(timeline.events).toEqual(DEMO_PATIENT_TIMELINE.events);
  });

  it("mutatePatientData should throw error", () => {
    expect(() => mutatePatientData()).toThrow(/Mutation attempted in SHADOW MODE/);
  });

  it("dataSourceSelector should return live data when SHADOW_MODE is true", async () => {
    // Since SHADOW_MODE is a constant true in the file, we just verify it uses LiveDataAdapter
    const context = await getPatientContext("PAT-LIVE");
    expect(context.patientId).toBe("PAT-LIVE");
    
    const timeline = await getPatientTimeline("PAT-LIVE");
    expect(timeline.patientId).toBe("PAT-LIVE");
  });
});
