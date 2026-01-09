# ADR-MIG-06: Orchestration Execution Model (Policy-Triggered, Deterministic, Non-Autonomous)

## 1. Title and Status

**Title:** MIG-06 Orchestration Execution Model (Policy-Triggered, Deterministic, Non-Autonomous)  
**Status:** **Accepted – Documentation Locked**

---

## 2. Context

### 2.1 Why orchestration is required

The platform requires a constrained orchestration model to coordinate:

- **Read-only evaluation and routing** across policies and views (including decision signaling), without introducing new query power or mutation surfaces.
- **Human-in-the-loop escalation** where outcomes require review rather than execution.
- **Governed side effects** only where already allowed by the Control Plane (CP-17) and only under explicit approval and idempotency requirements.

This is required to ensure a consistent, auditable execution contract for “automation” without widening platform capability beyond sealed Control Plane slices.

### 2.2 Why unrestricted automation is unsafe

Unrestricted automation creates unacceptable risk because it:

- Enables **unbounded writes and side effects** outside governed mutation pathways.
- Encourages **non-deterministic execution** (variable retries, hidden branching, implicit fallbacks), which breaks auditability and reproducibility.
- Creates **PHI/PII leakage paths** into logs, audit events, cache keys, correlation identifiers, or external systems.
- Introduces **background execution** (schedulers/workers) that can act without operator intent, without explicit policy evaluation at the moment of execution, and without stable escalation boundaries.
- Incentivizes **self-modifying behavior** (changing rules/workflows at runtime) that bypasses governance and sealing.

Therefore, orchestration must be explicitly bounded, policy-driven, and non-autonomous.

### 2.3 Relationship to CP-16..CP-20

This ADR is anchored to the Control Plane contracts and MUST NOT widen them:

- **CP-16 (Decision Hooks & Escalation)** defines deterministic, metadata-only “decision required” signals and explicitly does not perform mutations.
- **CP-17 (Controlled Mutations)** defines the only permitted mutation surface (allowlisted communication side effects) with explicit approvals, idempotency, and fail-closed behavior.
- **CP-18 (Policy & View Versioning)** requires deterministic version selection and forbids runtime authoring of policies/views/workflows.
- **CP-19 (Caching Boundaries)** forbids caching of execution, mutation, decision, and audit paths.
- **CP-20 (External Integrations Boundary)** requires vendor-neutral envelopes, metadata-only outcomes, bounded failure taxonomy, and idempotency requirements for write-controlled interactions; it explicitly forbids background job infrastructure and persistence in the integration boundary.

MIG-06 orchestration is a coordination layer operating within these constraints, not a capability expansion mechanism.

---

## 3. Decision

The platform adopts and locks the following orchestration execution model for MIG-06.

### 3.1 Execution model definition (normative)

Orchestration execution under MIG-06 is:

- **Policy-triggered**
  - Every orchestration attempt begins from an explicitly recognized trigger and MUST be evaluated by an explicit policy before any execution occurs.
  - Unknown triggers are rejected (deny-by-default).
- **Deterministic**
  - For the same metadata inputs (including explicit policy/view version selection), orchestration produces the same outcomes and decision signals.
  - Any variability that changes decisions or outcomes is non-compliant.
- **Lifecycle-bound**
  - Orchestration operates within explicit lifecycle states: **spawn → run → pause → terminate**.
  - Every lifecycle transition is auditable with metadata-only records.
- **Escalation-aware**
  - Orchestration MUST pause and escalate using CP-16 decision semantics whenever human review is required or boundaries are uncertain.
  - Escalation is a signal, not an execution mechanism.
- **Explicitly non-autonomous**
  - Orchestration MUST NOT act as an autonomous agent.
  - It MUST NOT self-author policies, workflows, or runtime rules.
  - It MUST NOT widen its permissions, tools, or scope during execution.

### 3.2 Orchestration does not imply background automation infrastructure

For MIG-06, orchestration explicitly DOES NOT mean, and MUST NOT be implemented as:

- background jobs,
- cron or time-based schedulers as an execution engine,
- long-running autonomous workers,
- reactive “event-soup” chains,
- or vendor-managed automation platforms acting outside the Control Plane contracts.

Orchestration is a coordination and decision-routing model operating only within the existing governed execution surfaces.

---

## 4. Invariants (Non-Negotiable)

The following invariants are mandatory for any MIG-06 orchestration behavior. Any violation is non-compliant.

- **No execution without explicit policy**
  - No orchestration attempt may proceed without explicit policy evaluation.
  - No implicit triggers, defaults, or “best effort” execution is permitted.

- **No writes outside CP-17 allowlist**
  - The only permitted write-controlled operations are those explicitly allowlisted by CP-17:
    - `comm.send_message@v1`
    - `comm.create_notification@v1`
  - All other write behavior is forbidden under MIG-06.

- **No PHI writes**
  - Orchestration MUST NOT write PHI/PII to storage, logs, audit events, external systems, cache keys, correlation identifiers, idempotency keys, or decision signals.

- **No hidden retries**
  - Orchestration MUST NOT perform implicit or concealed retries that can change side effects, outcomes, timing, or decision routing.
  - Where idempotency is required (CP-17 / CP-20 write-controlled operations), replays MUST return prior results rather than re-executing side effects.

- **No self-modifying behavior**
  - Orchestration MUST NOT generate, modify, or author policies, views, workflows, or rule sets at runtime.
  - Orchestration MUST NOT mutate its own execution constraints.

- **Metadata-only audit exposure**
  - All audit records MUST be metadata-only.
  - Audit exposure MUST NOT include payloads, raw tool parameters, raw rows, tenant identifiers, actor identifiers, request identifiers, cursors, or PHI/PII.

---

## 5. Explicitly Rejected Alternatives

The following approaches are explicitly rejected for MIG-06 orchestration:

- **Cron-style schedulers**
  - Rejected because they introduce background execution that is not inherently policy-evaluated at execution time and invites implicit retries and drift from deterministic, lifecycle-bound behavior.

- **Event-soup / reactive chains**
  - Rejected because reactive chains typically create implicit coupling, emergent behavior, and non-auditable branching that violates determinism and escalation discipline.

- **Autonomous agents**
  - Rejected because autonomous agents inherently expand scope through self-directed action and cannot satisfy explicit non-autonomy, no hidden retries, and no self-modifying behavior.

- **Long-running background workers**
  - Rejected because they enable continuous execution outside explicit lifecycle boundaries and increase the risk of ungoverned side effects and PHI leakage.

- **Vendor-managed automation platforms**
  - Rejected because vendor-managed automation platforms introduce an external execution plane whose semantics (retries, persistence, branching, and logging) cannot be governed and sealed by CP-16..CP-20, and therefore cannot be guaranteed to satisfy deterministic, lifecycle-bound, metadata-only, policy-triggered execution.

---

## 6. Consequences

### 6.1 What this enables

This decision enables:

- A **single, governance-aligned definition** of orchestration that is safe by default.
- **Deterministic decision routing** using CP-16 decision hooks without mutations.
- **Strictly governed side effects** limited to CP-17 allowlisted communication operations, with approvals and idempotency.
- **Versioned, reconstructable execution** via CP-18 version selection and metadata-only audit trails.
- **Performance work that preserves safety**, because CP-19 forbids caching on execution/mutation/decision/audit paths and makes boundaries explicit.
- **Safe external trigger alignment** only through CP-20 envelopes and bounded failure taxonomy, without introducing background job infrastructure.

### 6.2 What this permanently forbids

This decision permanently forbids, within MIG-06 orchestration:

- Any orchestration that functions as an autonomous agent.
- Any background job platform (queues, workers, cron infrastructure) as part of orchestration semantics.
- Any write path beyond CP-17 allowlist, including clinical record mutation, workflow advancement, or persistence of payload-like content.
- Any PHI/PII writes by orchestration to any storage, log, audit, or external boundary.
- Any runtime authoring or self-modification of policies/views/workflows.
- Any caching of execution, mutation, decision, or audit pathways.

### 6.3 How future slices must conform

All future slices that reference “automation” or “orchestration” MUST:

- Use this orchestration model definition as the execution contract baseline.
- Prove compliance with the invariants in Section 4.
- Treat any additional capability requests (new mutation tools, background execution infrastructure, persistence mechanisms, runtime authoring) as out of scope for MIG-06 and as requiring separate governance decisions and sealed documentation.

---

## 7. Relationship to MIG-06

### 7.1 How this ADR constrains MIG-06 implementation

This ADR locks MIG-06 orchestration semantics as a documentation-level contract:

- MIG-06 orchestration MUST remain **coordination-only** except where CP-17 explicitly permits allowlisted communication side effects.
- MIG-06 orchestration MUST use **CP-16 decision semantics** for escalation and must never treat escalation as execution.
- MIG-06 orchestration MUST enforce **deterministic version selection** and **no runtime authoring** per CP-18.
- MIG-06 orchestration MUST treat **execution/mutation/decision/audit** as **non-cacheable** per CP-19.
- MIG-06 orchestration MUST keep **external trigger handling vendor-neutral and metadata-only** per CP-20 and MUST NOT introduce background job infrastructure under the integration boundary.

### 7.2 Conditions under which MIG-06 must stop

MIG-06 MUST STOP immediately (and be treated as blocked) if any proposed behavior requires:

- Execution without explicit policy evaluation.
- Any write path outside the CP-17 allowlist.
- Any PHI/PII write by the orchestration layer (including logs, audits, cache keys, correlation IDs, or external systems).
- Hidden retries or implicit fallback execution.
- Self-modifying behavior or runtime authoring of policies/views/workflows.
- Caching of execution, mutation, decision, or audit pathways.
- Introduction of cron/queues/workers or any long-running autonomous execution model to implement “orchestration.”

