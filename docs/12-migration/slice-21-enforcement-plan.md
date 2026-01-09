# CP-21 — Enforcement Planning (Application Surface Governance Closure)
**Slice ID:** CP-21  
**Document Type:** Enforcement Plan (NOT implementation)  
**Status:** Planned (Enforcement Plan)  
**Owner:** Platform Architecture  
**Primary Dependency:** `docs/12-migration/slice-21-application-surface-governance.md`  
**Unblocks:** MIG-06 (only if all unblock criteria in this document are satisfied)

---

## 1. Purpose and Scope

This document defines the **minimal, ordered enforcement plan** required to satisfy the **REQUIRED BUT UNIMPLEMENTED** guarantees defined in CP-21 and to unblock MIG-06.

This is an **enforcement plan**, not an implementation plan:
- It defines **what must become true**, **where it must be enforced**, and **what proof is required**.
- It does **not** specify mechanisms, tools, vendors, frameworks, middleware, runtimes, or product-specific techniques.
- Where enforcement cannot be described without guessing implementation details, it is explicitly marked **BLOCKED** and must be deferred.

**Scope is strictly limited to CP-21**: application-surface governance closure for policy enforcement, non-cacheability, and uniform audit emission. No expansion of CP-21 scope is permitted.

---

## 2. Enforcement Principles

- **Mechanical > conventional**
  - Enforcement is valid only when it is mechanically enforced and independently verifiable. “We will be careful” is not evidence.
- **Deny-by-default**
  - Unknown surfaces, unknown triggers, missing evidence, or ambiguous classification result in **rejection**, not “best effort”.
- **Evidence before confidence**
  - Completion requires proofs that can be reviewed and repeated. Confidence without proof is treated as non-completion.

---

## 3. Enforcement Phases (Ordered, Mandatory)

The phases below are mandatory and must be executed in order. **Partial completion is insufficient** and does not unblock MIG-06.

- **Phase E1: Mechanical Non-Cacheability**
- **Phase E2: Policy Enforcement Closure**
- **Phase E3: Uniform Audit Emission**

---

## 4. Phase E1 — Mechanical Non-Cacheability

### Objective (what must become true)

For every CP-21 in-scope application surface and entrypoint, the following must be true:
- Execution, decision signaling, mutation execution, and audit emission paths are **mechanically non-cacheable**.
- There is **no layer** (application, platform, edge, proxy, CDN, client, internal) that can cache these governed paths in a way that violates CP-19 non-cacheability.
- Any uncertain or unprovable cache behavior results in **deny-by-default**: the surface is blocked from participating in governed operations.

This phase specifically addresses doctrine audit finding **Caching Boundaries = PARTIAL** due to “annotation-level” enforcement without automated evidence. (See `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`.)

### Enforcement surface (where it applies)

Applies to **all CP-21 application surfaces** that initiate or proxy governed operations, including:
- HTTP entrypoints (routes, handlers, server actions, webhooks, internal service endpoints)
- Non-HTTP entrypoints (scheduled tasks, background workers, message consumers, CLI invocations)
- Legacy and new surfaces across `apps/` and `services/` as defined by CP-21

**Note:** Exact surface inventory is a required input; without it, enforcement is **BLOCKED**.

### Proof required (how we know it works)

All proofs below are mandatory:
- **E1-PROOF-1: Sealed Surface Inventory**
  - A complete inventory of all in-scope entrypoints exists and is sealed as evidence.
  - Each entrypoint is uniquely identified and mapped to whether it can trigger governed operations.
- **E1-PROOF-2: Mechanical Cache-Prohibition Evidence**
  - For each inventoried entrypoint that can reach a governed boundary, evidence exists that caching is mechanically prohibited across all relevant layers.
  - Evidence must be reviewable and repeatable; “intended behavior” or “documentation” is not acceptable.
- **E1-PROOF-3: Negative Case Evidence**
  - Evidence exists that misconfiguration or omission cannot silently re-enable caching for governed paths without being detected and causing denial.

If any proof cannot be produced without describing implementation mechanisms, that portion is **BLOCKED** and enforcement is incomplete.

### Preconditions

- CP-21 scope definition is approved (see `docs/12-migration/slice-21-application-surface-governance.md`).
- CP-19 non-cacheability doctrine is binding and unchanged.
- **Surface inventory exists** (E1-PROOF-1). If absent, E1 is **BLOCKED**.

### Explicit non-goals

- No performance optimization.
- No caching enablement for governed paths under any circumstances.
- No vendor/tool selection.
- No new product capability.

### Stop conditions

Stop and treat CP-21 as **BLOCKED** if any of the following occur:
- Surface inventory is incomplete, disputed, or unsealed.
- Any in-scope governed path is found to be cacheable at any layer.
- Proof requires assuming a mechanism (“we’ll add X”) rather than presenting evidence.
- A bypass path exists where caching behavior is uncertain (uncertainty = denial).

---

## 5. Phase E2 — Policy Enforcement Closure

### Objective (what must become true)

For every CP-21 in-scope entrypoint capable of triggering governed operations:
- **Policy evaluation is non-bypassable** at the application boundary.
- Unknown or unrecognized triggers are **rejected** (deny-by-default).
- Decision signaling / escalation semantics applicable under CP doctrine cannot be omitted, stripped, or bypassed by any application surface.
- There exists a verifiable record that policy evaluation occurred for each governed invocation (as required by CP-21 P-1 / P-2 / P-3).

### Enforcement surface (where it applies)

Applies to the **same complete surface inventory** as E1:
- All entrypoints that can initiate or proxy Control Plane operations
- All legacy and new surfaces, regardless of ownership or app/service location

### Proof required (how we know it works)

All proofs below are mandatory:
- **E2-PROOF-1: Sealed Surface Inventory**
  - The same inventory from E1, explicitly mapping which entrypoints can trigger governed operations.
- **E2-PROOF-2: Non-Bypassability Evidence**
  - Evidence exists that no inventoried entrypoint can reach a governed boundary without policy evaluation.
  - Evidence must include explicit handling of “legacy” and “non-HTTP” surfaces.
- **E2-PROOF-3: Deny-by-Default Evidence**
  - Evidence exists that unknown triggers and unrecognized entrypoints are rejected.
  - “No known cases” is not evidence.
- **E2-PROOF-4: Decision-Signal Preservation Evidence**
  - Evidence exists that applicable decision signaling cannot be stripped or omitted at the application boundary.

If proofs require guessing implementation, mark **BLOCKED** and do not proceed.

### Preconditions

- E1 is **complete** (mechanical non-cacheability proven for governed paths).
- Surface inventory is complete and sealed.
- CP-21 policy closure requirements (P-1, P-2, P-3) are accepted as binding.

### Explicit non-goals

- No new authorization model design.
- No changes to Control Plane semantics (CP-16..CP-20 are not modified).
- No broad refactors of application surfaces beyond what enforcement requires.
- No “best effort” compatibility mode for legacy surfaces.

### Stop conditions

Stop and treat CP-21 as **BLOCKED** if any of the following occur:
- Any bypass path exists (or cannot be ruled out with evidence).
- Any entrypoint can trigger governed operations without verifiable policy evaluation record.
- Unknown triggers are not rejected deterministically.
- Any “legacy exception” is proposed or required.

---

## 6. Phase E3 — Uniform Audit Emission

### Objective (what must become true)

For every CP-21 in-scope entrypoint capable of reaching a governed boundary:
- Audit emission is **uniform** (consistent taxonomy and required metadata fields).
- Audit events are **metadata-only** and adhere to doctrine boundaries (no PHI/PII, no payload-like content, no forbidden identifiers).
- Audit emission is **provable and non-omittable** for governed operations.

### Enforcement surface (where it applies)

Applies to:
- Every inventoried entrypoint that can trigger or proxy governed operations
- Both success and failure paths, including denials, consent failures, policy failures, and integration failures

### Proof required (how we know it works)

All proofs below are mandatory:
- **E3-PROOF-1: Sealed Surface Inventory**
  - Same inventory as E1/E2.
- **E3-PROOF-2: Coverage Evidence**
  - Evidence exists that every governed invocation results in audit emission.
  - Evidence must cover both HTTP and non-HTTP entrypoints.
- **E3-PROOF-3: Uniformity Evidence**
  - Evidence exists that audit events conform to a uniform taxonomy and include required metadata fields across all surfaces.
- **E3-PROOF-4: Metadata-Only / Redaction Evidence**
  - Evidence exists that audit payloads cannot include PHI/PII or forbidden identifiers.
  - Evidence must be repeatable and reviewable.

If any audit proof depends on assumed implementation, mark **BLOCKED**.

### Preconditions

- E1 is complete.
- E2 is complete.
- CP doctrine for metadata boundaries and audit logging remains binding and unchanged.

### Explicit non-goals

- No expansion of audit payload content.
- No “debug mode” that relaxes redaction requirements.
- No “partial audit coverage” allowed for legacy surfaces.

### Stop conditions

Stop and treat CP-21 as **BLOCKED** if any of the following occur:
- Any governed path can execute without emitting an audit event.
- Uniform taxonomy cannot be demonstrated across all inventoried surfaces.
- Metadata-only constraints cannot be proven.
- Any exception is requested for legacy surfaces.

---

## 7. MIG-06 Unblock Criteria

MIG-06 may proceed **only** when all conditions below are satisfied. **Partial completion is insufficient**.

### Required conditions (ALL mandatory)

- **MIG06-U1: MIG-06 authoritative documents exist and are sealed**
  - The MIG-06 ADR and MIG-06 slice spec must exist at their authoritative locations and be reviewable as dependencies.
  - **Status:** **BLOCKED** — the repository does not contain the required files at:
    - `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md` (not found)
    - `docs/12-migration/mig-06-automation-agent-orchestration.md` (not found)
  - Until these exist and are sealed, MIG-06 cannot be unblocked by CP-21 enforcement, because the target constraints cannot be verified without guessing.

- **MIG06-U2: CP-21 surface inventory is complete and sealed**
  - A complete inventory of in-scope application surfaces/entrypoints exists and is sealed as evidence.

- **MIG06-U3: E1 complete (Mechanical Non-Cacheability)**
  - All E1 proofs are satisfied for all inventoried governed paths.

- **MIG06-U4: E2 complete (Policy Enforcement Closure)**
  - All E2 proofs are satisfied; no bypass paths remain.

- **MIG06-U5: E3 complete (Uniform Audit Emission)**
  - All E3 proofs are satisfied; audit is uniform, metadata-only, and non-omittable.

### Explicit statement on partial completion

Partial completion (for example, only E1 or only “some surfaces”) is **insufficient** and must not be used to justify MIG-06 implementation. If any condition above is unmet, MIG-06 remains **BLOCKED**.

### If MIG-06 cannot be unblocked even after full enforcement

If **MIG06-U1** remains unresolved (missing authoritative MIG-06 ADR/spec), MIG-06 cannot be unblocked even if E1–E3 are complete. In that case, deferral is mandatory until the authoritative MIG-06 documents exist and are sealed.

---

## 8. Risk Register

If enforcement is incomplete, the following risks apply:

- **R1: Doctrine leakage through application surfaces**
  - Legacy or misconfigured entrypoints bypass governance even if the Control Plane is compliant.
  - This recreates unsafe behavior while giving false confidence from “core compliance”.

- **R2: Silent caching of governed paths**
  - Caching of decisions/executions/audits breaks determinism, governance, and auditability.
  - Silent caching is higher risk than explicit failure because it is hard to detect and can persist.

- **R3: Partial policy closure produces bypassable orchestration**
  - Orchestration can be correct “on paper” while bypassable in practice.
  - Bypassability is unacceptable for regulated workflows.

- **R4: Non-uniform audit undermines incident response and compliance**
  - If audit emission is inconsistent, investigations become incomplete by default.
  - Metadata leakage (PHI/PII) in audit events creates direct compliance exposure.

### Why deferral is safer than partial rollout

Partial rollout creates **false safety**: it mixes “governed” and “unguarded” entrypoints in the same system. Deferral is safer because it prevents the system from presenting governance guarantees that are not mechanically enforced and proven.

---

## 9. Governance Gates

These gates must be reviewed and approved **before any CP-21 enforcement code work begins**.

### Gate G0 — Inputs and authority

- CP-21 scope and invariants are approved (CP-21 spec is authoritative).
- The surface inventory methodology and its completeness criteria are approved.
- Any missing authoritative dependency documents are identified as **BLOCKED** (not deferred silently).

### Gate G1 — Evidence plan approval

Approve the **exact evidence pack** required to declare CP-21 enforcement complete:
- Sealed surface inventory (all entrypoints)
- Proof artifacts for E1, E2, E3 (as defined in this plan)
- Closure statement mapping each CP-21 guarantee (P-1..P-3, C-1..C-2, A-1..A-3) to its proof

### Gate G2 — Completion review (marking CP-21 enforcement complete)

CP-21 enforcement may be marked complete only when:
- E1, E2, and E3 are complete with proofs for **all** inventoried entrypoints
- No exceptions remain for legacy surfaces
- Any BLOCKED items are resolved (or the slice remains blocked)
- A reviewer can reproduce or re-check the proofs without relying on undocumented assumptions

---

## Appendix A — Required source documents

This plan is derived from and constrained by the following documents:
- `docs/12-migration/slice-21-application-surface-governance.md`
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`
- `docs/01-architecture/execution-standards.md`

The following required inputs were referenced by CP-21 but are **missing at the specified paths** and therefore BLOCK MIG-06 unblock validation:
- `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md` (**missing**)
- `docs/12-migration/mig-06-automation-agent-orchestration.md` (**missing**)

