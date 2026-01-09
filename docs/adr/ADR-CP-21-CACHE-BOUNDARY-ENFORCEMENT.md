# ADR-CP-21: Cache Boundary Enforcement (Repo-Verifiable, Deny-by-Default)

## 1) Title and Status

**Title:** CP-21 Cache Boundary Enforcement (Repo-Verifiable, Deny-by-Default)  
**Status:** **Accepted – Documentation Locked**

---

## 2) Context

### 2.1 Why annotation-level caching controls are insufficient

CP-21 requires that governed execution/decision/mutation/audit paths are **non-cacheable as a system property**, not as a developer intention.

Annotation-level or framework-local caching guidance is insufficient because it:

- Can be overridden or bypassed by intermediaries and configuration drift across layers capable of caching (framework/runtime/edge/proxy/CDN/client).
- Cannot prove negative cases (that caching cannot be silently re-enabled without detection).
- Cannot provide **full-surface completeness** (unknown or newly introduced governed entrypoints remain unsafe by default).
- Does not produce deterministic, reviewable, repeatable evidence adequate for governance sealing.

This is directly aligned with the doctrine audit finding that **Caching Boundaries are PARTIAL** when enforcement is only “annotation-level” without automated evidence that platform/edge caches cannot violate the boundary (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, “Caching Boundaries”).

### 2.2 Why CP-21 Phase E1 is blocked without a mechanical enforcement layer

CP-21 Phase E1 (“Mechanical Non-Cacheability”) explicitly requires:

- **No cache replay** of governed outputs at any layer.
- **Fail-closed** behavior when cacheability cannot be proven.
- **Full inventory coverage**: no sampling, no partial coverage.
- **Proof artifacts** that are reviewable and repeatable.

Without a single, mechanical enforcement layer that is **hard to bypass** and **repo-verifiable**, E1 cannot be proven. Proof cannot be established by policy statements, conventions, or assumptions about runtime behavior.

### 2.3 Why vendor assumptions are forbidden and how this ADR avoids them

Vendor or platform assumptions are forbidden because they are not stable, reviewable, or enforceable from the repository:

- Vendor dashboards and defaults are mutable outside code review.
- Platform behavior can change without repository state changes.
- Proof that depends on external screenshots or “settings we checked” is not deterministic, not auditable, and not sealable.

This ADR avoids vendor assumptions by defining a **repository-verifiable contract**:

- The enforcement requirements must be represented in repo state (configs/contracts/tests/inventory).
- Proof must be reproducible via deterministic scripts and sealed inventories, without relying on vendor-specific controls or dashboards.

---

## 3) Decision

### 3.1 Platform invariant

The platform declares the following invariant:

> **All governed execution, decision, mutation, and audit paths MUST be non-cacheable by construction.**

This is not a best-effort guideline. It is a **hard safety property** required by CP-19 and required to satisfy CP-21 Phase E1.

### 3.2 Cache Boundary Enforcement Layer (required)

The platform MUST implement exactly one repo-verifiable **Cache Boundary Enforcement Layer** (CBEL) that:

- Applies **deny-by-default** to caching for governed paths.
- Produces **deterministic, reviewable evidence** that the deny-by-default boundary holds for every governed entrypoint.
- Is **hard to bypass**, including protection against:
  - accidental omission,
  - partial adoption,
  - local overrides,
  - configuration drift.

This ADR defines the contract and evidence model for CBEL; it does not prescribe mechanisms, vendors, frameworks, CDNs, or infrastructure products.

---

## 4) Scope

CBEL applies to every surface that can initiate, proxy, or complete any of the following governed paths (CP-21 scope):

- **Execution**: execution orchestration and execution results.
- **Decision**: policy evaluation, allow/deny outcomes, decision signals.
- **Mutation**: any state-changing actions and their outcomes (including side effects).
- **Audit**: audit emission and acknowledgements for governed operations (including denials and failures).

### Explicit exclusions

CBEL explicitly does **not** apply to:

- Static assets (e.g., images, JS/CSS bundles) that do not become governed surfaces.
- Public, non-governed marketing pages and content.

If any excluded surface becomes governed (i.e., can initiate/proxy/complete execution/decision/mutation/audit), it immediately becomes in-scope and must be added to the sealed inventory and proofs.

---

## 5) Invariants (non-negotiable)

The following invariants MUST hold. No exceptions.

- **No cache replay of governed outputs across any layer**
  - Governed outputs MUST NOT be served from any stored representation of a prior invocation.
  - This prohibition applies across framework/runtime/edge/proxy/CDN/client and any intermediary capable of caching.

- **No silent caching re-enablement**
  - It MUST NOT be possible to re-enable caching for governed paths without a detectable, deterministic violation that is caught by repo-anchored proofs and results in denial/blocking.

- **No sampling; full coverage required**
  - Proof MUST cover **every** inventoried governed entrypoint. Sampling is forbidden.

- **No vendor-specific proofs**
  - Proof MUST NOT depend on vendor dashboards, screenshots, or vendor-only configuration state that is not represented and reviewable in the repository.

---

## 6) Proof and Evidence Model (critical)

E1 is provable only when the following evidence artifacts exist and are repo-verifiable.

### 6.1 Acceptable proof artifacts (repo-verifiable)

All artifacts below are REQUIRED.

#### A) Static config evidence (checked into repo)

The repository MUST contain deterministic, reviewable configuration artifacts demonstrating the cache boundary contract for governed paths, including:

- **Header rules / response contract surfaces** expressed as code or configuration that is reviewable and versioned.
- **Middleware/adapter contract surfaces** that enforce “deny-by-default for governed paths” and define the governed classification boundary.
- **Adapter constraints** that prevent governed paths from being treated as cacheable by default.

These artifacts must be reviewable in PRs and cannot be represented only as external configuration.

#### B) Runtime evidence (deterministic scripted verification)

The repository MUST include deterministic scripts/tests that:

- Enumerate **every** inventoried governed entrypoint.
- Issue repeatable requests (or equivalent invocations for non-HTTP entrypoints).
- Verify that caching is prohibited per the boundary contract for each entrypoint.

For HTTP-governed entrypoints, runtime proof MUST validate:

- Presence of cache-prohibiting response directives and metadata consistent with “non-cacheable by construction”.
- Absence of caching-friendly directives or ambiguous cache semantics for governed responses.

For non-HTTP-governed entrypoints, runtime proof MUST validate:

- Governed outputs are not reused from any memoized/shared cache between invocations in a way that would constitute replay.
- Any attempt to enable reuse/replay is detected and treated as a violation (fail-closed).

These proofs MUST be deterministic and runnable by an independent reviewer from repository state.

#### C) Governance evidence (sealed surface inventory + mapping)

The repository MUST contain a sealed, authoritative inventory that:

- Lists **every** governed entrypoint (HTTP and non-HTTP) within CP-21 scope.
- Classifies each entrypoint by governed reachability (execution/decision/mutation/audit).
- Maps each entrypoint to its proof artifacts (static config + runtime verification).

The inventory and mapping MUST be treated as governance evidence: reviewed, complete, and sealed. Unknown surfaces are not permitted.

### 6.2 Explicitly insufficient proofs (non-acceptable)

The following do not count as proof and MUST NOT be used to claim E1 completion:

- Manual spot-checks or ad-hoc verification.
- Vendor dashboard configuration or screenshots without repo-represented state.
- “We set annotations/flags” without cross-layer, runtime-verifiable evidence.
- Sampling (“we tested some routes”) instead of full inventory coverage.
- Claims of safety based on absence of incidents.

---

## 7) Explicitly Rejected Alternatives

The following approaches are explicitly rejected:

- **Annotation-only caching guidance**
  - Rejected because it is not mechanically enforced across all cache-capable layers and is not provable.

- **Relying on CDN / platform defaults**
  - Rejected because defaults are vendor-defined, mutable, and not repo-verifiable.

- **Vendor dashboard configuration without repo representation**
  - Rejected because it bypasses code review and cannot be sealed as deterministic evidence.

- **Partial coverage / sampling**
  - Rejected because it leaves bypass paths and cannot satisfy CP-21 completeness requirements.

- **Treating browser cache as sufficient enforcement**
  - Rejected because browser cache controls do not constrain upstream caching layers and do not provide cross-layer guarantees.

---

## 8) Consequences

### 8.1 What this enables

- **CP-21 Phase E1 proofability**
  - Establishes a platform-level contract and evidence model so E1 completion can be sealed without vendor assumptions.

- **MIG-06 readiness gating**
  - Establishes a deterministic boundary necessary for MIG-06’s policy-triggered, deterministic, non-autonomous orchestration model to be meaningfully auditable and non-replayable.

### 8.2 What this forbids

- Shipping or exposing any governed path without CBEL enforcement and repo-verifiable proofs.
- Treating “non-cacheable” as a documentation-only requirement.
- Declaring E1 complete without full inventory coverage and deterministic verification.

### 8.3 Follow-on documentation artifacts required

To operationalize this ADR, the following documentation artifacts are expected (as separate work, not in this ADR):

- A sealed **E1 governed surface inventory** (authoritative list).
- A sealed **proof mapping** from each entrypoint to static config evidence and runtime verification artifacts.
- A sealed **closure statement** declaring E1 complete only when the above evidence is present and reproducible.

---

## 9) Relationship to CP-21 and MIG-06

- **MIG-06 remains NO-GO** until:
  - the Cache Boundary Enforcement Layer is implemented **and**
  - CP-21 Phase E1 proofs are produced, reviewable, repeatable, and **sealed**.

- **CP-21 E2/E3 are blocked until E1 is proven**
  - Policy closure (E2) and uniform audit emission (E3) cannot be meaningfully claimed if governed outputs can be replayed via caching.

This ADR is therefore a hard prerequisite for CP-21 governance closure and a hard gate for MIG-06 execution readiness.

