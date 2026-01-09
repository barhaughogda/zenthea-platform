# CP-21 Phase E1 — Mechanical Non-Cacheability (Planning)
**Slice ID:** CP-21 / Phase E1  
**Document Type:** Enforcement planning (NOT implementation)  
**Status:** Planned  
**Owner:** Platform Architecture  
**Constraints:** Declarative only; deny-by-default; evidence required; no mechanism selection; no scope expansion beyond E1.

---

## 1. Phase Scope

### What “mechanical non-cacheability” means

For CP-21, “mechanical non-cacheability” means:

- **No governed output may be reused**: no layer may serve execution, decision, mutation, or audit outcomes from any stored representation of a prior invocation.
- **Non-cacheability is an enforced runtime property**: it is not satisfied by intent, convention, or annotation alone.
- **Non-cacheability is provable**: an independent reviewer can validate the claim for every in-scope surface using recorded evidence, without inferring hidden mechanisms.
- **Fail closed**: uncertainty about cacheability is treated as cacheability, and therefore results in **BLOCKED**.

**Governed paths (E1 applies to all):**

- **Execution paths**: tool execution and any execution orchestration entrypoints.
- **Decision paths**: policy evaluation, allow/deny decisions, and decision signaling / classification.
- **Mutation paths**: any state-changing actions (including writes, side effects, and idempotency-affecting actions).
- **Audit paths**: audit emission for governed operations (including failure/denial paths).

### What surfaces are in-scope

In-scope surfaces are **all application-surface and control-plane entrypoints** that can initiate, proxy, or complete any governed path above, including:

- **HTTP entrypoints**: routes, handlers, webhooks, server actions, internal APIs.
- **Non-HTTP entrypoints**: scheduled tasks, background workers, message consumers, CLI invocations, job runners.
- **Proxy surfaces**: any “edge” or intermediary layer that may receive a governed request and return a governed response.

**Important:** E1 scope is determined by an authoritative surface inventory. If that inventory does not exist, scope is **UNKNOWN** and E1 is **BLOCKED**.

### What is explicitly out-of-scope

E1 does **not** cover:

- Policy correctness, authorization model correctness, or policy closure (E2 scope).
- Audit schema uniformity, taxonomy design, or metadata boundary enforcement (E3 scope).
- Performance, caching enablement, “safe caching,” or “selective caching” for governed paths.
- Vendor/tool/framework selection or prescriptive enforcement mechanisms.
- Any new orchestration capability, migration capability, or feature work (MIG slices).

---

## 2. Threat Model

### Where caching can occur

Caching risk exists at any layer capable of storing and replaying outputs, including (non-exhaustive):

- **Framework/build layer**: static generation, prerendering, route memoization, handler caching, incremental regeneration, build artifacts reused as responses.
- **Application runtime**: in-memory caches, shared caches, memoized function results, data-fetch caches, API client caches.
- **Edge / proxy / gateway**: reverse proxy caches, API gateway caching, intermediate caches between caller and governed boundary.
- **CDN**: edge caches and content caches capable of re-serving prior responses.
- **Browser / client**: HTTP caches, service worker caches, application storage acting as cache, replay of prior responses.
- **Inter-service transport**: any intermediary that can cache responses or decisions.
- **Observability / replay systems**: systems that can replay prior outputs into live flows (treated as caching if used as a response source).

### Why annotation-level controls are insufficient

Annotation-level controls (or “we marked it non-cacheable”) are insufficient because:

- **They are bypassable by configuration drift** in intermediaries or defaults.
- **They cannot cover unknown or missing surfaces** (unknown surfaces default to unsafe).
- **They cannot prove negative cases** (that caching cannot be re-enabled silently).
- **They do not bind every layer** capable of caching; doctrine requires cross-layer prohibition, not best-effort hints.

The doctrine audit explicitly flags caching boundaries as **PARTIAL** where enforcement is “annotation-level” without automated evidence (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`).

---

## 3. Enforcement Surface Inventory (REQUIRED)

### Categories of endpoints / paths that must be non-cacheable

The authoritative inventory must categorize (at minimum) all entrypoints into:

- **Category A — Governed execution entrypoints**: any entrypoint that can trigger or return execution results.
- **Category B — Governed decision entrypoints**: any entrypoint that can trigger or return policy decisions / decision signals.
- **Category C — Governed mutation entrypoints**: any entrypoint that can trigger or return mutation outcomes.
- **Category D — Governed audit entrypoints**: any entrypoint that emits, forwards, or acknowledges audit events for governed operations.
- **Category E — Proxy/aggregation entrypoints**: any entrypoint that can return a response derived from A–D, even if it does not execute A–D itself.

E1 applies to **all** categories above. Category E is explicitly included because proxy caching is a primary leakage vector.

### Explicit requirement for an authoritative surface inventory

An authoritative surface inventory is **mandatory** before E1 can be evaluated as complete.

At minimum, each inventory entry must include:

- **Unique identifier** for the entrypoint and its callable path (or equivalent identifier for non-HTTP).
- **Surface type** (HTTP/non-HTTP/proxy) and **ownership** (app/service/package).
- **Governed reachability**: whether it can reach (A) execution, (B) decision, (C) mutation, (D) audit.
- **Cache risk map**: identified cache-capable layers on the request/response path (framework/runtime/edge/client/etc.).
- **Evidence references**: links to the proof artifacts used to establish non-cacheability for this entry.

### STOP condition: lack of inventory

If the inventory is missing, incomplete, disputed, or not sealed as authoritative evidence, then:

- E1 is **BLOCKED**.
- CP-21 cannot claim application-surface governance closure for non-cacheability.
- No downstream phase (E2/E3) may proceed under CP-21.

---

## 4. Required Guarantees

### What must be provably true at runtime

For every in-scope inventoried entrypoint that can reach governed paths (execution, decision, mutation, audit), it must be provably true that:

- **G1 — No cache replay**: outputs are never served from any cache (including intermediary caches) for governed paths.
- **G2 — No silent enablement**: caching cannot become enabled for governed paths without a detectable violation that causes denial or blocks participation.
- **G3 — Cross-layer prohibition**: non-cacheability holds across every cache-capable layer in the request/response path (framework, runtime, edge/proxy/CDN, client).
- **G4 — Deterministic “fail-closed” behavior**: when cacheability cannot be proven for a surface, that surface is treated as unsafe and is denied participation in governed operations.
- **G5 — Audit and decision outputs are non-cacheable**: audit and decision outputs are treated as governed outputs even if they contain “metadata only”.

### What must never be possible

It must never be possible that:

- **N1 — A governed response is served from any cached representation**, regardless of requester identity, headers, or route semantics.
- **N2 — A policy decision is reused** for a later invocation in a way that can change allow/deny outcomes.
- **N3 — A mutation outcome is replayed** such that callers receive a stale “success”/“failure” not derived from the live governed path.
- **N4 — An audit emission acknowledgement is replayed** such that audit appears emitted when it was not.
- **N5 — Non-cacheability depends on developer discipline** (manual steps, conventions, or “remember to set X”).

---

## 5. Proof Requirements

### What evidence is acceptable to prove non-cacheability

Evidence must be **reviewable, repeatable, and tied to the sealed inventory**. Acceptable evidence includes:

- **P1 — Sealed surface inventory**: authoritative, complete, and signed/approved as the basis for completeness.
- **P2 — Runtime observation evidence** for each inventoried entrypoint:
  - repeated invocations demonstrating that outputs are produced by live execution/decision/mutation/audit paths rather than replay;
  - request/response metadata demonstrating cache prohibition across the applicable layers in the path;
  - intermediary observations (logs/telemetry/status indicators) demonstrating that cache-capable layers did not store or serve governed outputs.
- **P3 — Negative-case evidence**:
  - evidence that misconfiguration or omission does not silently re-enable caching without detection and fail-closed behavior.
- **P4 — Completeness mapping**:
  - a table mapping **every** inventoried entrypoint to its proof artifacts and reviewer sign-off.

Evidence may be derived from tests, traces, logs, or captured runtime artifacts, but must be sufficient for an independent reviewer to conclude “non-cacheable” without relying on intent.

### What evidence is explicitly insufficient

The following are explicitly insufficient and do not count as E1 proof:

- “We set an annotation/flag” without cross-layer, runtime-verifiable evidence.
- Documentation claims without captured runtime observation.
- Partial sampling (“we tested some routes”) in place of full-inventory coverage.
- Absence of known incidents (“we didn’t see caching happen”).
- Proof that depends on unspecified future mechanisms (“we will add X later”).

### How proof must be reviewed and recorded

- Proof must be recorded as a **reviewable evidence pack** tied to the sealed inventory.
- Review must be performed by a designated reviewer (not the author of the evidence pack).
- The review outcome must be recorded with explicit statements of:
  - inventory completeness acceptance,
  - guarantee coverage acceptance (G1–G5, N1–N5),
  - enumerated exceptions (exceptions are not allowed; any exception is a STOP condition).

---

## 6. Preconditions

E1 must not begin implementation work (and must not claim completion) unless all preconditions below are satisfied:

- **PR1 — Authoritative CP-21 scope document exists and is sealed**  
  The repository currently references `docs/12-migration/slice-21-application-surface-governance.md` as authoritative input, but this file is **missing at that path**. Until an authoritative scope definition exists and is sealed, E1 scope is **UNKNOWN** and therefore **BLOCKED**.

- **PR2 — Authoritative surface inventory exists and is sealed**  
  Inventory absence or incompleteness is a **STOP condition** (see Section 3).

- **PR3 — Doctrine binding**  
  The doctrine audit finding “Caching Boundaries = PARTIAL” is acknowledged as binding input requiring mechanical proof (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`).

- **PR4 — MIG-06 authoritative constraints are available for dependency review**  
  This plan must not assume MIG-06 constraints. The requested file `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md` is **missing at that path** in this repository. Until authoritative MIG-06 constraints are available, any attempt to treat E1 as an unblocker for MIG-06 is **BLOCKED** by definition (see Section 9).

---

## 7. Non-Goals

E1 explicitly does not attempt to:

- Define or implement enforcement mechanisms (no frameworks, middleware, vendor configs, or infra/tool selection).
- Improve performance or introduce caching for governed paths.
- Address policy enforcement closure (E2).
- Address uniform audit emission (E3).
- Redesign orchestration, approval flows, or permission models (MIG-06 and beyond).
- Expand CP-21 scope beyond mechanical non-cacheability.

---

## 8. Stop Conditions

E1 must halt or be abandoned (treated as **BLOCKED**) if any of the following are true:

- **SC1 — No authoritative surface inventory**: inventory missing, incomplete, disputed, or unsealed.
- **SC2 — Missing authoritative scope anchor**: `slice-21-application-surface-governance.md` (or an approved authoritative replacement) is not available and sealed.
- **SC3 — Any governed path is cacheable at any layer**: any observed cache hit, cache replay, or cache storage behavior affecting governed outputs.
- **SC4 — Unprovable claim without mechanism guessing**: if proving non-cacheability requires assuming a mechanism not evidenced at runtime, E1 is **BLOCKED**.
- **SC5 — Partial coverage**: any claim of completion that does not cover **every** inventoried entrypoint and category (A–E).
- **SC6 — Uncertainty tolerated**: any “unknown” cache layer, “probably not cached,” or “best effort” posture.

If any stop condition is met, E1 completion is not claimable and downstream phases must not proceed.

---

## 9. Relationship to CP-21 and MIG-06

### Why E1 is mandatory before E2/E3

- E2 (policy closure) and E3 (audit emission) depend on the assumption that governed outputs are **live** and not replayed.
- If caching is possible, then:
  - policy decisions can be replayed (invalidating deny-by-default),
  - mutation results can be replayed (invalidating controlled mutations),
  - audit acknowledgements can be replayed (invalidating audit completeness).
- Therefore E1 is mandatory, and **must be proven** before E2 or E3 are allowed to claim meaningful enforcement closure.

### Why partial E1 completion is insufficient to unblock MIG-06

MIG-06 concerns orchestration and agent automation. Any orchestration model is invalid if governed decisions/executions/mutations/audits can be replayed from caches, because it undermines determinism and auditability.

Partial E1 completion is insufficient because:

- Unknown or missing surfaces become bypass paths.
- Proof cannot be generalized from a subset to the full application surface.
- “Some surfaces non-cacheable” is indistinguishable from “governance leakage exists.”

**Additionally (hard BLOCKER):** The requested authoritative MIG-06 ADR (`docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md`) is not present at that path in this repository. Without authoritative MIG-06 constraints, it is not valid to claim E1 unblocks MIG-06 without making implementation guesses. This is explicitly **BLOCKED**.

---

## Appendix A — Inputs (Actual vs Required)

### Inputs read for this plan

- `docs/12-migration/slice-21-enforcement-plan.md`
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`
- `docs/01-architecture/execution-standards.md`
- `docs/10-decisions/adr-007-external-tool-orchestration.md`

### Required inputs referenced by CP-21 but missing at specified paths

- `docs/12-migration/slice-21-application-surface-governance.md` (**missing at this path**)
- `docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md` (**missing at this path**)

