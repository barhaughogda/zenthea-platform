# G-01 Scheduling Execution Slice (Provider-Confirmed)

## 1. Slice Identity
- **Slice ID:** G-01
- **Name:** Scheduling Execution — Provider Confirmed
- **Phase:** G (Execution)
- **Status:** Design-only (Execution Authorized by Governance, Not Implemented)

## 2. Purpose and Scope
- **Single Execution:** This slice defines the governance and trust boundary for the irreversible commitment of a scheduling action (appointment creation, modification, or cancellation) to an authoritative external system of record.
- **Enables:** The transition from a provider-approved decision (SL-08) to a committed external state change that is visible to and relied upon by actors outside the Zenthea platform.
- **Does NOT enable:** This slice explicitly excludes autonomous scheduling, patient-only scheduling without provider oversight, batch processing of appointments, or any execution that bypasses the established governance gates (SL-01 through SL-08).

## 3. Preconditions (Hard Gates)
Execution SHALL NOT proceed unless all following conditions are met. Failure of any gate is BLOCKING:
- **Valid SL-07 Proposal:** A structured, non-executing scheduling request initiated by the patient.
- **Completed SL-08 Provider Approval:** An explicit, attributable human decision from an authorized provider or staff member.
- **Active SL-03 PatientSessionContext:** Deterministic verification of patient identity and tenant scope.
- **Valid SL-01 Consent:** Verified active consent for scheduling-related data processing.
- **F-03 Listening/Consent UX Satisfied:** User-visible indicators confirm the system is in the correct state for interaction.
- **F-04 Audit Pipeline Ready:** The audit system is available and has acknowledged the execution attempt signal.
- **F-05 Compensation Path Defined:** A documented corrective action path exists for this specific execution type.

## 4. Authority Model
- **Request Authority:** The patient (initiator of the SL-07 proposal).
- **Approval Authority:** An authenticated human provider or authorized practice staff member. This authority is non-delegable to AI.
- **Execution Authority:** The platform orchestration layer, acting solely as a proxy for the human-approved decision.
- **AI Limitation:** AI agents are strictly prohibited from authorizing execution. AI may assist in orchestration but cannot confer authority.

## 5. Execution Definition
- **Irreversible Boundary:** The moment the platform transmits the commit command to the external system of record.
- **Commitment Point:** Execution is defined as "committed" once the external system returns a success acknowledgement AND the platform records the outcome in the F-04 audit trail.
- **External System of Record:** The authoritative Practice Management System (PMS), Electronic Health Record (EHR), or external scheduling platform.

## 6. Failure Semantics
- **Pre-execution Failure:** Any gate failure results in a blocked attempt. No external state change occurs.
- **Mid-execution Failure:** Interruption during the commit phase (e.g., timeout). The state is indeterminate and requires manual reconciliation or F-05 compensation.
- **Post-execution Inconsistency:** Discovery of a discrepancy after a successful commit. Resolved exclusively via F-05 compensation (additive correction).
- **Failure Posture:** Fail-closed. In any state of uncertainty, the platform assumes execution has not occurred and blocks subsequent attempts until human intervention.

## 7. Audit & Evidence
- **Pre-execution Evidence:** Cryptographic or logical proof of SL-01 through SL-08 gate satisfaction.
- **In-flight Evidence:** Emission of an execution-attempt signal containing a unique intent ID and high-precision timestamp.
- **Post-execution Evidence:** Confirmation of success or failure from the external system, persisted in the F-04 audit log.
- **Non-omittability:** Execution is considered invalid if the corresponding audit signal is not acknowledged by the audit pipeline.

## 8. User Experience Implications
- **Patient Communication:** Patients must be clearly informed that an appointment is "Confirmed" only after external commitment is verified.
- **Provider Confirmation:** Providers must receive explicit feedback that their decision has been committed to the system of record.
- **Prohibition of Silent Execution:** Every execution attempt and outcome must be visible to the relevant actors. Silent background booking is forbidden.

## 9. Explicit Prohibitions
- **No Batch Execution:** Each scheduling action must be processed and audited individually.
- **No Auto-Approval:** Absence of provider rejection does not constitute approval for execution.
- **No Voice-Only Execution:** Voice intent must be mapped to a visible proposal and confirmed via a governed UI interaction.
- **No Retry without Re-approval:** Failed execution attempts require human re-evaluation before a new attempt is permitted.
- **No Rollback without Compensation:** Successful or partially successful actions must be reversed via new, additive compensatory actions (F-05), never via deletion.

## 10. Out of Scope
- **UI/UX Design:** No wireframes, mockups, or component specifications.
- **API/Protocol:** No endpoint definitions or request/response schemas.
- **Schema/Model:** No database tables or internal data structures.
- **Integrations:** No specific code for EHR/PMS connectors.
- **Timelines:** No implementation dates or project management milestones.

## 11. Exit Criteria
Before implementation is authorized:
- Formal sealing of this G-01 design artifact.
- Governance board review of the single irreversible execution path.
- Proof of compatibility with the F-04 audit and F-05 compensation models.
- Clinical safety review of the failure and reconciliation semantics.

## 12. Closing Governance Statement
This document authorizes understanding and execution eligibility only. It does not authorize implementation.

**END OF ARTIFACT**
