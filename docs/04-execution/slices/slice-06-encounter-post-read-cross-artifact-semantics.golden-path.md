# Golden Path: Encounter Slice 06 — Post-Read / Cross-Artifact Semantics

## Status
**DESIGN-ONLY**

## Overview
This document defines the successful, deterministic path for composing a consistent snapshot of an Encounter and its explicitly requested related artifacts. It establishes the semantics for cross-artifact resolution, independent authorization, and static composition within a read-only context.

## 1. Composition Scope Declaration
The composition process begins with the explicit declaration of the required artifact scope. Only artifacts explicitly requested and supported by the system are considered for inclusion. The scope serves as the boundary for the composition operation, ensuring that no implicit or unauthorized data traversal occurs.

## 2. Capability-Gated Artifact Inclusion
Artifact inclusion is governed by capability-gated resolution. Each artifact requested within the scope must correspond to a capability granted to the requesting actor. If the actor lacks the requisite capability for a specific artifact type, that artifact is omitted from the final composition without impacting the resolution of the primary Encounter or other authorized artifacts.

## 3. Independent Artifact Authorization
Each artifact identified for inclusion undergoes independent authorization. The system validates the actor's access rights against each specific artifact instance. Authorization is not inherited from the parent Encounter; it is evaluated per artifact to ensure strict adherence to security boundaries.

## 4. Tenant and Temporal Re-validation
For every artifact included in the composition, the system re-validates:
- **Tenant Alignment**: The artifact must belong to the same tenant context as the primary Encounter.
- **Temporal Consistency**: The artifact must satisfy the temporal constraints active at the time of the read operation, ensuring that the composed snapshot represents a consistent state across all included entities.

## 5. Deterministic Composition and Omission
The final composition is a static, deterministic structure. 
- **Success-Only Inclusion**: Only artifacts that pass all validation and authorization checks are included.
- **Silent Omission**: Artifacts that are unauthorized, invalid, or missing are omitted from the composition. This omission is a valid state and does not trigger a failure scenario for the overall read operation.
- **Ordering**: The composition follows a deterministic ordering based on artifact type and identifier to ensure consistent output for identical requests.

## 6. Read-Only Invariants
The composition process is strictly read-only.
- **Zero Mutation**: No state changes are permitted within the Encounter or any related artifacts during the composition process.
- **Snapshot Integrity**: The resulting composition is a point-in-time snapshot that remains static once returned to the requester.

## 7. Audit Emission
Upon successful composition and delivery of the snapshot, the system emits a success-only audit event. This event records the scope of the composition, the artifacts included, and the authorization context, providing a verifiable record of the cross-artifact read operation.
