# E-05 — Failure Taxonomy & Abort Semantics

**Document ID:** E-05-FTAS  
**Mode:** GOVERNANCE / PHASE E — FAILURE DOMAIN  
**Status:** DRAFT (Design-Only; governance review required)  
**Authority:** Platform Governance (Phase E)  
**Prerequisites:** E-01 (ODS), E-03 (OIC), and E-04 (DRM) are authoritative and SEALED.  

---

## 0. Deterministic Interpretation Rules (Fail-Closed)

This document defines the **ONLY** allowed failure classifications for Phase E orchestration. It is a design-only specification.

Interpretation SHALL be fail-closed:

- Any failure event NOT explicitly mapped in Section 3 SHALL default to `ERROR` / `ORCHESTRATOR` / `NEVER`.
- Any ambiguity in failure classification SHALL be treated as **BLOCKING**.
- "Soft" failures, warnings, or silent retries are **STRICTLY PROHIBITED**.
- Metadata-only enforcement applies: no PII/PHI SHALL be emitted in failure reasons or metadata.

---

## 1. Canonical Failure Categories

All orchestration failures MUST be classified into exactly one of the following bounded categories:

1.  **INFRASTRUCTURE (INF):** Loss of dependency connectivity, heartbeat timeouts, or Control Plane unavailability.
2.  **POLICY (POL):** Explicit policy denial, version mismatch, or unresolved selection logic.
3.  **AUDIT (AUD):** Failure to emit, correlate, or receive acknowledgement for required audit signals.
4.  **CONTRACT (CON):** Malformed payloads, missing required fields, or version incompatibility between actors.
5.  **SECURITY (SEC):** Detection of sensitive data (PHI/PII), cache replay risk, or signal tampering.
6.  **OPERATOR (OPR):** Manual termination, decision timeout, or session expiration.
7.  **EXECUTION (EXE):** Invariant violations, non-idempotent side-effect risks, or step-level failures.

---

## 2. Failure Reason Code Table (Machine-Readable)

Reason codes are bounded and immutable. Extension requires a Phase E REOPEN.

| Code | Name | Category | Description |
| :--- | :--- | :--- | :--- |
| `INF-001` | DEP_UNAVAILABLE | INFRASTRUCTURE | Required dependency is unreachable or reporting NOT_READY. |
| `INF-002` | HEARTBEAT_TIMEOUT | INFRASTRUCTURE | Dependency signal exceeded the CP-21 safety window. |
| `POL-001` | POLICY_DENIED | POLICY | Explicit denial from Control Plane policy evaluation. |
| `POL-002` | VERSION_MISMATCH | POLICY | Actor version hash does not match Control Plane authority. |
| `AUD-001` | SINK_UNREACHABLE | AUDIT | Audit Sink cannot be contacted for signal emission. |
| `AUD-002` | AUDIT_NACK | AUDIT | Audit Sink returned a Negative Acknowledgment or correlation error. |
| `CON-001` | MALFORMED_PAYLOAD | CONTRACT | Payload failed schema validation or contains unknown fields. |
| `CON-002` | MISSING_FIELD | CONTRACT | A REQUIRED contract field (E-03) is absent. |
| `SEC-001` | SENSITIVE_DATA | SECURITY | Detection of PHI/PII or forbidden identifiers in metadata. |
| `SEC-002` | CACHE_REPLAY | SECURITY | Detection of unauthorized cache hit or replay risk (CP-21). |
| `OPR-001` | MANUAL_STOP | OPERATOR | Explicit termination signal from the Operator Surface. |
| `OPR-002` | DECISION_TIMEOUT | OPERATOR | PAUSED state exceeded the maximum allowed human-in-the-loop window. |
| `EXE-001` | INVARIANT_VIOL | EXECUTION | Violation of an E-01 Section 9 Design Invariant. |
| `EXE-002` | STEP_FAILURE | EXECUTION | Non-retryable execution error within a governed service/agent. |

---

## 3. Abort Semantics

When a failure condition is met, the system MUST execute an **Immediate Abort**.

### 3.1 Immediate Actions (The "Stop" Sequence)
1.  **Freeze State:** All in-progress execution steps MUST be immediately frozen.
2.  **Emit Abort Signal:** An `OrchestrationAbort` signal (E-03 1.5) MUST be emitted to the Audit Sink.
3.  **Transition State:** The attempt MUST transition to a terminal state (`ERROR`, `BLOCKED`, `REJECTED`, or `CANCELLED`).
4.  **Wipe Ephemeral Context:** Non-persistent execution context MUST be cleared.

### 3.2 Forbidden Behaviors during Abort
- Orchestration SHALL NOT attempt to "cleanup" or "roll back" if doing so involves non-idempotent mutations.
- Orchestration SHALL NOT wait for non-critical dependency timeouts before aborting.
- Orchestration SHALL NOT mask the root cause code with generic error messages.

---

## 4. Retry & Re-entry Rules

### 4.1 Default: NEVER
Retry is **FORBIDDEN** for all `ERROR` and `REJECTED` states. Any correction requires a new `OrchestrationTrigger` with a unique `trigger_id`.

### 4.2 Exception: OPERATOR_ONLY
Re-entry is permitted **ONLY** via the `PAUSED -> GATED` transition (E-01 4.3), which requires:
- Explicit operator action.
- Full re-evaluation of the Policy Gate.
- Re-validation of all Dependency Readiness (E-04).

---

## 5. Audit Requirements per Failure Class

Every abort MUST emit a metadata bundle containing:
- `orchestration_attempt_id`
- `reason_code` (from Section 2)
- `stop_authority` (assigned in Section 7)
- `last_known_state`
- `timestamp`

| Failure Class | Mandatory Audit Detail |
| :--- | :--- |
| **INFRASTRUCTURE** | Identifier of the unavailable/timed-out dependency. |
| **POLICY** | `policy_id` and `policy_version` that triggered the denial/mismatch. |
| **SECURITY** | The specific boundary violated (e.g., `PHI_DETECTION`). No raw data. |
| **EXECUTION** | `step_id` where the failure occurred. |

---

## 6. Design Invariants & Prohibitions

- **No Implicit Retries:** The orchestrator SHALL NOT automate retries for any reason.
- **Authority Priority:** `CONTROL_PLANE` authority overrides all others.
- **Fail-Closed on Audit:** Failure to audit an abort is a **Critical System Failure** requiring a platform-wide execution block.
- **Ambiguity = Error:** Any unknown or malformed failure code MUST be treated as an `EXE-001` (Invariant Violation).

---

## 7. Mapping Table: Failure → Abort → Authority → Recovery

This table defines the deterministic resolution for all failure types.

| Code | Abort Outcome | Stop Authority | Retryability | Terminal State (E-01) |
| :--- | :--- | :--- | :--- | :--- |
| `INF-001` | BLOCKED | ORCHESTRATOR | OPERATOR_ONLY | BLOCKED |
| `INF-002` | BLOCKED | ORCHESTRATOR | OPERATOR_ONLY | BLOCKED |
| `POL-001` | ERROR | CONTROL_PLANE | NEVER | REJECTED |
| `POL-002` | ERROR | CONTROL_PLANE | NEVER | BLOCKED |
| `AUD-001` | BLOCKED | ORCHESTRATOR | OPERATOR_ONLY | BLOCKED |
| `AUD-002` | ERROR | ORCHESTRATOR | NEVER | ERROR |
| `CON-001` | ERROR | ORCHESTRATOR | NEVER | ERROR |
| `CON-002` | ERROR | ORCHESTRATOR | NEVER | ERROR |
| `SEC-001` | ERROR | CONTROL_PLANE | NEVER | ERROR |
| `SEC-002` | ERROR | CONTROL_PLANE | NEVER | ERROR |
| `OPR-001` | ERROR | OPERATOR | NEVER | CANCELLED |
| `OPR-002` | ERROR | ORCHESTRATOR | NEVER | ERROR |
| `EXE-001` | ERROR | ORCHESTRATOR | NEVER | ERROR |
| `EXE-002` | ERROR | ORCHESTRATOR | NEVER | ERROR |

---

## 8. Summary of Fail-Closed Outcomes

- **All unknown failures:** Transition to `ERROR`, Authority `ORCHESTRATOR`, Retry `NEVER`.
- **MIG-06 Posture:** Any attempt to execute a `MIG-06` trigger prior to Phase E exit criteria being met SHALL result in a `POL-001` (Policy Denied) abort.
