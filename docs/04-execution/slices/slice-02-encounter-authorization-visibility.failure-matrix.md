# Failure Matrix: Encounter Slice 02 — Authorization & Visibility Semantics

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: FAILURE MATRIX
- **Domain**: Encounter
- **Slice**: 02 — Authorization & Visibility Semantics

## 2. FAILURE SEMANTICS (ABSOLUTE RULES)
- **Fail CLOSED**: Any failure results in an immediate abort and a binary "Deny" decision.
- **NO Audit Emission**: Failures MUST NOT emit audit records to prevent side-channel leakage or log flooding.
- **NO Partial Visibility**: If authorization fails, the resource is treated as non-existent.
- **NO Retries**: Authorization failures are terminal for the request.
- **NO Role-based Bypass**: No identity or role can override a failed capability or context check.
- **NO Error Detail Leakage**: Responses MUST NOT contain details about which specific gate failed.
- **NO State Mutation**: Failure paths MUST NOT modify any system or resource state.

## 3. FAILURE SCENARIOS

### 3.1 Tenant Context Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-101 | Missing `tenantId` in `TenantContext` | 4.1.1 Tenant Integrity | Immediate abort; Return Deny |
| FM-02-102 | Malformed `tenantId` (invalid format) | 4.1.1 Tenant Integrity | Immediate abort; Return Deny |
| FM-02-103 | Cross-tenant access attempt (`tenantId` mismatch) | 4.3.1 Tenant Isolation | Immediate abort; Return Deny |

### 3.2 Authority Context Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-201 | Missing `authorityId` in `AuthorityContext` | 4.1.2 Authority Integrity | Immediate abort; Return Deny |
| FM-02-202 | Malformed `authorityId` (invalid format) | 4.1.2 Authority Integrity | Immediate abort; Return Deny |
| FM-02-203 | Missing `correlationId` in `AuthorityContext` | 4.1.2 Authority Integrity | Immediate abort; Return Deny |

### 3.3 Capability Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-301 | Required capability (e.g., `encounter:read`) absent | 4.2.1 Capability Presence | Immediate abort; Return Deny |
| FM-02-302 | Capability revoked or expired | 4.2.2 Capability Validity | Immediate abort; Return Deny |

### 3.4 Visibility Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-401 | Encounter outside derived `EncounterVisibilityScope` | 4.3.3 Visibility Confirmation | Immediate abort; Return Deny |
| FM-02-402 | Visibility derivation failure (internal scope error) | 4.3.2 Scope Resolution | Immediate abort; Return Deny |

### 3.5 State Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-501 | Encounter in invalid lifecycle state for operation | 4.4.1 Lifecycle Alignment | Immediate abort; Return Deny |
| FM-02-502 | Modification attempt on terminal state (`COMPLETED`/`CANCELLED`) | 4.4.2 Terminal State Check | Immediate abort; Return Deny |

### 3.6 Resource Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-601 | Encounter resource not found | 3.0 Preconditions | Immediate abort; Return Deny |

### 3.7 System Failures
| ID | Failure Scenario | Gate Mapping | Deterministic Behavior |
| :--- | :--- | :--- | :--- |
| FM-02-701 | Persistence lookup failure (database unreachable) | 3.0 Preconditions | Immediate abort; Return Deny |
| FM-02-702 | Dependency unavailability (context provider down) | 4.1 Context Validation | Immediate abort; Return Deny |
