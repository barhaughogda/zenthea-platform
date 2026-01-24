# Golden Path: Encounter Slice 02 — Authorization & Visibility Semantics

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: GOLDEN PATH FLOW
- **Domain**: Encounter
- **Slice**: 02 — Authorization & Visibility Semantics

## 2. PURPOSE
This document defines the deterministic, success-only path for authorizing access to an Encounter and deriving its visibility. It establishes the sequence of validation gates that must be cleared to reach an "Allow" decision.

## 3. PRECONDITIONS
The following conditions must be met before the Golden Path sequence begins:
- **TenantContext**: A validated `tenantId` is present in the request context.
- **AuthorityContext**: A validated `authorityId` and `correlationId` are present.
- **Capabilities**: The `AuthorityContext` contains the required capability (e.g., `encounter:read`).
- **Encounter State**: The target Encounter exists and is in a valid state as defined in Slice 01 (`CREATED`, `ACTIVE`, or `COMPLETED`).
- **Tenant Alignment**: The Encounter's owning `tenantId` matches the `TenantContext`.

## 4. GOLDEN PATH SEQUENCE

### 4.1 Context Validation
1. **Tenant Integrity**: Confirm the presence of a non-null, non-empty `tenantId` in the `TenantContext`.
2. **Authority Integrity**: Confirm the presence of a non-null `authorityId` and `correlationId` in the `AuthorityContext`.

### 4.2 Capability Validation
1. **Capability Presence**: Verify that the `AuthorityContext` contains the specific capability required for the requested operation (e.g., `encounter:read` for retrieval).
2. **Capability Validity**: Confirm the capability is active and has not been revoked or expired at the time of the request.

### 4.3 Visibility Derivation
1. **Tenant Isolation**: Confirm that the target Encounter's `tenantId` is identical to the `TenantContext`.
2. **Scope Resolution**: Derive the `EncounterVisibilityScope` based solely on the `TenantContext` and `AuthorityContext`.
3. **Visibility Confirmation**: Confirm the target Encounter falls within the derived `EncounterVisibilityScope`.

### 4.4 State Validation
1. **Lifecycle Alignment**: Verify the Encounter's `state` (from Slice 01) allows the requested operation.
2. **Terminal State Check**: If the operation involves modification, confirm the Encounter is not in a terminal state (`COMPLETED` or `CANCELLED`).

### 4.5 Authorized Access Decision
1. **Deterministic Allow**: Upon successful completion of all preceding gates, return a binary `Allow` decision.
2. **Decision Finality**: The decision is final for the scope of the current request; no further checks or overrides are performed.

### 4.6 Audit Emission
1. **Success Record**: Emit a metadata-only audit record containing:
   - `correlationId`
   - `tenantId`
   - `authorityId`
   - `encounterId`
   - `decision`: `ALLOW`
   - `timestamp`

## 5. EXPLICIT PROHIBITIONS
- **No Role Checks**: Authorization must not check for "admin", "doctor", or any other role-based labels.
- **No Branching**: The Golden Path does not contain "if/else" logic for alternative success routes.
- **No Partial Access**: An Encounter is either fully visible and authorized, or it is not. No attribute-level filtering.
- **No Failure Handling**: This path does not describe what happens when a check fails (see Failure Matrix).
- **No Implementation Details**: This document does not specify how contexts are passed or how audits are stored.

## 6. DETERMINISM STATEMENT
This Golden Path is strictly deterministic. Given a valid `TenantContext`, `AuthorityContext`, and Encounter state, the sequence will always result in a binary `Allow` decision if all invariants are satisfied. There is no ambiguity, no "break-glass" bypass, and no non-deterministic policy evaluation.
