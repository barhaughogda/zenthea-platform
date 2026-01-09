# MIG-06 — Automation & Agent Orchestration (Execution Contract)

**Status:** Planned (Spec for Governance Lock)  
**Contract Type:** Execution Contract (binding once approved)  
**Category:** Migration Slice (MIG)  
**Risk Posture:** **High risk by default** (automation is treated as unsafe until bounded)  

## 0. Authority & References (must-read)

This document is **restrictive**. Any behavior not explicitly permitted here is **out of scope**.

Authoritative context and sealed constraints referenced by this contract:

- `docs/01-architecture/execution-standards.md` (slice status definitions; sealing rules)
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md` (draft-only, consent gating, audit logging, controlled mutations, DTO/metadata boundaries, caching boundaries)
- `docs/ROADMAP.md` (dependency ordering: CP-16..CP-20 precede MIG-06)
- `docs/12-migration/mig-03-provider-portal.md` (explicit non-goal: no autonomous AI behavior within MIG-03 scope; MIG-06 must not override prior contracts)
- `docs/12-migration/mig-04A/mig-04A-spec.md` and `docs/12-migration/mig-04A/mig-04A-acceptance-criteria.md` (draft-only doctrine and “fail the slice if…” conditions)
- `docs/12-migration/slice-16/slice-16-spec.md` (Decision Hooks: read-only; metadata-only; deterministic)
- `docs/12-migration/slice-17/slice-17-spec.md` (Controlled Mutations: allowlisted; approval required; idempotent; fail closed)
- `docs/12-migration/slice-18/slice-18-spec.md` (Policy/View versioning: deterministic selection; no runtime authoring)
- `docs/12-migration/slice-19/slice-19-spec.md` (Caching boundaries: execution/mutations/decisions/audits MUST NEVER be cached)
- `docs/12-migration/slice-20/slice-20-spec.md` (Integration boundary: vendor-neutral; metadata-only envelopes; idempotency; bounded failure taxonomy)

If any ambiguity is found between this contract and the above sealed slices, **this slice is BLOCKED** until resolved by Governance.

---

## 1. Slice overview and intent

MIG-06 defines the **approved boundaries** for “automation” and “agent orchestration” in the Zenthea Platform **without widening any Control Plane contracts**.

### 1.1 Intent

- Provide a governance-locked definition of:
  - what “orchestration” is allowed to do (and not do),
  - the explicit boundary between read-only orchestration vs write-controlled orchestration,
  - when decisions must escalate to humans,
  - how automation triggers are allowed to fire (policy-driven only),
  - what must be audited and how, using **metadata-only** representations.

### 1.2 Safety stance

- Automation is treated as **high-risk by default**.
- The default stance is **deny-by-default** and **fail closed**.
- Any write path not safely bounded by existing contracts is **explicitly BLOCKED** (see §12).

---

## 2. Explicit scope (what is included)

MIG-06 scope is limited to **documentation-level constraints** for orchestration that must be satisfied before any implementation begins.

In scope:

- **Orchestration Model Definition**
  - Separation of **read-only orchestration** vs **write-controlled orchestration** (see §4).
  - Definition of what constitutes a “write” for this slice (see §4.2).
- **Agent lifecycle boundaries**
  - Normative lifecycle states: spawn, run, pause, terminate (see §5).
- **Decision hooks and escalation boundaries**
  - Decision signaling must use CP-16 semantics (metadata-only; deterministic) (see §6).
- **Automation triggers**
  - Allowed trigger categories and constraints (policy-driven only; explicit) (see §7).
- **Data boundaries**
  - Orchestration-layer data exposure and storage constraints (no PHI writes; metadata-only exposure) (see §8).
- **Invariants, assumptions, and known unknowns**
  - Explicit invariants that must-hold (see §9).
  - Assumptions and known unknowns; explicit BLOCKED areas (see §10–§12).

---

## 3. Explicit non-goals (what is excluded)

The following are **explicit non-goals** and MUST NOT be implemented under MIG-06:

- **No widening of Control Plane contracts**
  - No new Control Plane endpoints, DTO shapes, schemas, or policies introduced by this slice.
- **No new mutation tool surface**
  - No new mutation tools beyond CP-17 allowlist.
  - No “temporary” exceptions.
- **No autonomous clinical actions**
  - No signing/attestation/finalization/lock/write-back of clinical records.
  - No automation that advances clinical state or mutates PHI without explicit human action.
- **No background job platform**
  - No queues, workers, schedulers, cron infra, or persistence mechanisms introduced by this slice.
  - (If required later, it must be separately specified and approved; see §12.)
- **No vendor selection**
  - No selection or implicit commitment to a specific workflow engine or vendor.
- **No credentials or secret handling**
  - Orchestration infrastructure must not manage or store credentials under this slice.
- **No runtime authoring**
  - No “create policies/views/workflows at runtime” capability (CP-18 doctrine: no runtime authoring).
- **No cross-slice override**
  - This slice does not relax constraints in already-approved migration contracts (e.g., MIG-03’s non-goal of autonomous AI behavior within its scope).

---

## 4. Orchestration model (read-only vs write paths)

### 4.1 Definitions

- **Orchestration**: Coordinating *invocation* of existing, already-governed execution surfaces (policies, views, and allowed tools), and routing outcomes to escalation/human decision points.
- **Automation**: Orchestration initiated by a trigger other than an immediate, interactive user click—**but still policy-driven and auditable**.

### 4.2 Read-only vs write-controlled (normative)

This slice distinguishes two categories:

#### A) Read-only orchestration (Allowed)

Read-only orchestration may:

- execute **read-only** views/policies that do not mutate state,
- produce **metadata-only** execution results suitable for operator surfaces,
- attach **decision signals** using CP-16 semantics,
- emit **metadata-only** audit events for orchestration actions (see §13).

Read-only orchestration MUST:

- be deterministic for the same metadata inputs (CP-16 doctrine),
- be non-cacheable where it touches execution/decision/audit paths (CP-19 doctrine).

#### B) Write-controlled orchestration (Restricted; default BLOCKED unless explicitly permitted)

Write-controlled orchestration is any orchestration that would cause state change via mutation tools.

This is restricted to:

- **ONLY** the CP-17 allowlisted mutation tools:
  - `comm.send_message@v1`
  - `comm.create_notification@v1`

and MUST enforce:

- explicit approval record present for every mutation (CP-17),
- strict idempotency keys and collision protection (CP-17),
- metadata-only outputs and metadata-only audits (CP-17),
- fail-closed behavior on any missing requirement (CP-17).

All other write-controlled behavior is **BLOCKED** under MIG-06 (see §12).

### 4.3 “Write” meaning for MIG-06

For MIG-06, **write** includes:

- any external side effect (sending messages/notifications),
- any mutation tool execution,
- any persistence of payload-like content by orchestration infrastructure,
- any advancement of clinical workflow state.

MIG-06 explicitly excludes **PHI writes by orchestration** (see §8.1).

---

## 5. Agent lifecycle boundaries (spawn, run, pause, terminate)

This slice defines lifecycle boundaries **as governance rules**, not as implementation guidance.

### 5.1 Lifecycle state definitions (normative)

- **Spawn**
  - A new orchestration attempt is created from an allowed trigger (§7).
  - A correlation identifier MUST exist.
  - Spawn MUST NOT execute mutations.
- **Run**
  - The orchestration performs permitted read-only executions, and may request write-controlled execution **only when explicitly permitted** and when all CP-17 requirements are met (§4.2B).
- **Pause**
  - The orchestration is halted awaiting human decision (Decision Hook indicates `DecisionRequirement=required`).
  - Pause MUST be a stable, auditable state. No background auto-resume is allowed without a new, policy-evaluated trigger.
- **Terminate**
  - The orchestration ends, with an explicit terminal status:
    - `SUCCEEDED` (no pending decisions; all actions completed within scope),
    - `REJECTED` (policy denied),
    - `ERROR` (bounded failure taxonomy),
    - `BLOCKED` (contract ambiguity or unsafe boundary; see §12).

### 5.2 Lifecycle boundary constraints

- Orchestration MUST be idempotent at the lifecycle level:
  - replays of the same spawn/run inputs MUST not create duplicate mutations.
- Orchestration MUST be externally auditable:
  - every lifecycle transition emits a metadata-only audit event (see §13).

---

## 6. Decision hooks and escalation boundaries

Decision signaling MUST follow CP-16 doctrine:

- **Read-only**: decision hooks must not mutate state.
- **Metadata-only**: decision outputs must not contain tenantId, actorId, requestId, payload, cursor, raw rows, or PHI/PII (CP-16).
- **Deterministic**: same metadata inputs → same decision signal.

### 6.1 Decision boundaries (normative)

MIG-06 MUST escalate (pause) when:

- a policy outcome is `REJECTED` with high risk tier,
- an error indicates policy misconfiguration or boundary uncertainty,
- a write-controlled action is requested without complete approval/idempotency evidence,
- any attempt is made to invoke a non-allowlisted mutation tool,
- any orchestration step would imply PHI write behavior by the orchestrator.

### 6.2 Escalation is not execution

Escalation MUST NOT:

- automatically approve or override policy denials,
- automatically retry into a different risk tier,
- introduce hidden fallback behaviors.

---

## 7. Automation triggers and constraints (policy-driven only)

### 7.1 Allowed trigger categories (subject to constraints)

Allowed trigger categories are:

- **Operator-initiated**
  - A human explicitly initiates orchestration in an operator surface.
- **Time-based**
  - A scheduled trigger that is explicitly configured and approved under governance.
- **External event-based**
  - A trigger derived from an external system event, but only via the CP-20 integration boundary (metadata-only envelopes; correlation IDs; bounded failure taxonomy).

### 7.2 Trigger constraints (normative)

All triggers MUST:

- be evaluated by an explicit policy before any execution,
- be versioned (policy/view versions selected deterministically; CP-18),
- be auditable (metadata-only; see §13),
- be deny-by-default (unknown triggers are rejected),
- include correlation identifiers and purpose metadata.

All triggers MUST NOT:

- self-author or self-modify policies or workflows at runtime,
- introduce hidden background execution loops,
- run “best effort” fallbacks that widen scope.

---

## 8. Data boundaries (no PHI writes; metadata-only exposure)

### 8.1 Orchestration-layer PHI restrictions (non-negotiable)

The orchestration layer under MIG-06 MUST:

- NOT write PHI to any storage, log, audit event, or external system.
- NOT include PHI/PII in operator-facing outputs.
- NOT embed PHI in cache keys, correlation IDs, idempotency keys, or decision signals.

If any orchestration design requires the orchestration layer to persist PHI, MIG-06 is **BLOCKED**.

### 8.2 What orchestration may handle (allowed metadata)

Orchestration may handle only **metadata and references**, such as:

- stable identifiers for policies/views (and versions),
- correlation IDs and request IDs (non-sensitive),
- bounded status/outcome codes,
- classification labels (risk tier, decision kind/severity),
- references/pointers to domain artifacts managed elsewhere (e.g., draft IDs), without containing the content.

### 8.3 Draft-only doctrine interaction (explicit boundary)

Where orchestration coordinates work that results in **draft artifacts** (e.g., MIG-04A draft workspace), MIG-06 does not change MIG-04A’s contract:

- draft-only labeling, provenance, refusal conditions, and “fail the slice if…” conditions remain mandatory,
- orchestration must not create any path that resembles signing/finalization/write-back.

---

## 9. Invariants (must-holds)

The following invariants MUST hold for any MIG-06 compliant implementation:

- **Deny-by-default**: Unknown triggers, tools, versions, or policies are rejected.
- **Fail closed**: Missing approval/idempotency/version selection causes rejection, not fallback.
- **No new mutation surface**: Only CP-17 allowlisted mutation tools may be invoked.
- **No PHI writes by orchestration**: metadata-only exposure; no PHI in logs/audits/keys.
- **Decision hooks are deterministic and metadata-only** (CP-16).
- **No runtime authoring** of policies/views/workflows (CP-18).
- **No caching** of execution, mutation, decision, or audit paths (CP-19).
- **External event triggers** (if used) comply with the integration boundary: vendor-neutral, metadata-only envelopes, idempotency for writes, bounded failure taxonomy (CP-20).
- **Auditability is mandatory**: every lifecycle transition and tool invocation emits metadata-only audit evidence (see §13).
- **No cross-contract override**: Existing MIG contracts (e.g., MIG-03, MIG-04A) remain authoritative for their scopes.

---

## 10. Assumptions and known unknowns

### 10.1 Assumptions

- CP-16 through CP-20 are sealed and remain the controlling governance frame for orchestration.
- Orchestration policies and views exist as versioned, deterministic artifacts (CP-18) and are selected deterministically.
- Controlled mutations remain limited and governed (CP-17) with explicit approval and idempotency.

### 10.2 Known unknowns (explicitly deferred)

The following topics are intentionally **not** specified here and require separate governance decisions before implementation:

- the concrete automation/orchestration engine (vendor or in-house),
- persistence strategy for orchestration state (if any),
- operational model (scheduling, retries, concurrency limits),
- operator UX integration points and authorization UX patterns.

If any of these unknowns are required to bound safety, MIG-06 is **BLOCKED** until decisions are made and documented.

---

## 11. Preconditions for implementation start

Implementation of MIG-06 MUST NOT begin until all of the following are true:

- **Governance lock**
  - This document is reviewed and approved as a binding contract.
- **Dependency confirmation**
  - CP-16, CP-17, CP-18, CP-19, CP-20 remain sealed with no open contract changes.
- **Caching enforcement readiness**
  - The platform can demonstrate (not merely annotate) that execution/mutation/decision/audit paths are not cached in deployed environments, consistent with CP-19 doctrine.
  - If such evidence cannot be produced, implementation is **BLOCKED** for any externally exposed operator surface.
- **Audit posture readiness**
  - A metadata-only audit sink exists and is treated as non-optional (per `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`).

---

## 12. Criteria for “Completed” and “Blocked”

### 12.1 Completed (for this slice)

MIG-06 may be marked **Completed** only when there is verified evidence that:

- orchestration adheres to §4 read/write boundaries,
- write-controlled orchestration is limited to CP-17 allowlist and enforced with approval + idempotency + fail-closed behavior,
- decision hooks are deterministic and metadata-only (CP-16),
- policies/views are versioned with deterministic selection and no runtime authoring (CP-18),
- execution/mutation/decision/audit paths are non-cacheable in practice (CP-19),
- external triggers (if present) comply with CP-20 integration boundary contracts,
- audit emissions exist for lifecycle transitions and are metadata-only.

### 12.2 Blocked (explicit stop conditions)

MIG-06 is **BLOCKED** if any of the following are true:

- **Unbounded write paths**: any orchestration behavior would cause state changes beyond the CP-17 allowlist or without explicit approvals/idempotency.
- **PHI writes by orchestration**: any requirement implies the orchestration layer must store, log, or emit PHI.
- **Autonomy that cannot be bounded**: background actions occur without explicit, policy-driven triggers and without deterministic decision/escalation boundaries.
- **Contract ambiguity**: conflicts or unclear boundaries with any sealed slice or migration contract referenced in §0.
- **Caching risk unresolved**: inability to prove that execution/decision/audit paths are not cached in deployed environments.

When BLOCKED, implementation MUST STOP and the blocker MUST be recorded in the governing documentation and escalated via CP-16 decision semantics.

---

## 13. Security and audit posture (deny-by-default; explicit auditability)

### 13.1 Security posture (non-negotiable)

- Deny-by-default policy evaluation.
- Least privilege: orchestration has no privilege to bypass policy.
- Fail closed on all validation errors.
- No secrets/credentials handled in orchestration scope.

### 13.2 Audit posture (metadata-only)

Every orchestration lifecycle transition MUST produce a metadata-only audit record including:

- correlation identifier,
- policy/view identifiers and versions (not payload),
- outcome code (`SUCCEEDED`/`REJECTED`/`ERROR`/`BLOCKED`),
- decision signal metadata (if any) without sensitive fields,
- bounded failure taxonomy code (if `ERROR`),
- timestamps and environment identifiers.

Audit events MUST NOT include:

- raw parameters, raw tool payloads, PHI/PII, tenantId, actorId, requestId, cursor, or raw rows (consistent with CP-16 / CP-17 / CP-20 doctrines).

---

## 14. Summary (scope & non-goals)

### 14.1 Scope summary

MIG-06 defines governance-locked constraints for orchestration and automation:

- read-only orchestration is allowed,
- write-controlled orchestration is restricted to CP-17 allowlisted tools and is approval+idempotency gated,
- decision hooks and escalation are mandatory and metadata-only,
- automation triggers are policy-driven only,
- orchestration never writes PHI and only exposes metadata.

### 14.2 Non-goals summary

MIG-06 does not select an orchestration engine, does not introduce background job infrastructure, does not widen Control Plane contracts, and does not introduce new mutation tools or any clinical write-back paths.

