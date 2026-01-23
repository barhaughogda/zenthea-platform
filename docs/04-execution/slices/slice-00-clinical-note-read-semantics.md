# DESIGN-ONLY: Clinical Note Read Semantics (Consolidation)

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: CONSOLIDATION DOCUMENT
- **Scope**: READ PATHS ONLY (Slices 01–04)
- **Status**: FINAL / HARDENED / IMMUTABLE

## 2. PURPOSE
This document formalizes the complete Clinical Note READ access model by composing the rules established and locked in Slices 01 through 04. It serves as the single authoritative reference for the deterministic authorization logic governing all clinical note read operations within the Zenthea Platform. This is a consolidation of existing, locked behavior and introduces no new rules or implementation details.

## 3. DETERMINISTIC READ DECISION MODEL
All read requests for Clinical Note resources must undergo a multi-stage deterministic evaluation. Failure at ANY step results in immediate termination of the request (fail-closed). The evaluation order is fixed and non-bypassable:

1.  **Identity Context**: Verification of the requesting actor's identity and authentication status.
2.  **Tenant Isolation**: Strict verification that the requesting actor and the target resource belong to the same tenant. No cross-tenant access is permitted.
3.  **Capability Scope**: Verification that the actor possesses the specific capability required for the read path (e.g., Author, Secondary Reader).
4.  **Resource State**: Verification that the note is in the `SIGNED` state.
    - *Exception*: The original Author may read their own note in the `DRAFT` state (Slice 01).
    - *Constraint*: Non-authors and Secondary Readers are restricted to `SIGNED` notes only (Slice 02, Slice 03).
5.  **Temporal Validity**: Verification that the read request occurs within the permitted temporal window as defined by system-wide read constraints (Slice 04).

## 4. READ ACCESS MATRIX (CONCEPTUAL)
Access is granted only when the following composed conditions are met:

| Access Path | Identity Condition | Resource State | Capability Requirement | Temporal Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Author Read** | Actor == Author | DRAFT or SIGNED | Author Capability | Slice 04 Overlay |
| **Non-Author Read** | Actor != Author | SIGNED Only | Clinical Read Capability | Slice 04 Overlay |
| **Secondary Reader** | Actor != Author | SIGNED Only | Secondary Reader Capability | Slice 04 Overlay |

*Note: These paths are composed with Tenant Isolation and Identity Context as baseline requirements.*

## 5. AUDIT EMISSION RULES
Audit integrity is maintained through strict emission protocols:
- **Event**: `NOTE_READ`
- **Frequency**: Emitted EXACTLY ONCE per successful authorized read.
- **Condition**: ONLY on successful completion of all authorization stages.
- **Failures**: ZERO audit emission on authorization failure or constraint violation (to prevent side-channel leakage).
- **Payload**: Metadata-only. No Protected Health Information (PHI) or sensitive content is permitted in the audit trail.

## 6. EXPLICIT NON-EXISTENCE
The following mechanisms are explicitly excluded from the Clinical Note Read Model. Their absence is a security invariant:
- **No Draft Reads**: Non-authors cannot access `DRAFT` notes under any circumstances.
- **No Overrides**: No "break-glass" or emergency override mechanisms exist within this read model.
- **No Admin Bypass**: Administrative identities are subject to the same tenant and capability constraints.
- **No Role Hierarchies**: Access is strictly capability-based; no implicit privilege escalation via roles.
- **No ACL Tables**: Access is determined by deterministic logic and resource state, not by mutable access control lists.
- **No Retries**: Authorization failures are terminal; no automated retry logic is permitted at the authorization boundary.
- **No Soft-Fail Paths**: There are no conditions under which a partial or "soft" failure allows data egress.

## 7. IMMUTABILITY AND GOVERNANCE STATUS
This document represents the consolidated state of the Clinical Note Read Model as of the completion of Slice 04. 
- **Finality**: This document is FINAL and HARDENED.
- **Change Control**: Any modification to the logic described herein requires a new formal governance phase and the creation of a subsequent execution slice.
- **Authority**: This document supersedes individual slice summaries for the purpose of defining the holistic read authorization contract.
