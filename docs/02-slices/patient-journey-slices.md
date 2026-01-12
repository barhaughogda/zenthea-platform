# Patient Journey Execution Slices (Governing Document)

## 1. Purpose
### Why slices exist
Slices are the **unit of delivery** for the Zenthea platform. Unlike journey steps (which describe a narrative experience), slices describe **independently buildable, testable, and sealable units of code** that deliver specific behavior within governed boundaries.

### How they differ from journey steps
- **Journey Steps**: Describe the *what* and *why* from a user perspective.
- **Slices**: Describe the *how* from a governance and implementation perspective, grouping behavioral requirements into thin, vertical increments that can be verified against acceptance criteria.

---

## 2. Slice Extraction Rules
1. **One primary behavior per slice**: Each slice must focus on a single governed outcome (e.g., "Verification", "Proposal", "Draft").
2. **One or more stakeholders**: Every slice must map to roles defined in `docs/00-overview/stakeholders-and-user-stories.md`.
3. **Explicit governance boundaries**: No slice may bypass existing doctrine (e.g., Draft-only, Fail-closed, Consent-gated).
4. **Mechanical Traceability**: Every slice must be traceable to a journey step and specific user story IDs.
5. **Independent Readiness**: If a slice depends on an undocumented capability, it must be marked as "Deferred".

---

## 3. Slice Inventory

### SL-01: Patient Scoping & Consent Gate
- **Slice ID**: SL-01
- **Slice name**: Patient Scoping & Consent Gate
- **Journey step reference**: 3.2 Patient identity and scope
- **Stakeholders involved**: Patient, Consent Agent, Platform Security
- **User stories included**: PAT-02, PAT-04, PAT-06, PLATADM-01
- **Entry condition**: User (Patient or representative) initiates a request for patient-specific data or AI processing.
- **Exit condition**: Deterministic grant/deny decision based on identity, tenant scope, and consent verification.
- **Writes allowed?**: No
- **Risk level**: Medium (Access control boundary)
- **Demo suitability**: Yes (Show fail-closed behavior on missing consent)

> **Governance Note**: During SL-02 implementation, a missing deny reason (`IDENTITY_INVALID`) was identified in SL-01. No changes were made to SL-01 during SL-02 implementation to preserve slice isolation. Remediation will occur via a dedicated future slice.

### SL-02: Patient Record Inquiry (Read-Only Summary)
- **Slice ID**: SL-02
- **Slice name**: Patient Record Inquiry (Read-Only Summary)
- **Journey step reference**: 3.9 Patient post-visit understanding
- **Stakeholders involved**: Patient, Patient Portal Agent, Consent Agent
- **User stories included**: PAT-01, PAT-03, PAT-07, PAT-08
- **Entry condition**: SL-01 (Consent Gate) passed for record inquiry.
- **Exit condition**: Plain-language summary delivered with mandatory "Not Medical Advice" label and metadata-only audit emission.
- **Writes allowed?**: No
- **Risk level**: High (Potential for clinical misinformation/hallucination)
- **Demo suitability**: Yes

### SL-03: Patient Session Establishment
- **Slice ID**: SL-03
- **Slice name**: Patient Session Establishment
- **Journey step reference**: 3.2 Patient identity and scope
- **Stakeholders involved**: Patient, Consent Agent, Platform Security
- **User stories included**: PAT-02, PAT-04
- **Entry condition**: SL-01 passed for identity/tenant verification.
- **Exit condition**: Governed session context established; patient-scoped boundaries locked; initial consent state loaded.
- **Writes allowed?**: No
- **Risk level**: Medium
- **Demo suitability**: Yes

### SL-07: Scheduling Proposal (Patient-Initiated)
- **Slice ID**: SL-07
- **Slice name**: Scheduling Proposal (Patient-Initiated)
- **Journey step reference**: 3.3 Appointment request and booking
- **Stakeholders involved**: Patient, Appointment Booking Agent, Consent Agent
- **User stories included**: OPS-01, OPS-02, OPS-03
- **Entry condition**: SL-03 passed for scheduling domain.
- **Exit condition**: Structured proposal emitted to pending state; user informed of "Pending" status; no execution occurs.
- **Writes allowed?**: No (Proposal/Draft only)
- **Risk level**: Medium (Operational impact of "pending" status)
- **Demo suitability**: Yes

### SL-04: Clinical Drafting (Clinician-Initiated)
- **Slice ID**: SL-04
- **Slice name**: Clinical Drafting (Clinician-Initiated)
- **Journey step reference**: 3.5 Clinical encounter; 3.6 Documentation and review
- **Stakeholders involved**: Licensed Clinician, Clinical Documentation Agent, Consent Agent
- **User stories included**: CLIN-01, CLIN-03, CLIN-05, SAFETY-02
- **Entry condition**: Clinician initiates documentation support for an authenticated/consented encounter.
- **Exit condition**: AI-generated draft produced and clearly labeled as "Draft/Advisory" with evidence citations.
- **Writes allowed?**: No (Draft-only)
- **Risk level**: High (Clinical safety boundary)
- **Demo suitability**: Yes (Provider-facing view)

### SL-05: Clinical Draft Feedback (Signal Capture)
- **Slice ID**: SL-05
- **Slice name**: Clinical Draft Feedback (Signal Capture)
- **Journey step reference**: 3.6 Documentation and review
- **Stakeholders involved**: Licensed Clinician, Clinical Documentation Agent
- **User stories included**: CLIN-06
- **Entry condition**: AI-generated draft (SL-04) is presented to clinician for review.
- **Exit condition**: Clinician's edit/accept/reject decision captured as metadata-only audit event (no PHI).
- **Writes allowed?**: Yes (Metadata-only feedback)
- **Risk level**: Low
- **Demo suitability**: Yes

### SL-06: Billing State Explanation (Patient-Facing)
- **Slice ID**: SL-06
- **Slice name**: Billing State Explanation (Patient-Facing)
- **Journey step reference**: 3.8 Billing and insurance touchpoints
- **Stakeholders involved**: Patient, Billing domain service, Billing Staff (as domain owner)
- **User stories included**: BILL-04
- **Entry condition**: SL-01 passed for billing domain inquiry.
- **Exit condition**: Plain-language explanation of billing state delivered; "No financial action" boundary enforced.
- **Writes allowed?**: No
- **Risk level**: Medium (Financial clarity)
- **Demo suitability**: Yes

---

## 4. Explicit Non-Slices
Behaviors intentionally excluded or deferred to preserve governance.

- **Clinical Commitment / Attestation**: (MIG-04B) Explicitly forbidden for AI to sign, attest, or finalize clinical records.
- **Scheduling Execution**: The "governed gateway" and "approval" mechanics for committing a schedule change are not defined in governing docs.
- **Financial Transaction Execution**: AI is explicitly forbidden from initiating payments, refunds, or credits.
- **Intake Capture Surfaces**: Specific mechanics for how patients enter symptoms/history are not yet defined.
- **Orders/Referrals Execution**: The mechanics of downstream clinical actions (ordering labs, referrals) are advisory-only; execution surfaces are not defined.
- **Interoperability (HIE/HIN) Exchange**: External standard exchange mechanics are listed as gaps in governing docs.

---

## 5. Readiness Summary

### Slices suitable for early demo
- **SL-01**: Verification/Fail-closed proof.
- **SL-02**: Patient portal informational Q&A.
- **SL-03**: Patient session establishment.
- **SL-07**: Scheduling proposal flow (patient request).
- **SL-04/05**: Clinical drafting + feedback loop (provider view).
- **SL-06**: Billing explanation.

### Slices requiring governance or foundation work
- **Deferred — Missing Prerequisite**: Any "Execute" path for scheduling or billing. Requires definition of "Governed Gateways" and "Authoritative Domain Services".
- **Deferred — Missing Prerequisite**: Clinical Intake Capture. Requires definition of intake schemas and capture surfaces.
- **Blocked by Design**: Clinical Commitment (MIG-04B).

---

## Required Execution Report

- **Files read**: 
  - `docs/01-journeys/golden-path-patient-journey.md`
  - `docs/00-overview/stakeholders-and-user-stories.md`
  - `docs/00-overview/stakeholder-planning-artifacts.md`
- **File written**: `docs/02-slices/patient-journey-slices.md`
- **Number of slices extracted**: 7
- **Number marked demo-suitable**: 7
