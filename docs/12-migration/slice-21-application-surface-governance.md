# CP-21 — Application Surface Governance Closure
**Slice ID:** CP-21  
**Status:** Planned (Spec)  
**Owner:** Platform Architecture  
**Motivation:** Unblock MIG-06 by closing governance guarantees across all application surfaces.

---

## 1. Slice Overview

CP-21 defines the **minimum platform-level guarantees** required so that:

- No application surface can bypass **policy evaluation**.
- **Non-cacheability** of execution and decision paths is **mechanically enforceable** (not merely documented).
- **Audit emission** is uniform and provable across **legacy and new** surfaces.

This slice is governance-closure work. It does **not** introduce new product capability.

---

## 2. Problem Statement (cite governance findings)

Governance is currently **strongest inside the Control Plane** and **weakest at the application surface boundary**, creating a bypass and drift risk.

- The architecture doctrine audit explicitly flags that while the Control Plane is compliant, the **Application Surface lacks consistent evidence of doctrine enforcement**, creating “**Doctrine Leakage**” risk. (See `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, “Summary of Risk”.)
- The doctrine audit also flags **Caching Boundaries** as **PARTIAL** because enforcement is at an “**Annotation**” level without automated evidence that edge or platform caching cannot violate non-cacheability on sensitive surfaces. (See `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, “Caching Boundaries”.)

MIG-06 requires a coordination layer that is policy-triggered, deterministic, non-autonomous, and non-cacheable across execution/decision/audit paths, and it must not widen CP-16..CP-20. (See `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md`.)

Without CP-21, MIG-06 can be “correct on paper” while still being **bypassable in practice** via legacy handlers, misconfigured caches, or non-uniform audit emission.

---

## 3. Scope (what CP-21 covers)

CP-21 covers **application surfaces** that initiate or proxy Control Plane operations, including:

- **HTTP surfaces**: Next.js route handlers, API routes, server actions, webhooks, internal service endpoints, operator-facing endpoints.
- **Non-HTTP surfaces**: scheduled tasks, background workers, message consumers, CLI invocations, and any execution entrypoint that can trigger policy evaluation, view execution, decision signals, mutations, integrations, or audit emission.
- **Legacy and new surfaces**, including but not limited to app packages under `apps/` and service packages under `services/`.

CP-21 defines **closure requirements** for:

- **Policy enforcement** (CP-16/CP-18 semantics are non-bypassable at entrypoints).
- **Cacheability** (CP-19 boundaries are enforced as a property of the system, not just types).
- **Audit emission** (uniformity and provability at the boundary).

---

## 4. Explicit Non-Goals

- No new Control Plane APIs are introduced by this slice.
- No implementation mechanisms are specified (middleware/proxy/product-specific techniques are out of scope for this spec).
- No weakening of existing doctrine (CP-16..CP-20 invariants remain binding).
- No expansion of mutation capabilities beyond CP-17 allowlist.
- No authorization model redesign (CP-21 requires closure, not a new auth system).
- No introduction of background automation infrastructure for MIG-06 (explicitly rejected by ADR-MIG-06).

---

## 5. Invariants (must-holds)

The following invariants MUST hold across all application surfaces:

1. **Fail-closed governance**
   - If policy evaluation cannot be proven, execution MUST NOT proceed.

2. **No bypass paths**
   - There MUST NOT exist any alternate pathway to execute governed actions without policy evaluation, cache boundary enforcement, and audit emission.

3. **Metadata-only exposure**
   - No surface may emit PHI/PII, payload-like content, raw rows, tenant identifiers, actor identifiers, request identifiers, cursors, or other disallowed identifiers in operator-visible outputs or audit records, consistent with CP doctrine. (See CP-16 doctrine in `docs/12-migration/slice-16/slice-16-spec.md`.)

4. **Determinism + version selection**
   - Execution MUST be reconstructable with explicit version selection and stable identifiers (per CP-18). (See `docs/12-migration/slice-18/slice-18-spec.md`.)

5. **No caching of execution, decisions, mutations, or audit**
   - Execution/decision/mutation/audit paths are always non-cacheable, consistent with CP-19. (See `docs/12-migration/slice-19/slice-19-spec.md`.)

6. **No background orchestration semantics**
   - MIG-06 orchestration MUST NOT be implemented as background jobs/queues/workers/cron or vendor-managed automation planes. (See `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md`.)

---

## 6. Required Guarantees

### 6.1 Policy enforcement closure

**Guarantee P-1 — Entry-point policy evaluation is non-bypassable**
- Every application-surface entrypoint that can trigger governed operations MUST either:
  - perform explicit policy evaluation (per the Control Plane’s sealed semantics), or
  - delegate to a Control Plane surface that performs explicit policy evaluation,
  - and MUST provide a verifiable record that policy evaluation occurred.

**Status:** REQUIRED BUT UNIMPLEMENTED (closure is not yet proven across application surfaces).

**Guarantee P-2 — Deny-by-default for unknown triggers**
- Unknown or unrecognized triggers MUST be rejected.  
**Status:** REQUIRED (normative for MIG-06 per ADR-MIG-06; evidence at application boundary is REQUIRED BUT UNIMPLEMENTED).

**Guarantee P-3 — Decision hooks cannot be bypassed**
- If decision hooks/escalation are applicable (CP-16), surfaces MUST NOT omit or strip decision signals.  
**Status:** REQUIRED BUT UNIMPLEMENTED (uniform application-surface enforcement is not proven).

### 6.2 Caching enforcement guarantees

**Guarantee C-1 — Mechanical non-cacheability**
- For any path that executes policy evaluation, view execution, decision signaling, mutation execution, or audit emission, **caching MUST be mechanically prevented**.

**Status:** REQUIRED BUT UNIMPLEMENTED.

Rationale for status:
- Doctrine audit identifies that caching boundaries are currently enforceable only at an annotation/type level, with no automated evidence preventing platform/edge caches from violating CP-19 boundaries. (See `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, “Caching Boundaries”.)

**Guarantee C-2 — No sensitive data in cache keys**
- No surface may place PHI/PII or disallowed identifiers in any cache key, correlation identifier, idempotency key, or derived keying material.  
**Status:** REQUIRED (must be demonstrated per-surface; otherwise BLOCKED).

### 6.3 Audit emission guarantees

**Guarantee A-1 — Uniform audit coverage**
- Every application surface invocation that reaches a governed boundary MUST result in audit emission with a uniform taxonomy and metadata-only payloads.

**Status:** REQUIRED BUT UNIMPLEMENTED (uniformity and provability across application surfaces is not established).

**Guarantee A-2 — Provable audit emission**
- It must be possible to prove (by evidence) that audit emission cannot be omitted for governed operations.

**Status:** REQUIRED BUT UNIMPLEMENTED.

**Guarantee A-3 — Metadata-only audit**
- Audit events MUST remain metadata-only with strict redaction rules; payload-like content is forbidden.  
**Status:** REQUIRED (aligned with doctrine audit “Audit Logging” and CP slices; surface-level proof is REQUIRED BUT UNIMPLEMENTED).

---

## 7. Application Surface Expectations

### 7.1 What legacy surfaces must comply with

Legacy surfaces MUST comply with the CP-21 guarantees without exception:

- **Policy closure**: No direct execution of governed actions without explicit policy evaluation evidence.
- **Cache closure**: No caching of execution/decision/mutation/audit paths.
- **Audit closure**: Uniform, metadata-only audit emission for governed operations.
- **Version closure**: Explicit version selection (policies/views) and reconstructability.
- **Interop closure**: Any external interaction must remain within CP-20 envelopes and constraints. (See `docs/12-migration/slice-20/slice-20-spec.md`.)

If a legacy surface cannot comply, it is **BLOCKED** from participating in MIG-06-triggered orchestration.

### 7.2 What is explicitly forbidden

The following are explicitly forbidden on any application surface:

- Any path that executes policy/view/mutation/integration logic **without policy evaluation** (deny-by-default).
- Any path that allows execution/decision/mutation/audit behavior to be **cached**.
- Any “best effort” execution (fallbacks that proceed when governance evidence is missing).
- Any bypass of CP-16 decision signaling semantics when applicable.
- Any emission of PHI/PII or forbidden identifiers in operator-visible outputs, audit events, or derived identifiers (cache keys, correlation IDs, idempotency keys).
- Any background worker/cron/queue semantics used to implement MIG-06 orchestration behavior (per ADR-MIG-06).

---

## 8. Preconditions for MIG-06

MIG-06 is **BLOCKED** until the following CP-21 preconditions are satisfied:

1. **Surface inventory exists**
   - A complete inventory of application surfaces/entrypoints that can trigger governed operations exists and is sealed as evidence.
   - **Status:** BLOCKED (no inventory is provided by this slice; must be supplied as evidence).

2. **Policy closure is proven**
   - Proof exists that no inventoried surface can bypass policy evaluation.
   - **Status:** REQUIRED BUT UNIMPLEMENTED.

3. **Caching closure is proven**
   - Proof exists that no inventoried surface can cache execution/decision/mutation/audit paths.
   - **Status:** REQUIRED BUT UNIMPLEMENTED.

4. **Audit closure is proven**
   - Proof exists that all inventoried surfaces emit uniform, metadata-only audit records for governed operations.
   - **Status:** REQUIRED BUT UNIMPLEMENTED.

5. **MIG-06 slice spec exists**
   - The referenced MIG-06 specification document MUST exist and be reviewable as an authoritative dependency.
   - **Status:** BLOCKED (the referenced file `docs/12-migration/mig-06-automation-agent-orchestration.md` is missing in this repository as of this slice authoring).

---

## 9. Completion Criteria

CP-21 is complete only when all of the following are true:

- **CC-1 — Closure evidence is present**
  - Evidence exists demonstrating that the application surface cannot bypass policy evaluation, cacheability boundaries, or audit emission.
  - If evidence cannot be provided, the slice remains **BLOCKED** (not “assumed”).

- **CC-2 — No doctrine weakening**
  - CP-16..CP-20 invariants remain unchanged and enforced (no capability expansion, no new mutation tools, no background automation semantics).

- **CC-3 — MIG-06 unblocked (governance-only)**
  - MIG-06 can proceed without introducing new unsafe surfaces or relying on “trust” in legacy routes.

---

## 10. Blocked Conditions

CP-21 and/or MIG-06 MUST be treated as BLOCKED if any of the following are true:

- **B-1 — Missing MIG-06 spec**
  - The MIG-06 migration slice specification is absent or not sealed.

- **B-2 — Missing surface inventory**
  - The platform cannot enumerate the application surfaces/entrypoints that must comply.

- **B-3 — Non-cacheability not mechanically enforced**
  - There is no proof preventing caching of execution/decision/mutation/audit paths (including at edge/CDN/platform layers).

- **B-4 — Audit emission not provable**
  - There is no proof that governed operations always emit uniform, metadata-only audit events.

- **B-5 — Any doctrine weakening is required**
  - If satisfying MIG-06 would require relaxing CP doctrine (policy-triggered, deterministic, non-autonomous, metadata-only, non-cacheable), STOP.

---

## 11. Relationship to Existing CP Slices (16–20)

CP-21 does not replace CP-16..CP-20; it **closes the boundary** so application surfaces cannot bypass them.

- **CP-16 (Escalation Paths & Decision Hooks)** (`docs/12-migration/slice-16/slice-16-spec.md`)
  - CP-21 requires decision semantics to remain non-bypassable and unstripped at the boundary.

- **CP-17 (Controlled Mutations)** (`docs/12-migration/slice-17/slice-17-spec.md`)
  - CP-21 requires that any application-surface write path remains constrained to CP-17 allowlists and approval/idempotency requirements; any alternate write path is forbidden.

- **CP-18 (Policy & View Versioning)** (`docs/12-migration/slice-18/slice-18-spec.md`)
  - CP-21 requires explicit version selection and reconstructability to be preserved at the surface, not only internally.

- **CP-19 (Performance & Caching Boundaries)** (`docs/12-migration/slice-19/slice-19-spec.md`)
  - CP-21 elevates CP-19 from “documented/type-level” to “mechanically enforceable” as a platform guarantee (without specifying mechanisms).

- **CP-20 (External Integrations & Interop)** (`docs/12-migration/slice-20/slice-20-spec.md`)
  - CP-21 requires that any external interactions originating from application surfaces remain within CP-20’s governed envelopes and constraints, and do not introduce background automation or persistence semantics.

---

## Appendix: Notes (normative status only)

- Any guarantee above marked **REQUIRED BUT UNIMPLEMENTED** MUST be treated as incomplete until evidence exists.
- Any dependency above marked **BLOCKED** MUST halt MIG-06 until resolved.

