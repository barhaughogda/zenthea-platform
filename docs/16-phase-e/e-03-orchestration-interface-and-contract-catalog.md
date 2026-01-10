# E-03 — Orchestration Interface & Contract Catalog

**Document ID:** E-03-OIC  
**Mode:** GOVERNANCE / PHASE E — ORCHESTRATION INTERFACE & CONTRACT CATALOG  
**Status:** DRAFT (Design-Only; governance review required)  
**Authority:** Platform Governance (Phase E)  
**Prerequisites:** CP-21 is SEALED and authoritative; E-01 (ODS) is authoritative for flow and state.  

---

## 0. Deterministic Interpretation Rules (Fail-Closed)

This document defines the **authoritative interface and contract catalog** for Phase E orchestration. It is a design-only specification.

Interpretation SHALL be fail-closed:

- Any field marked **REQUIRED** that is missing or malformed SHALL result in an **automatic abort**.
- Any **version mismatch** between actors SHALL result in an **automatic abort**.
- Any orchestration signal not explicitly defined in this catalog SHALL be treated as **FORBIDDEN** and SHALL result in an **automatic abort**.
- All interfaces SHALL handle **metadata-only** payloads; any detection of PHI/PII SHALL trigger an immediate **SECURITY-ABORT**.

---

## 1. Canonical Interfaces (Version 1.0.0)

Every orchestration artifact MUST adhere to these structures. No implicit fields or extension properties are permitted.

### 1.1 OrchestrationTrigger
The entrypoint for all governed execution.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | SEMVER | YES | MUST be `1.0.0`. |
| `trigger_id` | UUID | YES | Stable identifier for the originating event. |
| `classification` | ENUM | YES | MUST map to allowed categories (MIG-06 only). |
| `metadata` | OBJECT | YES | Bounded metadata (no PII/PHI). |
| `timestamp` | ISO8601 | YES | Trigger initiation time. |

### 1.2 OrchestrationCommand
The instruction sent from the Orchestrator to an Agent or Service.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | SEMVER | YES | MUST be `1.0.0`. |
| `command_id` | UUID | YES | Unique identifier for this specific command. |
| `attempt_id` | UUID | YES | Correlated `orchestration_attempt_id` (E-01). |
| `type` | ENUM | YES | Permitted command types only (Section 4). |
| `parameters` | OBJECT | YES | Metadata-only; MUST NOT contain raw data. |
| `idempotency_key` | STRING | YES | REQUIRED for all mutation commands. |

### 1.3 OrchestrationContext
Derived from `ControlPlaneContext`; contains the minimal state required for decisioning.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `attempt_id` | UUID | YES | Global correlation ID for the lifecycle. |
| `policy_id` | STRING | YES | Explicit policy identifier for gating. |
| `policy_version` | SEMVER | YES | Explicit policy version for gating. |
| `trace_id` | STRING | YES | Distributed trace correlation. |
| `audit_id` | UUID | YES | Stable correlation for P3-Audit emission. |
| `governance_mode` | ENUM | YES | MUST be `PHASE_E_RESTRICTED`. |

### 1.4 OrchestrationResult
The outcome of a command or the entire orchestration attempt.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | SEMVER | YES | MUST be `1.0.0`. |
| `attempt_id` | UUID | YES | Correlation to the initiation attempt. |
| `outcome` | ENUM | YES | terminal state (Section 4.1 E-01). |
| `evidence` | OBJECT | YES | Metadata-only audit/verification markers. |
| `audit_correlation_id`| UUID | YES | REQUIRED for proof of audit acceptance. |

### 1.5 OrchestrationAbort
The signal emitted when an invariant or fail-closed condition is met.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | SEMVER | YES | MUST be `1.0.0`. |
| `attempt_id` | UUID | YES | Correlation to the failed attempt. |
| `reason_code` | STRING | YES | MUST map to bounded Failure Taxonomy (E-05). |
| `metadata` | OBJECT | YES | Bounded metadata for the failure cause. |
| `stop_authority` | ENUM | YES | [CONTROL_PLANE \| OPERATOR \| ORCHESTRATOR]. |

---

## 2. Contract Authority Rules

### 2.1 Authoritative vs Derived
- **Authoritative Contracts:** The interfaces defined in Section 1 are authoritative. Any implementation MUST derive its internal representation directly from these schemas.
- **Derived Artifacts:** DTOs, message envelopes, and storage schemas are derived. In the event of a conflict, the **Authoritative Contract** SHALL prevail.

### 2.2 Forbid Undeclared Contracts
- Any communication between agents and services that bypasses these defined interfaces is **STRICTLY FORBIDDEN**.
- No "best-effort" or "custom-metadata" fields are allowed outside the `metadata` and `parameters` maps.

### 2.3 Compatibility & Breaking Changes
- **Breaking Changes:** Any change to a REQUIRED field or change in field semantics REQUIRES a major version bump and a Phase E **REOPEN** condition (E-02 Section 5).
- **Non-Breaking Changes:** Addition of OPTIONAL fields REQUIRES a minor version bump and documentation update.

---

## 3. Control Plane Integration (CP-21 Mapping)

All orchestration surfaces MUST comply with the **CP-21 Cache Boundary Enforcement Layer (CBEL)**.

| Orchestration Surface | CP-21 Classification | CBEL Requirement |
| :--- | :--- | :--- |
| Trigger Intake | **Execution Initiation** | Non-cacheable; explicit request/trace recording. |
| Policy Gate | **Decision** | No cache replay of policy outcomes; direct CP evaluation. |
| Command Emission | **Mutation Intent** | Idempotency mandatory; non-cacheable intent signals. |
| Audit Emission | **Audit** | Immediate emission; no batch/deferred "best-effort" caching. |
| Context Propagation | **Context** | Metadata-only; must be re-validated at every transition. |

### 3.1 Policy Hooks
- Every `OrchestrationTrigger` MUST hook into `ControlPlane.EvaluatePolicy(Context)`.
- No execution SHALL occur until a `PolicyEvaluated` signal (E-01 7.2) is emitted and SEALED.

### 3.2 Audit Hooks
- Every `StateTransitionRecorded` event MUST hook into the governed Audit Sink.
- Audit emission failure MUST trigger an `OrchestrationAbort`.

---

## 4. Agent & Service Interaction Contracts

### 4.1 Permitted Agent Requests
Agents MAY request:
- **READ-ONLY** metadata for context enrichment.
- **DECISION-SIGNAL** for human-in-the-loop escalation.
- **MUTATION-INTENT** against CP-17 allowlisted controlled mutations.

### 4.2 Permitted Service Executions
Services MAY execute:
- **Metadata-only reads** when authorized by the Policy Gate.
- **Controlled mutations** only via the explicit Control Plane mutation surface.

### 4.3 Explicit Prohibitions (with reasons)
- **Direct Database Access:** FORBIDDEN (Bypasses policy/audit/data boundaries).
- **Payload Propagation:** FORBIDDEN (Risks PHI/PII exposure in orchestration logs).
- **Autonomous Tool Selection:** FORBIDDEN (Orchestration must be deterministic and non-autonomous).

---

## 5. Non-Goals & Prohibitions

### 5.1 Forbidden Interfaces
The following interfaces SHALL NOT exist in Phase E:
- `OrchestrationPlan`: Dynamic or self-authored plans are forbidden.
- `OrchestrationRetry`: Hidden or autonomous retries are forbidden.
- `OrchestrationDelegate`: Delegation of authority between agents is forbidden.

### 5.2 Prohibition of Autonomous Execution
- Orchestration SHALL NOT initiate any action without an explicit `AUTHORIZED` state transition triggered by policy.
- Self-directed scope expansion is an invariant violation.

### 5.3 Prohibition of Stateful Orchestration Engines
- Phase E prohibits reliance on stateful engines that manage transitions using black-box persistence or implicit state (e.g., hidden queues, cron). All state transitions MUST be explicit, auditable, and repo-verifiable.

---

## 6. Fail-Closed Guarantees

- **Missing Contract Field:** Immediate transition to `BLOCKED`.
- **Version Mismatch:** Immediate transition to `ERROR` (non-retryable).
- **Unknown Command Type:** Immediate transition to `BLOCKED` (Contract Ambiguity).
- **Partial Execution Trace:** If a step fails and cannot be proven as completed or safely rolled back via idempotency, transition to `ERROR` and abort + audit.

---

## 7. Stop Conditions Met
- **No Implementation:** Definitions only; no code or runtime selection.
- **No MIG-06 References as Executable:** `MIG-06` is referenced as a classification, not an executable path.
- **Fail-Closed Semantics Maintained:** All violations result in `BLOCKED` or `ERROR`.
