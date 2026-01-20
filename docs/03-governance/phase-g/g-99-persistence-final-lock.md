# G.99: Phase G Persistence Final Lock

## Status: COMPLETE and LOCKED
**Date:** 2026-01-19  
**Governance Authority:** Governance Agent (STRICT PRODUCTION MODE)  

Phase G (Persistence Layer) is hereby declared **COMPLETE** and **LOCKED**. This document serves as the final barrier against architectural drift for the persistence layer. All core components, migrations, and adapters are now under strict change control.

---

## 1. Locked Artifacts

The following artifacts are explicitly locked as of this document's creation:

### 1.1 Relational Schema (G.1 + G.1a)
- The logical and physical schema design finalized in [G.1](./g-01-schema-design-lock.md) and [G.1a](./g-01a-schema-domain-reconciliation.md).

### 1.2 SQL Migrations
The following immutable migration files located in `packages/persistence-postgres/migrations/`:
- `001_init.sql`
- `002_add_indexes.sql`
- `003_domain_extensions.sql`

### 1.3 PostgreSQL Persistence Adapters
The implementation of the following core persistence adapters:
- **Patient Adapter**
- **Practitioner Adapter**
- **Encounter Adapter**
- **Clinical Note Adapter**

---

## 2. Architectural Invariants (Non-Negotiable)

Any implementation or modification within the persistence layer must strictly adhere to these invariants:

1.  **Raw SQL Only:** No ORMs (Prisma, TypeORM, etc.) or query builders (Knex, Drizzle, etc.). All queries must be handwritten SQL.
2.  **Explicit Migrations Only:** Schema changes must be performed via explicit, numbered `.sql` migration files.
3.  **No Runtime Schema Changes:** The application must never attempt to modify the database schema at runtime.
4.  **No Business Logic in SQL:** Database functions and triggers must only handle integrity and auditing; domain logic belongs in the service layer.
5.  **Tenant Isolation Mandatory:** Every query must enforce tenant isolation (e.g., via `tenant_id` filters).
6.  **Fail-Closed Error Handling:** Database connection or query failures must result in a secure "fail-closed" state, preventing data exposure.

---

## 3. Change Control Policy

Going forward, the persistence layer is subject to strict change control:

- **Governance Requirement:** Any modification to the schema or adapter signatures requires a new `G.x` governance amendment and sign-off.
- **Emergency Fixes:** Must be additive and strictly backward-compatible. Destructive changes (drops, renames) are prohibited without a migration path and governance approval.

---

## 4. Out of Scope

The following activities are strictly prohibited going forward:
- **Schema Refactors:** No structural reorganization of existing tables.
- **Adapter Signature Changes:** Public interfaces for `Patient`, `Practitioner`, `Encounter`, and `ClinicalNote` persistence are frozen.
- **ORM Introduction:** Explicitly forbidden.
- **AI-Generated SQL:** SQL code must be human-reviewed and verified; raw AI output is not acceptable for production migrations.

---

## 5. Downstream Dependencies

Phase G is now established as a stable FOUNDATION and a MANDATORY DEPENDENCY for:
- **Phase H (Service Layer):** Domain services consuming persistence adapters.
- **Phase I (Infrastructure / AWS):** RDS provisioning and IAM policy alignment.
- **Phase J (API & UI integration):** End-to-end data flow validation.

---

**Signed:** Governance Agent  
**Mode:** STRICT PRODUCTION
