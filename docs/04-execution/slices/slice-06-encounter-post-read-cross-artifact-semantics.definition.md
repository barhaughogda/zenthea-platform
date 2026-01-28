# Slice 06 — Encounter Post-Read / Cross-Artifact Semantics

## Status
**Design-Only**

## Scope
This slice formalizes the rules governing cross-artifact visibility and referential consistency immediately following a successful Encounter read. It defines the constraints for composing an Encounter with its related clinical artifacts.

## Post-Read Governance
All rules defined herein apply exclusively after the primary Encounter record has been successfully retrieved and authorized.

### 1. Cross-Artifact Visibility
- Visibility of related artifacts (Clinical Notes, Observations, Orders, Tasks) is strictly bound to the Encounter's context.
- Artifact inclusion in the post-read response MUST be explicit and capability-gated.
- Each included artifact MUST undergo independent re-validation of tenant and temporal constraints.

### 2. Referential Consistency
- All referenced artifacts MUST belong to the same tenant as the parent Encounter.
- Artifacts referenced by the Encounter that fail authorization or temporal validation MUST be omitted from the result set (Fail-Closed).
- The system MUST ensure that the state of related artifacts is consistent with the Encounter's temporal state at the time of the read.

### 3. Read-Time Composition Constraints
- Composition is deterministic; the resulting data set MUST represent a static snapshot of the Encounter and its explicitly requested artifacts.
- No additional data may be fetched implicitly beyond the requested scope.
- Artifact inclusion is additive and success-only; failure to retrieve an optional artifact MUST NOT invalidate the primary Encounter read, but MUST NOT return partial or corrupted artifact data.

### 4. Prohibitions on Derived and Inferred Data
- No derived state may be computed during or after the read operation.
- No inferred relationships between artifacts may be materialized.
- Background enrichment of the data set is strictly prohibited.

### 5. Operational Guarantees
- **Read-Only Guarantee**: The post-read composition process MUST NOT trigger any state changes in the Encounter or related artifacts.
- **Zero Mutation**: No data transformation or normalization is permitted during composition.
- **Deterministic Composition**: Identical requests against the same state MUST yield identical composed structures.
- **Fail-Closed Semantics**: Any artifact failing a security or integrity check MUST be excluded from the composed view.
- **Audit Integrity**: Success-only audit events MUST be emitted. No new audit types are introduced by this slice.

## Explicit Prohibitions
The following behaviors are strictly prohibited:
- **Graph Traversal**: Navigating beyond the immediate relationships defined by the Encounter.
- **Implicit Joins**: Automatic inclusion of related data without explicit request and capability gating.
- **Fan-out Reads**: Unbounded recursive fetching of related artifacts.
- **Lazy Loading**: Deferred retrieval of artifact data after the initial response is generated.
- **Background Enrichment**: Asynchronous fetching or computation to augment the read result.
- **Cross-Tenant Aggregation**: Any operation that accesses data across tenant boundaries.
- **Role-Based Exceptions**: Security and visibility rules apply uniformly regardless of the requesting role.
