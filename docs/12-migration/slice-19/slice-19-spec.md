# Slice 19 – Performance & Caching Boundaries

**Status:** Approved  
**Owner:** Platform Architecture  
**Scope:** Control-Plane Governance  

---

## Purpose

Define and enforce explicit performance and caching boundaries for the Zenthea Platform. This slice ensures that future performance optimizations do not compromise auditability, determinism, or safety. It establishes "Type-Level Governance" for cacheability.

---

## Doctrine (Non-Negotiables)

1.  **Auditability > Speed**: Execution results, mutation outcomes, and decision hooks MUST NEVER be cached.
2.  **Determinism**: Only pure, side-effect-free functions (e.g., Version Resolution) may be memoized.
3.  **No Infrastructure**: This slice introduces logic and types, not Redis or TTL-based in-memory caches.
4.  **No PHI in Keys**: Cache keys must never contain sensitive identifiers (PHI, actorId, tenantId).
5.  **Explicit Boundaries**: Every major read/write path must be labeled with its cacheability tier.

---

## Caching Boundaries (Tiers)

| Tier | Description | Examples | Invalidation |
| :--- | :--- | :--- | :--- |
| **NONE** | No caching allowed. Must execute fresh every time. | Policy Execution, Mutations, Decisions, Audits | N/A |
| **READ_MODEL_ONLY** | Caching allowed for hydrated views of underlying data. | Saved Views, Registry Lookups | On registry change |
| **METADATA_ONLY** | Caching allowed for static definitions. | Policy Definitions, View Definitions, Version Maps | Process Restart |

---

## Rules for Memoization

Memoization is permitted ONLY for pure functions that meet all of the following:
- **Parameter-Keyed**: Result depends solely on input parameters.
- **Process-Local**: Stored in local memory, not shared across instances.
- **Side-Effect Free**: Does not trigger logs, signals, or mutations.
- **Explicitly Labeled**: Annotated with `/** SAFE_TO_MEMOIZE */`.

### Approved Candidates for Memoization
- `VersionResolver.resolvePolicy`
- `VersionResolver.resolveView`
- `PolicyEvaluator.evaluate` (Logic only, no emission)
- Registry Lookups

---

## Forbidden Caching Locations
- `ToolExecutionGateway.execute`
- `MockMutationExecutor.execute`
- `IdempotencyStore` (It is a store, not a cache)
- Decision Hooks (Approval signals)
- Audit Emission

---

## Cache Key Composition
Cache keys for versioned entities MUST follow:
`[entityType]:[id]@[version]:[paramsHash]`

---

## Acceptance Criteria
- [x] Cache boundaries documented and implemented.
- [x] `VersionResolver` uses safe, in-memory memoization.
- [x] Execution and Mutation paths are explicitly labeled `NONE` cacheability.
- [x] Tests verify that execution is never cached.
- [x] Tests verify that memoization does not break resolution logic.
