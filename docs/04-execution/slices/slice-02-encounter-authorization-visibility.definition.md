# Encounter Slice 02: Authorization & Visibility Semantics

- **Slice Name**: Authorization & Visibility Semantics
- **Slice Number**: 02
- **Domain**: Encounter
- **Status**: DESIGN-ONLY
- **Scope**: Authorization & Visibility Semantics for Encounter access

## 2) Purpose
Slice 02 defines the deterministic rules for authorizing access to and governing the visibility of Encounter resources. It builds upon the domain definition in Slice 00 and the lifecycle state machine established in Slice 01. This slice ensures that all operations on an Encounter are governed by capability-based authorization and strict tenant isolation, preventing unauthorized access or state transitions.

## 3) Definitions (Conceptual, Non-Executable)
- **TenantContext**: Mandatory context identifying the tenant owning the resource. All operations must occur within a validated `TenantContext`.
- **AuthorityContext**: Mandatory context identifying the actor and their authorized state. Includes `correlationId` and `authorizedAt` (conceptual timestamp of authorization).
- **Capability Model**: A capability-based access control mechanism. Access is granted based on the possession of specific capabilities (e.g., `encounter:read`, `encounter:write`), not roles or groups.
- **EncounterVisibilityScope**: Conceptual boundary defining which Encounters are visible to an `AuthorityContext` within a `TenantContext`.
- **EncounterIdentity**: The unique identifier for an Encounter (`encounterId`).
- **EncounterState**: The current state of the Encounter as defined in Slice 01 (`CREATED`, `ACTIVE`, `COMPLETED`).

## 4) Non-Negotiable Invariants
- **Absolute Tenant Isolation**: No cross-tenant reads or writes. A request context for Tenant A must never access resources belonging to Tenant B.
- **Fail-Closed**: Any ambiguity in authorization or visibility must result in an immediate abort of the operation (Deny by default).
- **No "Admin Bypass"**: There are no superuser accounts or administrative roles that bypass these rules. All access must be explicitly authorized via capabilities.
- **Deterministic Outcomes**: Visibility and authorization results must be binary (Allow/Deny) and deterministic based on the provided context and resource state. No partial visibility of resource attributes.
- **Audit Emission**: Successful authorization events must emit metadata-only audit records. Zero audit emission on authorization failure to prevent information leakage.
- **No New Write Permissions**: Visibility semantics do not grant or imply write permissions. Write access is strictly governed by authorization rules.

## 5) Authorization Rules (Conceptual)
- **Read Access**: Minimum capability `encounter:read` required to retrieve an Encounter or its metadata.
- **State Transition (Create)**: Minimum capability `encounter:write` required to initialize an Encounter in the `CREATED` state.
- **State Transition (Activate/Complete)**: Minimum capability `encounter:write` required. Transitions must strictly obey the Slice 01 state machine ordering.
- **Explicit Deny Conditions**:
    - Missing required capability in `AuthorityContext`.
    - Revoked or expired capability.
    - Malformed or missing `TenantContext` or `AuthorityContext`.
    - Tenant mismatch between request context and resource.

## 6) Visibility Rules (Conceptual)
- **Derivability**: Visibility must be derivable solely from the `TenantContext`, `AuthorityContext`, and the Encounter's own metadata.
- **No External Joins**: Visibility logic must not depend on external ACL tables, role mapping tables, or dynamic policy engines.
- **Prohibitions**:
    - No dynamic ACLs or per-resource permission overrides.
    - No feature-flag-based visibility.
- **NOT IN SCOPE**:
    - Sharing links or temporary access identifiers.
    - Patient portal access semantics.
    - Organization-wide browsing or search.
    - Emergency "break-glass" overrides.

## 7) Failure Semantics (High Level)
- **Failure Categories**:
    - `CONTEXT_MISSING`: Required `TenantContext` or `AuthorityContext` not provided.
    - `TENANT_MISMATCH`: Request tenant does not match resource tenant.
    - `CAPABILITY_MISSING`: Required capability not present in `AuthorityContext`.
    - `RESOURCE_NOT_FOUND`: Resource does not exist or is not visible to the caller (indistinguishable for security).
    - `INVALID_TRANSITION`: Authorization passed but Slice 01 state machine rules were violated.
- **Fail-Closed**: All failures result in a generic "Access Denied" or "Not Found" response to the caller.
- **No Leakage**: Error messages must not reveal the existence of resources or the specific reason for authorization failure.

## 8) Out of Scope
- UI components or workflow implementations.
- Background jobs or asynchronous processing.
- Cross-tenant federation or resource sharing.
- Audit-on-failure logging.
- Manual overrides or "superuser" functionality.

## 9) Lock Intent
This definition is lock-ready once the following artifacts are created for Slice 02:
- Golden Path
- Failure Matrix
- Test Matrix
- Implementation Sequencing
- Lock Note
