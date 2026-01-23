# Slice 00: Encounter Domain Definition

## 1. CLASSIFICATION
- **Status**: DRAFT
- **Type**: DOMAIN DEFINITION
- **Scope**: Encounter Domain (all future Encounter behavior)

## 2. DOMAIN PURPOSE
- **Conceptual Representation**: An Encounter represents a discrete interaction between a patient and a healthcare provider or system. It serves as the temporal and contextual anchor for clinical activities.
- **Distinction from Clinical Note**: An Encounter is a coordinating entity that tracks the state and context of an interaction, whereas a Clinical Note is a document domain that records specific clinical observations and assessments. An Encounter can exist without a Note, and multiple Notes may be associated with a single Encounter, but the Encounter itself does not contain clinical prose.
- **Coordinating Domain**: The Encounter domain is responsible for lifecycle management, contextual metadata (patient, provider, time), and cross-domain coordination. It is not a document or content domain.

## 3. DOMAIN BOUNDARIES
- **Owned by Encounter Domain**:
  - Encounter lifecycle and state transitions.
  - Contextual metadata (Patient ID, Provider ID, Facility ID, Period).
  - Tenant isolation and ownership.
  - Association between clinical artifacts and the encounter context.
- **Explicitly NOT Owned**:
  - Clinical content (owned by Clinical Note or other clinical domains).
  - Signatures and document sealing (owned by Clinical Note).
  - Scheduling and appointments (owned by Scheduling domain).
  - Billing and claims (owned by Billing domain).
- **Dependencies**:
  - Explicit dependency on sealed Clinical Note semantics for any behavior involving note association.

## 4. CANONICAL INVARIANTS (DESIGN-ONLY)
- **Deterministic Lifecycle**: Encounters must follow a strict, finite state machine with no ambiguous or "stuck" states.
- **Capability-Based Access**: Access to Encounter data and operations is governed strictly by capabilities, not by roles or administrative levels.
- **Strict Tenant Isolation**: All Encounter data must be strictly partitioned by tenant. Cross-tenant access is architecturally impossible.
- **Fail-Closed Behavior**: Any failure in authorization, validation, or system integrity must result in the operation being denied and the state remaining unchanged.
- **No Background Jobs**: All Encounter operations must be synchronous and deterministic. No asynchronous background processing is permitted for core domain logic.
- **No Retries**: Operations either succeed or fail. The domain does not manage retries; that responsibility lies with the caller.
- **No Administrative Bypasses**: There are no "super-user" or administrative routes that bypass domain invariants or security checks.

## 5. EXPLICIT NON-EXISTENCE
- **No Scheduling Logic**: The Encounter domain does not handle calendars, availability, or appointment booking.
- **No Billing Logic**: The Encounter domain does not handle CPT codes, ICD-10 codes for billing, or claim generation.
- **No Clinical Content Authoring**: The Encounter domain does not provide tools for writing or editing clinical prose.

## 6. FUTURE SLICE INTENT
- **Slice-Based Evolution**: All future Encounter behavior, features, and API endpoints must be introduced via Slices 01+.
- **Zero-Behavior Baseline**: No behavior or logic may exist in the Encounter domain outside of what is explicitly defined in a Slice.

## 7. LOCK INTENT (NOT A LOCK)
- **Foundation for Closure**: This Slice 00 establishes the foundation for the eventual closure of the Encounter domain.
- **Closure Criteria**: Domain closure will occur only after all necessary functional slices (Slices 01+) have been completed and validated against these invariants.
