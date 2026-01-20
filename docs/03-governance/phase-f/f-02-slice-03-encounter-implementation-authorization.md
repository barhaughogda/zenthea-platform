# Authorization Document: Phase F.2 Slice 3 - Encounter Core Domain

## 1. Purpose
This document authorizes the implementation of **Phase F.2 Slice 3: Encounter core domain** within the EHR Core. This slice establishes the structural clinical interaction binding between patients, practitioners, and tenants, providing a temporal lifecycle for clinical events.

## 2. Scope

### 2.1 In-Scope
- **Encounter Core Entity**: The fundamental structural representation of a clinical interaction.
- **Structural Clinical Interaction Binding**:
  - `patientId`: Reference to the patient.
  - `practitionerId`: Reference to the practitioner.
  - `tenantId`: Mandatory multi-tenant isolation identifier.
- **Temporal Lifecycle**:
  - `startTime`: Required start of the encounter.
  - `endTime`: Optional completion of the encounter.
- **Status Enum**:
  - `planned`
  - `in_progress`
  - `completed`
  - `cancelled`
- **Write Operations**:
  - Create encounter: Initialization with required bindings and status.
  - Close encounter: Updating status to `completed` and setting `endTime`.
- **Read Operations**:
  - Read encounter by ID: Direct retrieval (tenant-scoped).
  - List encounters by patient: Retrieval of patient-specific interactions (read-only).
- **Implementation Strategy**:
  - In-memory repository only.
  - Deterministic behavior only.
  - Explicit `AuthorityContext` required for all write operations.
  - Strict tenant isolation enforced at the service level.
  - Clear separation between read and write models.
  - Frozen, immutable read views returned by read operations.

### 2.2 Out-of-Scope
- Clinical notes (SOAP, progress notes, etc.).
- Diagnoses and conditions.
- Orders (medications, labs, etc.).
- Scheduling and appointment management.
- Billing and financial workflows.
- AI logic, inference, or clinical decision support.
- Audio, transcripts, voice data, or multimedia.
- Persistence to external databases or cloud services.
- Events, message queues, or asynchronous processing.
- UI or API (HTTP/gRPC) layers.
- Cross-encounter data aggregation.
- Timeline construction or longitudinal record views.

## 3. Safety & Governance Requirements
- **Fail-Closed Authorization**: All operations must fail if the `AuthorityContext` is missing or invalid.
- **Tenant Isolation**: Any attempt to access data across tenant boundaries must result in a fail-closed error.
- **No Implicit Creation**: Implementation must not implicitly create `Patient` or `Practitioner` records.
- **Clinical Neutrality**: No default values shall be provided that imply clinical meaning or judgment.
- **Timestamp Integrity**: Timestamps must be provided explicitly via the write model; they are not to be generated internally using non-deterministic system clocks (unless passed via controlled context).
- **No Side Effects**: Repository operations must be pure with respect to the system state outside the repository boundary.
- **Zero External Impact**: No changes to dependencies or `pnpm-lock.yaml`.

## 4. Expected File Surface (Declarative)
All implementation must be contained within `packages/ehr-core/src/encounter/`:
- `types.ts`: Domain models and enums.
- `repository.ts`: In-memory repository interface and implementation.
- `write.ts`: Command handlers for create and close operations.
- `read.ts`: Query handlers for retrieval.
- `__tests__/encounter-slice-03.test.ts`: Specification-based tests.

## 5. Authorization
This document serves as the formal authorization to proceed with the implementation of Slice 3 as defined herein.
