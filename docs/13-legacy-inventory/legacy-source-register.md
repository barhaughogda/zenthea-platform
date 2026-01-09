# Legacy Source Register

**Status**: Authoritative (Governance-Binding)  
**Applies to**: Phase B and all subsequent migration work  
**Mutation rule**: Changes require ADR approval  
**Version**: 1.0.0  
**Last Updated**: 2026-01-09  

## 1. Purpose
This register explicitly defines the authoritative boundaries and precedence rules for information extracted from legacy repositories. It prevents the leakage of outdated architectural patterns, inconsistent domain logic, and "stale truth" into the `zenthea-platform`.

## 2. Repositories & Roles

### 2.1. `zenthea-platform` (This Repo)
*   **Role**: Primary Authority.
*   **Authority**: Total authority over all forward-moving architecture, infrastructure, compliance standards (HIPAA/GDPR), and module conventions.
*   **Status**: The ONLY location where new documentation is written or finalized.

### 2.2. `../dev/zenthea` (Legacy Core)
*   **Role**: Historical Context / Domain Intent.
*   **Authority**: Authoritative ONLY for "Original Intent" (Why was this feature built?) and raw business logic fragments.
*   **Status**: READ-ONLY. Known to be internally inconsistent and architecturally deprecated.

### 2.3. `../b2b-startkit` (Transitional Refactor)
*   **Role**: Structural Prototype.
*   **Authority**: Authoritative for "Validated Structural Improvements" (e.g., the successful decoupling of the Website Builder from the core EHR).
*   **Status**: READ-ONLY. More advanced than `../dev/zenthea` in specific domains but remains incomplete and under-documented.

## 3. Authority Boundaries

### 3.1. What is NOT allowed to be inferred:
*   **From `../dev/zenthea`**: Deployment patterns, security models, data schemas, or dependency management. These are considered compromised and must not be used as blueprints.
*   **From `../b2b-startkit`**: Integration standards or cross-service communication patterns, as these were transitional and not finalized for production scale.

### 3.2. Prohibited Assumptions:
*   Presence of code in a legacy repo does NOT imply it should exist in `zenthea-platform`.
*   Variable naming or directory structures in legacy repos are NOT authoritative patterns for the new platform.

## 4. Precedence Rules
In the event of a conflict between sources, the following hierarchy applies:

1.  **`zenthea-platform` Documentation**: Overrides all other sources.
2.  **`../b2b-startkit` Structure**: Overrides `../dev/zenthea` only for module separation and UI-component organization.
3.  **`../dev/zenthea` Logic**: Overrides `../b2b-startkit` only for core clinical domain intent where `b2b-startkit` is silent.

**Conflict Resolution Rule**: If `b2b-startkit` and `dev/zenthea` disagree on a fundamental domain rule and `zenthea-platform` has not yet defined it, the rule is marked as **STALLED** until an Architect provides a definition in `zenthea-platform`.

## 5. Known Risks
*   **Truth Fragmentation**: Domain rules may be split across both legacy repos with different versions of "correctness."
*   **Invisible Debt**: Legacy "shortcuts" may look like intentional architecture when viewed in isolation.
*   **Compliance Drift**: Legacy code does not meet the strict auditability and HIPAA standards required for `zenthea-platform`.

## 6. Explicit Non-Goals
*   This register does NOT inventory specific surfaces or APIs (this occurs in subsequent inventory phases).
*   This register does NOT migrate any code.
*   This register does NOT resolve specific logic conflicts.

## 7. Phase B Execution Protocol
During Phase B (Migration & Implementation), this register must be used as follows:
1.  **Source Check**: Before analyzing a legacy feature, developers must identify which repo is authoritative for that specific aspect (Intent vs. Structure).
2.  **Traceability**: Every design decision in `zenthea-platform` that references legacy must cite the specific repository and version used as evidence.
3.  **Governance Gate**: Any deviation from the precedence rules defined here requires a formal Architecture Decision Record (ADR).

## 8. Register
| Legacy source name | Type | Owner / team | Location / reference | Data classes | Interfaces / dependencies | Status | Risk | Notes / links |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| dev/zenthea | repo | UNKNOWN | ../dev/zenthea | UNKNOWN | UNKNOWN | active | HIGH | Original legacy repository. Authoritative only for historical domain intent per Legacy Source Register. |
| b2b-startkit | repo | UNKNOWN | ../b2b-startkit | UNKNOWN | UNKNOWN | active | HIGH | Transitional refactor repository. Authoritative only for validated structural separation patterns per Legacy Source Register. |

---
*End of Register*
