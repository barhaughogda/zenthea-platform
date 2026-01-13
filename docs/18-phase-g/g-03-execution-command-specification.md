# G-03 — Execution Command Specification (Design-Only)

**Document ID:** G-03-ECS  
**Mode:** GOVERNANCE / PHASE G — EXECUTION COMMAND SPEC (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase G)  
**Depends On:** Phase E (Non-Executing Orchestration), Phase F (F-04, F-05), G-01, G-02  

---

## 1. Document Intent and Non-Authorization Statement

This document is a design-only governance artifact. It defines the minimum, conceptual requirements for an Execution Command as it crosses the G-02 Execution Adapter Boundary.

This document explicitly does NOT authorize:

- Any implementation of any kind (no code, no infrastructure, no integrations)
- Any schema, event payload, or contract definition
- Any API, endpoint, protocol, queue, or transport mechanism
- Any storage design, persistence model, or database choice
- Any cryptographic algorithm, token format, signature format, or integrity mechanism
- Any vendor, product, or system selection
- Any execution capability of any kind

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is FORBIDDEN.
- Any ambiguity is BLOCKING.
- Fail-closed posture is mandatory.
- Deny-by-default is mandatory.

This document is for understanding and governance design only. It does not authorize building, deploying, or operating execution pathways.

---

## 2. Definitions

- **Execution Command**: A fully specified, human-approved instruction that, when transmitted through the G-02 Execution Adapter, may cause an irreversible external state change in an authoritative system of record.
- **Command Envelope**: The conceptual wrapper that carries an Execution Command plus references required for governance verification (approval and evidence) and correlation (audit correlation). The envelope is not a schema and does not specify a format.
- **Evidence Reference**: A logical reference to the evidence chain defined by F-04 that proves preconditions were satisfied and that the execution attempt and outcome are recorded. Evidence references are pointers, not payloads.
- **Approval Reference**: A logical reference to the explicit human approval decision (for G-01, SL-08) that authorizes a specific command issuance. Approval references are specific to the command and are not blanket approvals.
- **Irreversibility Boundary**: The moment an Execution Command is transmitted to an external system such that external visibility, permanence, or reliance can occur. This boundary is defined by G-01 for the scheduling slice and is enforced by the G-02 adapter boundary.
- **Indeterminate Outcome**: A recorded outcome classification where the platform cannot confirm success or failure of external execution from evidence alone (for example: timeout, ambiguous external response, or platform-side interruption). Under indeterminate outcome, the system blocks further attempts pending reconciliation.

AI authority exclusion is absolute:

- AI is not an authority.
- AI cannot originate an Execution Command without explicit human approval.
- AI cannot approve, issue, transmit, or trigger execution.

---

## 3. Command Lifecycle (Conceptual, NOT implementation)

### 3.1 Preconditions and gating (fail-closed)

An Execution Command exists only after governance gates are satisfied. The following gates are conceptually required before any command issuance is considered valid:

- SL-03 PatientSessionContext is active and within tenant scope.
- SL-01 consent gate is satisfied.
- SL-08 explicit human approval exists and is attributable (for G-01 scheduling execution).
- F-04 audit and evidence readiness is confirmed (audit is a prerequisite, not a side effect).
- The command is intended to cross the G-02 Execution Adapter Boundary and MUST comply with G-02 prohibitions (no inference, no retries, no silent execution).

Execution without evidence is invalid.

### 3.2 State progression (conceptual)

The Execution Command lifecycle is defined conceptually as:

Drafted -> Approved -> Issued -> Transmitted -> Acknowledged / Failed / Indeterminate -> Reconciled

Definitions of states:

- **Drafted**: A command is assembled conceptually with all required references present. Drafted is not executable and has no authority.
- **Approved**: A specific, attributable human approval decision exists that authorizes issuance of this command. Approval is explicit and linked by reference.
- **Issued**: The command is released for transmission to the execution boundary. Issuance is a governed act and MUST be evidence-linked.
- **Transmitted**: The command is handed to the execution boundary for delivery to an external system. Transmission does not specify transport.
- **Acknowledged**: Evidence exists that the external system accepted and confirmed the action, and the platform recorded the outcome evidence per F-04.
- **Failed**: Evidence exists that the external system rejected the action, and the platform recorded the outcome evidence per F-04.
- **Indeterminate**: Evidence cannot establish success or failure. Indeterminate is not success and is not treated as failure. It is a blocked condition.
- **Reconciled**: Human review has determined external reality and recorded the reconciliation result with evidence, including any required compensation path per F-05.

Under any uncertainty, assume non-execution under uncertainty.

---

## 4. Required Invariants (Hard Constraints)

The following constraints are mandatory and non-negotiable:

- **Single-use and non-replayable**: A command is valid for one issuance attempt only. Reuse is forbidden conceptually. This document does not define how non-replay is implemented.
- **Fully specified**: A command contains all meaning required for execution. The adapter must not infer, default, enrich, transform, or interpret missing intent.
- **Approval-linked**: Human approval must be explicitly linked to the command by Approval Reference. Absence of rejection is not approval. Timeout is not approval.
- **Evidence-before-transmission**: Evidence references required by F-04 must exist and be acknowledged before any transmission is considered valid.
- **Outcome recorded or incomplete**: An execution attempt without recorded outcome evidence is treated as incomplete and anomalous. It is not treated as success.

---

## 5. Minimum Required Fields (Conceptual Only, No Schema)

The following conceptual fields must exist in the command envelope. Names are logical identifiers only; no formats are defined.

| Field Name | Meaning | Constraint |
|---|---|---|
| commandId | Logical identifier for this command instance | Unique for the attempt; no format defined |
| sliceId | Governing slice identifier | Must be a known slice (for example: G-01) |
| tenantId | Tenant scope identifier | Must match the active SL-03 context |
| patientId (or patientRef) | Patient identifier or logical reference | Must be within tenant scope; PHI is excluded |
| proposerRef | Link to the originating proposal (for example: SL-07) when applicable | Must exist when a proposal is the source of intent |
| approvalRef | Link to the explicit human approval decision (for example: SL-08) | Must be specific to this action; AI is excluded |
| evidenceRef | Link to the F-04 evidence chain | Must exist and be acknowledged before transmission |
| requestedAction | Human-readable action name | No payload; no parameter schema; no implicit meaning |
| issuedAt | Conceptual issuance time | Must exist; no format defined |
| expiresAt | Conceptual expiration time | Must exist; expired commands are invalid |
| issuerIdentity | Identity of issuer | Must be human or a system proxy operating under explicit human approval; AI is excluded |
| executionAdapterRef | Logical pointer to the G-02 boundary instance | Not a URL; not a network address; not a vendor mapping |
| compensationPolicyRef | Reference to the applicable F-05 compensation model | Must exist for actions that cross the irreversibility boundary |
| auditCorrelationRef | Correlation handle for audit/trace linkage | Metadata-only; must contain no PHI |

---

## 6. Validation Rules (Fail-Closed)

Validation is fail-closed. On any validation failure, the default outcome is denial or blockage.

- Missing or invalid references (approvalRef, evidenceRef, executionAdapterRef, compensationPolicyRef) result in DENY or ERROR. Ambiguity is BLOCKING.
- Tenant mismatch (tenantId does not match active scope) results in DENY.
- Expired command (expiresAt is in the past conceptually) results in DENY.
- Approval mismatch (approvalRef does not authorize requestedAction for this patient and tenant) results in DENY.
- Evidence not acknowledged results in ERROR (blocked). Execution is not permitted while evidence readiness is unconfirmed.
- Indeterminate external response results in INDETERMINATE and blocks further attempts pending reconciliation.

The system records denials and errors as evidence outcomes under F-04. Denial is a governed outcome. Error is a governed outcome.

---

## 7. Explicit Prohibitions

The following are explicitly prohibited:

- No adapter inference (no defaults, enrichment, transformation, or interpretation)
- No background retries
- No queueing for later execution
- No silent execution
- No AI-originated execution
- No execution from voice alone
- No implicit approvals
- No mutation, erasure, or overwriting of evidence

---

## 8. Out of Scope

This document does not define:

- Event schemas, command schemas, or payload formats
- Storage, databases, or retention mechanisms
- Cryptography, signing, or token formats
- API surfaces, transports, or protocols
- Vendor or external system mapping

---

## 9. Exit Criteria (Design-Only)

Before any implementation is even considered, all of the following must exist:

- Governance locks for G-01, G-02, and G-03
- Sealed F-04 and F-05 artifacts
- Security review signoff
- Clinical safety review signoff
- An explicit governance unblock artifact (separate future document)

Until those conditions exist, execution remains blocked.

---

## 10. Closing Governance Statement

This document defines the minimum conceptual specification for an Execution Command as a governed artifact that may cross the execution boundary.

This document authorizes understanding and governance design only. It does not authorize implementation or execution.

---

*Document ID: G-03-ECS*  
*Authority: Platform Governance (Phase G)*  
*Status: Design-Only - No Implementation Authorized*

---

**END OF ARTIFACT**

