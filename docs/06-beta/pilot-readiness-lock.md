# Pilot Readiness Lock: Zenthea Platform

## 1. Purpose of This Lock
This document establishes a formal freeze on the scope, behavior, and safety invariants of the Zenthea Platform for the duration of the Pilot phase. Its primary objective is to ensure environmental stability and safety for participating clinicians by preventing unauthorized feature expansion, architectural shifts, or changes to security protocols once onboarding commences.

## 2. Pilot Readiness Declaration
The Zenthea Platform is hereby declared **READY** for the Pilot phase. All core functional components required for the Mock Consultation Loop have passed dry-run validation, including the persistence adapter, AI drafting engine, and the pilot kill switch.

## 3. In-Scope Capabilities (Pilot Only)
The Pilot is strictly limited to the following capabilities:
- **Mock Consultation Loop**: Authentication, patient selection (mock data only), real-time transcription, AI SOAP draft generation, and manual editing.
- **Persistence of Finalized Notes**: Saving and retrieving clinical notes that have been explicitly signed and finalized by a human provider.
- **AI-Assisted Summarization**: Generation of context summaries from previous mock encounters within the selected patient profile.
- **Exporting**: Capability to download finalized notes in Markdown or PDF format for review.

## 4. Explicitly Out-of-Scope Capabilities
The following behaviors and integrations are strictly forbidden and non-existent during the Pilot:
- **PHI Handling**: Integration with real patient data or Protected Health Information (PHI).
- **EHR Integration**: Synchronizing data with any external Electronic Health Record system.
- **Clinical Decision Support**: Automated diagnosis, treatment recommendations, or prescription generation.
- **Billing and Coding**: Generation of CPT/ICD-10 codes or submission of insurance claims.
- **Automated Finalization**: Any system action that signs or finalizes a note without human intervention.

## 5. Frozen Safety Invariants
The following safety gates are frozen and cannot be modified or bypassed during the pilot:
- **PHI Isolation Gate**: Mandatory use of sandboxed environments and mock data identifiers.
- **Human-in-the-Loop**: Requirement for explicit human approval for every finalized document.
- **Transparency**: Clear labeling of all AI-generated content as "Draft" or "AI Suggested."
- **Kill Switch Availability**: Maintenance of a functional administrative override to disable the pilot environment instantly.

## 6. Frozen Technical Components
The following technical systems are locked:
- **Persistence Adapter**: Restricted to the `finalized-only` storage policy.
- **UI Interaction Model**: Adherence to the defined Mock Consultation Loop interaction steps.
- **Feature Flags**: Pilot-specific flags are locked to their validated states.

## 7. Change Control During Pilot
No new features, UI enhancements, or architectural modifications are permitted during the pilot phase. Changes are limited strictly to:
- **Emergency Bug Fixes**: Resolution of critical system failures that prevent completion of the Mock Consultation Loop.
- **Security Patches**: Mandatory updates to address verified vulnerabilities.
- **Performance Stabilization**: Minor adjustments to maintain latency within established thresholds (< 30s for draft generation).

## 8. Kill Switch Authority
Zenthea Engineering retains the absolute authority to trigger the Pilot Kill Switch. This action will be taken immediately if:
- A potential PHI leak is detected.
- System behavior diverges from the Frozen Safety Invariants.
- A critical security vulnerability is identified.

## 9. Scope Lock Statement
By order of this Readiness Lock, the Zenthea Pilot scope is finalized. No expansion of the persistence scope or UI behavior will be entertained until the formal conclusion of the pilot period and the subsequent post-pilot review.
