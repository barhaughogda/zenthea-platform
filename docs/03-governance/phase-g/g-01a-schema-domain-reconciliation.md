# Phase G.1a: Schema–Domain Reconciliation Amendment

## 1. Purpose
The Phase G.1 relational schema was locked prior to the full implementation of the `ehr-core` domain models in Phase F.2. Subsequent implementation and integration in Phase G.3 revealed a mismatch between the locked relational structure and the functional requirements of the domain.

A temporary migration (`003_domain_extensions.sql`) was introduced during Phase G.3 to unblock the platform. This amendment formally reconciles and ratifies those differences, ensuring the canonical schema aligns with the `ehr-core` domain requirements.

## 2. Identified Mismatches
The following discrepancies between the G.1 schema and the F.2 domain models have been identified and require reconciliation:

- **patients.last_modified_by**: Missing audit tracking for patient record updates.
- **practitioners.display_name**: Domain requires a derived or explicit display name for UI/UX consistency.
- **practitioners.role**: Domain logic requires explicit role categorization for access control.
- **practitioners.active**: Missing lifecycle state management in the schema.
- **encounters.last_modified_by**: Missing audit tracking for encounter state changes.
- **clinical_notes.patient_id**: Schema missing direct relationship required for efficient patient-centric retrieval.

## 3. Ratified Schema Amendments
The fields and relationships identified in Section 2 are hereby declared **OFFICIALLY PART OF THE CANONICAL SCHEMA**.

- These fields are **REQUIRED** for domain correctness and auditability.
- These changes are strictly **additive** and **non-breaking** to the existing G.1 relational integrity.
- The schema definition is updated to reflect these domain-driven requirements.

## 4. Migration Authority
Migration `003_domain_extensions.sql` is formally ratified as:
- **Valid**: It correctly implements the required domain extensions.
- **Required**: It is necessary for the platform to function according to Phase F domain specifications.
- **Canonical**: It is the authoritative source for these schema updates.

**No rollback** of these changes is permitted without formal governance approval and a corresponding design amendment.

## 5. Forward-Looking Constraints
To prevent future divergence:
- **Domain-First Validation**: All future domain models MUST be reflected in and validated against schema locks before finalization.
- **Strict Synchronization**: All future schema locks MUST be verified against `ehr-core` domain implementations.
- **Zero Silent Divergence**: Any implementation-driven schema changes must be preceded by a governance amendment.

## 6. Non-Goals
This amendment:
- Does **NOT** introduce new domains or business entities.
- Does **NOT** authorize new persistence behavior beyond the existing architecture.
- Does **NOT** modify existing `ehr-core` domain logic.
- Does **NOT** allow for runtime or dynamic schema changes.
