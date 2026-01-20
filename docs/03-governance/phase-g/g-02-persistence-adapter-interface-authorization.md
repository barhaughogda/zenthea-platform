# Phase G.2 – Persistence Adapter Interface Authorization

## 1. Status and Classification
- **Status**: AUTHORIZED (FOR DESIGN + EXECUTION ENABLEMENT)
- **Classification**: AUTHORIZATION

## 2. Authority Declaration
**THIS DOCUMENT AUTHORIZES THE CREATION OF PERSISTENCE ADAPTER INTERFACES.**
Execution is strictly limited to the definition of TypeScript interfaces within the application code. This document DOES NOT authorize the implementation of concrete adapters (e.g., SQL repositories), the provisioning of databases, the creation of migration files, or the addition of database drivers/dependencies.

## 3. Scope
This authorization applies ONLY to the definition of persistence adapter interfaces (Repository Interfaces) for the following core domains:
- **Patient**
- **Practitioner**
- **Encounter**
- **Clinical Note**

## 4. Architectural Mandates

### 4.1 Persistence Agnosticism
- The **EHR Core (`packages/ehr-core`)** MUST remain strictly persistence-agnostic.
- Interfaces MUST be defined outside the domain write/read models to maintain strict separation of concerns.
- No database-specific types (e.g., Postgres-specific types) are permitted in interface definitions.

### 4.2 Definition Location
- Interfaces MUST be defined in a location that is accessible to the domain layer but independent of any specific persistence implementation.

### 4.3 Interface Characteristics
- **Synchronous and Fail-Closed**: Interface methods MUST be designed to handle failures explicitly.
- **Explicit Tenant Context**: EVERY method in these interfaces MUST require a `tenant_id` (UUID) as an explicit parameter. Implicit tenant context is FORBIDDEN.
- **No Implicit Transactions**: Methods must be granular; cross-method transaction management is deferred and MUST NOT be part of these initial interface definitions.
- **No ORM Abstractions**: Interfaces MUST NOT use concepts from ORMs (e.g., `QueryBuilder`, `Repository<T>`, `EntityManager`).
- **No Framework Coupling**: Interfaces MUST be pure TypeScript and free from any framework-specific decorators or base classes.

## 5. Naming Conventions and Method Signatures

### 5.1 Naming Conventions
- Interfaces MUST follow the pattern: `IPersistence[Domain]Repository` (e.g., `IPersistencePatientRepository`).
- Method names MUST be logical and descriptive of the domain operation, not the underlying SQL (e.g., `findById`, `save`, `findByExternalId`).

### 5.2 Required Method Semantics
- **Logical Operations**: Signatures must reflect domain needs (e.g., `findById(tenantId: string, id: string): Promise<Patient | null>`).
- **Error Semantics**: Methods MUST NOT throw for expected domain outcomes (e.g., "not found"). Errors should be reserved for exceptional system failures (e.g., connection lost).
- **Return Types**: MUST return domain models or domain-specific DTOs defined in `ehr-core`.

## 6. Forbidden in This Phase (G.2)
- **PostgreSQL Adapters**: No concrete classes implementing these interfaces.
- **SQL Statements**: No authoring of SQL queries.
- **Migration Files**: No `.sql` or `.ts` migration files.
- **AWS Infrastructure**: No configuration of RDS or other persistence infrastructure.
- **Connection Pooling**: No setup of `pg`, `kysely`, or other database clients.
- **Runtime Configuration**: No environment variables related to database connections.
- **No Database Drivers**: No addition of database-related packages to `package.json`.

## 7. Post-conditions
- Concrete implementations of these interfaces are deferred to **Phase G.3**.
- This document establishes the immutable CONTRACT between the domain logic and future persistence implementations.

## 8. Final Declaration
Phase G.2 marks the transition from static schema design to active interface definition. By locking the interfaces now, we ensure that the EHR Core remains pure and that the persistence layer remains a swappable detail.
