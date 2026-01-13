/**
 * DATA SOURCE SELECTOR
 * 
 * Bridges demo fixtures and live data adapters based on SHADOW_MODE flag.
 * This is the ONLY place where the data source should be selected.
 */

import { SHADOW_MODE } from "./shadowMode";
import { DEMO_PATIENT_CONTEXT, PatientContext } from "./demoPatientContext";
import { DEMO_PATIENT_TIMELINE, PatientTimeline } from "./demoPatientTimeline";
import { LiveDataAdapter } from "./liveDataAdapter";

export const getPatientContext = async (patientId: string = "DEMO-ID"): Promise<PatientContext> => {
  if (SHADOW_MODE) {
    return await LiveDataAdapter.getPatientContextReadOnly(patientId);
  }
  return DEMO_PATIENT_CONTEXT;
};

export const getPatientTimeline = async (patientId: string = "DEMO-ID"): Promise<PatientTimeline> => {
  if (SHADOW_MODE) {
    return await LiveDataAdapter.getPatientTimelineReadOnly(patientId);
  }
  return DEMO_PATIENT_TIMELINE;
};
