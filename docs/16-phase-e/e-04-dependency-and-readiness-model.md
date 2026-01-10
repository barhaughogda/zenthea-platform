# E-04 — Dependency & Readiness Model

**Document ID:** E-04-DRM  
**Mode:** GOVERNANCE / PHASE E — ORCHESTRATION READINESS  
**Status:** DRAFT (Design-Only; governance review required)  
**Scope:** Defines the mandatory dependency graph and readiness conditions required before any Phase-E orchestration may initiate.  
**Authority:** Platform Governance (Phase E)  
**Prerequisites:** E-01 (ODS) is authoritative; CP-21 is SEALED.

---

## 0. Deterministic Interpretation Rules (Fail-Closed)

This document is a **governance document**. It defines mandatory readiness criteria. It does not define implementation, runtime logic, or code.

Interpretation SHALL be fail-closed:

- Any missing signal, unverified dependency, or ambiguous readiness state SHALL be treated as **BLOCKING**.
- Any attempt to bypass readiness validation SHALL be treated as a **Critical Invariant Violation**.
- "Best-effort" or "Partial" readiness is **FORBIDDEN**.

---

## 1. Dependency Inventory & Authority

The following dependencies SHALL be treated as mandatory for any orchestration lifecycle. Each dependency is governed by an authoritative owner responsible for providing the readiness signals defined in Section 2.

| Dependency | Authoritative Owner | Role in Orchestration |
| :--- | :--- | :--- |
| **Control Plane** | Platform Governance / Infrastructure | Authoritative source of truth for policy, versioning, and mutation gating. |
| **Policy Engine** | Security & Compliance | Evaluator of orchestration triggers against deterministic policy sets. |
| **Audit Sink** | Compliance Operations | Immutable target for all metadata-only audit signals; MUST acknowledge receipt. |
| **Operator Surface** | Platform Operations | The human-in-the-loop interface required for initiation, pause, and stop authority. |
| **Agent Runtime** | AI Runtime Governance | The execution boundary for governed agent participants. |

---

## 2. Readiness Signals & Validation Rules

Orchestration SHALL NOT initiate unless all the following readiness signals are validated as **POSITIVE** and **CURRENT**.

### 2.1 Mandatory Signals

1.  **Availability Signal (Heartbeat):** Each dependency MUST provide a synchronous, non-cached availability signal with a maximum allowed latency (defined by CP-21).
2.  **Version Consistency Signal:** Each dependency MUST report its current version hash. This hash MUST match the authoritative version selected by the Control Plane.
3.  **Audit Connectivity Signal:** The Audit Sink MUST acknowledge a readiness-test signal before any Trigger is accepted.
4.  **Operator Presence Signal:** The Operator Surface MUST signal that a human-in-the-loop is active and available for escalation.

### 2.2 Validation Rules

- **Signal Expiry:** Any signal older than the bounded heartbeat interval SHALL be treated as **EXPIRED** and **BLOCKING**.
- **Evidence-Only:** Readiness SHALL NOT be inferred from previous success or lack of error. Positive evidence MUST be retrieved for every attempt.
- **Atomic Validation:** Validation SHALL be atomic. If any single dependency fails validation, the entire system state for orchestration SHALL be marked as **NOT_READY**.

---

## 3. Degraded vs Blocking States

The system SHALL recognize only two readiness states for orchestration: **READY** and **NOT_READY**.

### 3.1 Blocking States (NOT_READY)

The following conditions SHALL force a **NOT_READY** state and block all orchestration:

- Any dependency defined in Section 1 is unreachable or degraded.
- Any version mismatch between reporting dependencies and Control Plane authority.
- Audit Sink failure to acknowledge signals.
- Security boundary or policy engine instability.

### 3.2 Prohibited "Tolerated" States

- **Degraded Execution:** Executing with a missing or degraded dependency is **FORBIDDEN**.
- **Partial Readiness:** Orchestration SHALL NOT initiate if only a subset of dependencies are ready.
- **Best-Effort Delivery:** Audit signals MUST NOT use "best-effort" delivery; they MUST be guaranteed and accepted or execution SHALL block.

---

## 4. Cold-Start and Restart Semantics

To prevent implicit state inheritance or "phantom" readiness, the following semantics SHALL be enforced:

### 4.1 Bootstrap Behavior (Cold-Start)

- Every system startup or orchestration service restart SHALL be treated as a **Cold-Start**.
- A Cold-Start MUST perform a full, recursive dependency validation sweep as defined in Section 2.
- The system SHALL remain in a **FAIL_CLOSED** state until all validation rules are satisfied.

### 4.2 Forbidden Persistence

- **No Resume-from-Memory:** Readiness states SHALL NOT be persisted across restarts.
- **No Implicit Readiness:** Previous readiness status is irrelevant. A restart invalidates all previous validation evidence.
- **Memory Wipe:** Upon any detected instability or restart, all active orchestration context (non-persistent) SHALL be wiped to prevent corrupted resumption.

---

## 5. Explicit Prohibitions

The following behaviors are **STRICTLY FORBIDDEN** under this model:

1.  **Background Orchestration:** Orchestration SHALL NOT run as a background task, service, or daemon without an active, observed Operator Presence Signal.
2.  **Queue-Driven Retries:** Initiation SHALL NOT be retried via automated queues if the initial readiness check fails.
3.  **Time-Based Assumptions:** Readiness SHALL NOT be assumed based on time elapsed since last check.
4.  **Autonomous Initiation:** The system SHALL NOT self-initiate orchestration based on internal timers or heuristics.
5.  **Implicit Scaling:** Orchestration SHALL NOT scale its own resource dependencies or permissions.

---

## 6. Fail-Closed Guarantees

The following conditions SHALL force an **Immediate Abort** and transition the attempt to **BLOCKED**:

1.  **Signal Loss:** Loss of any dependency signal for a duration exceeding the CP-21 safety window.
2.  **Policy Timeout:** Failure of the Policy Engine to return a deterministic decision within the safety window.
3.  **Audit NACK:** Receipt of a Negative Acknowledgment (NACK) or failure to receive an ACK from the Audit Sink.
4.  **Evidence Mismatch:** Detection of any discrepancy between reported dependency versions and Control Plane records.
5.  **Hostile Infrastructure Detection:** Any detection of signal tampering, cache replay, or infrastructure degradation that threatens determinism.

---

## 7. Design Invariants

- **Readiness is Ephemeral:** It exists only while all signals are current.
- **Validation is Continuous:** Readiness MUST be re-validated at the start of every orchestration attempt.
- **Authority is External:** Orchestration SHALL NOT determine its own readiness; it SHALL consume readiness evidence provided by authoritative owners.

---

## 8. Summary of Fail-Closed Outcomes

| Event | Outcome | Recovery Requirement |
| :--- | :--- | :--- |
| Missing Heartbeat | **BLOCKED** | Restore dependency + Re-validate |
| Version Mismatch | **BLOCKED** | Align versions + Re-validate |
| Audit Sink Down | **BLOCKED** | Restore connectivity + Re-validate |
| Operator Offline | **BLOCKED** | Operator Login + Active Presence |
| Signal Tampering | **ERROR/BLOCKED** | Security Audit + System Reset |
