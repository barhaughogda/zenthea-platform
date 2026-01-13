/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * This file contains a static, read-only patient timeline fixture for demo purposes.
 * It is used to GROUND the non-executing assistant in a realistic historical context.
 */

export interface TimelineEvent {
  date: string;
  type: 'visit' | 'note' | 'event';
  title: string;
  summary: string;
}

export interface PatientTimeline {
  patientId: string;
  events: TimelineEvent[];
}

export const DEMO_PATIENT_TIMELINE: PatientTimeline = {
  patientId: "PAT-12345",
  events: [
    {
      date: "2025-11-20",
      type: "visit",
      title: "Routine Follow-up (Hypertension)",
      summary: "Blood pressure stable at 128/82. Medication adherence confirmed. Patient reported mild seasonal allergies."
    },
    {
      date: "2025-11-20",
      type: "note",
      title: "Care Plan Update",
      summary: "Continue current regimen. Added Cetirizine as needed for seasonal symptoms. Next follow-up in 3-6 months."
    },
    {
      date: "2025-08-15",
      type: "visit",
      title: "Urgent Care - Low Back Pain",
      summary: "Patient presented with acute lower back strain after gardening. No neurological deficits. Recommended physical therapy and NSAIDs."
    },
    {
      date: "2025-08-16",
      type: "event",
      title: "Referral: Physical Therapy",
      summary: "Referral sent to City Rehabilitation for 6 sessions of PT for lumbar strain."
    },
    {
      date: "2025-05-10",
      type: "visit",
      title: "Annual Wellness Visit",
      summary: "Comprehensive review. HbA1c 6.8% (stable). Discussed weight management and nutrition. Labs ordered."
    },
    {
      date: "2025-05-11",
      type: "event",
      title: "Lab Results: HbA1c & CMP",
      summary: "HbA1c: 6.8%. CMP within normal limits except for slightly elevated fasting glucose (112 mg/dL)."
    }
  ]
};

/**
 * Derived Relevance Summary
 * This is explanatory text only, not inference or diagnosis.
 */
export const getRelevanceSummary = (timeline: PatientTimeline) => {
  const sortedEvents = [...timeline.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mostRecentVisit = sortedEvents.find(e => e.type === 'visit');
  
  return {
    mostRecentVisit: mostRecentVisit ? `${mostRecentVisit.date}: ${mostRecentVisit.title}` : "No visits recorded",
    relevantContext: "Patient has ongoing management for Hypertension and Type 2 Diabetes. Recent history includes a back strain (Aug 2025) which may be relevant if patient reports new mobility or pain issues.",
    potentialGaps: "No record of physical therapy completion in timeline. Last HbA1c was over 6 months ago (May 2025)."
  };
};
