# E-06 — Observability & Traceability Requirements

**Document ID:** E-06-OTR  
**Mode:** GOVERNANCE / PHASE E — OBSERVABILITY & TRACEABILITY  
**Status:** DRAFT (Design-Only; governance review required)  
**Authority:** Platform Governance (Phase E)  
**Prerequisites:** E-01 (ODS), E-03 (OIC), E-04 (DRM), and E-05 (FTAS) are authoritative.  
**Scope:** Defines the mandatory observability signals and correlation rules required to maintain governance control over Phase E orchestration.

---

## 0. Deterministic Interpretation Rules (Fail-Closed)

This document defines the **authoritative requirements** for observability and traceability. It is a design-only specification.

Interpretation SHALL be fail-closed:

- Any missing, malformed, or uncorrelated signal SHALL be treated as a **Critical System Failure**.
- Any observability gap SHALL result in an **Immediate Abort** as defined in E-05.
- "Best-effort" tracing or sampling for governance-gated signals is **STRICTLY PROHIBITED**.
- Metadata-only enforcement applies: no PHI/PII SHALL be emitted in traces, logs, or metrics.

---

## 1. Canonical Correlation Identifiers

Every orchestration attempt MUST be uniquely and deterministically identified across all actors. These identifiers SHALL NOT be inferred; they MUST be explicitly passed in every request and emitted in every signal.

| Identifier | Description | Propagation Rule |
| :--- | :--- | :--- |
| `orchestration_attempt_id` | Stable UUID for the entire orchestration lifecycle. | MUST be included in every signal and DTO. |
| `trigger_id` | Stable UUID of the originating event (E-03 1.1). | MUST be linked to the `attempt_id` in Phase 1. |
| `trace_id` | Distributed trace correlation ID (W3C TraceContext). | MUST be forwarded across all service/agent boundaries. |
| `audit_id` | Stable UUID for correlation with the governed Audit Sink. | MUST be verified before entering Phase 4 (Execution). |
| `policy_decision_id` | Unique ID of the CP policy evaluation outcome. | MUST be emitted by the Policy Gate (Phase 3). |

---

## 2. Mandatory Observability Signals per Lifecycle Phase

Orchestration SHALL NOT progress to a subsequent phase until the signals for the current phase are confirmed as emitted and accepted.

### 2.1 Trigger Intake (Phase 1)
- **Signal:** `TRIGGER_RECEIVED`
- **Required Data:** `trigger_id`, `classification`, `timestamp`.
- **Constraint:** Failure to emit this signal SHALL prevent entering the `VALIDATING` state.

### 2.2 Readiness Validation (Phase 2)
- **Signal:** `READINESS_VALIDATED`
- **Required Data:** `attempt_id`, dependency health status, version hashes.
- **Constraint:** Any `NOT_READY` dependency (E-04) SHALL emit `INF-001` and abort.

### 2.3 Policy Evaluation (Phase 3)
- **Signal:** `POLICY_EVALUATED`
- **Required Data:** `policy_id`, `policy_version`, `outcome` [ALLOW/DENY], `policy_decision_id`.
- **Constraint:** Missing policy evidence SHALL result in a `POL-001` abort.

### 2.4 Execution (Phase 4)
- **Signal:** `STEP_STARTED` / `STEP_COMPLETED`
- **Required Data:** `command_id`, `step_type`, `idempotency_key`.
- **Constraint:** Every step MUST be explicitly bounded. "Silent" execution is an invariant violation (`EXE-001`).

### 2.5 Abort (State Transition)
- **Signal:** `ORCHESTRATION_ABORTED`
- **Required Data:** `reason_code` (E-05), `stop_authority`, `last_known_state`.
- **Constraint:** This signal is the **HIGHEST PRIORITY** and MUST bypass all buffering.

### 2.6 Completion (Phase 6)
- **Signal:** `ATTEMPT_COMPLETED`
- **Required Data:** `terminal_outcome`, `audit_correlation_id`.
- **Constraint:** Transition to `SUCCEEDED` is FORBIDDEN without confirmed audit acceptance.

---

## 3. Trace Propagation Rules

Trace context MUST be propagated across all logical and physical boundaries without modification.

- **Forwarding:** Actors MUST forward the `trace_id` and `span_id` in all headers.
- **Sanitization:** Actors MUST NOT include PHI/PII in trace baggage or tags.
- **Continuity:** A break in trace continuity SHALL be treated as a `CON-001` (Malformed Payload) error.
- **External Boundaries:** Any call to an external service MUST include the `trace_id` for audit reconciliation.

---

## 4. Audit vs Trace vs Metric Boundaries

To ensure auditability without noise, observability signals SHALL be separated into distinct domains:

| Domain | Content | Persistence | Reliability Requirement |
| :--- | :--- | :--- | :--- |
| **Audit** | Immutable state transitions and policy decisions. | Permanent / Regulatory | **Synchronous / Guaranteed** |
| **Trace** | Causal relationship between service calls. | Ephemeral / Debugging | **Asynchronous / Required** |
| **Metric** | Aggregated performance and error rates. | Statistical | **Best-effort / Statistical** |

**Note:** Governance decisions (Fail-Closed) SHALL ONLY rely on **Audit** and **Trace** domains. **Metrics** SHALL NOT be used for execution gating.

---

## 5. Failure Conditions Triggered by Observability Violations

The following observability gaps are **BLOCKING** and MUST trigger immediate abort:

1.  **Correlation Break:** Received a command or response with a missing or mismatched `attempt_id`.
2.  **Audit NACK:** The Audit Sink fails to acknowledge a `StateTransitionRecorded` event.
3.  **Signal Latency:** A required signal is not observed within the `CP-21` safety window.
4.  **PII Leak Detection:** Detection of any sensitive identifier in a log or trace field.
5.  **Sampling Attempt:** Any detection of a trace being sampled out for a governed path.

---

## 6. Design Invariants & Explicit Prohibitions

- **No Sampling:** sampling of governance-grade traces is **FORBIDDEN**. 100% of orchestration traces MUST be captured.
- **No Inferred Success:** Lack of an error log SHALL NOT be interpreted as success. Positive evidence (`STEP_COMPLETED`) is required.
- **No PHI in Metadata:** The use of Tenant ID, Patient ID, or User ID in `trace_id` or `span_id` generation is **FORBIDDEN**.
- **No Execution Continuity without Correlation:** If the `trace_id` is lost, execution MUST stop immediately (`EXE-001`).

---

## 7. Summary Table: Signal → Phase → Authority → Failure Code (E-05)

| Signal | Lifecycle Phase | Authority | Failure Code (E-05) |
| :--- | :--- | :--- | :--- |
| Missing `trigger_id` | Trigger (P1) | ORCHESTRATOR | `CON-002` |
| Expired Heartbeat | Validation (P2) | ORCHESTRATOR | `INF-002` |
| Policy Signal Loss | Policy Gate (P3) | CONTROL_PLANE | `POL-001` |
| Uncorrelated Command | Execution (P4) | ORCHESTRATOR | `EXE-001` |
| Audit ACK Failure | Audit (P5) | ORCHESTRATOR | `AUD-002` |
| Trace Continuity Break | Any | ORCHESTRATOR | `EXE-001` |

---

## 8. Stop Conditions Met

- **Design-only:** No implementation code or vendor-specific configurations.
- **Fail-Closed:** All gaps map to terminal states in E-01 and failure codes in E-05.
- **Metadata-only:** No PII/PHI allowed in any field.
- **MIG-06 Blocking:** Governance signals are required for any MIG-06 classification, and their absence prevents execution.
