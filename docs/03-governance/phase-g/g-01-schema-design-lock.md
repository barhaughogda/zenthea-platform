# Phase G.1 – Schema Design Lock (EHR Core Domains)

## 1. Status and Classification
- **Status**: LOCKED
- **Classification**: DESIGN-ONLY

## 2. Authority Declaration
**THIS DOCUMENT DOES NOT AUTHORIZE EXECUTION OR MIGRATIONS.**
This is a logical relational schema design lock. It defines the tables and relationships for the EHR Core domains but does not authorize the creation of SQL migration files, the provisioning of databases, or any changes to application code. Authorization for implementation will be granted in a future phase.

## 3. Global Schema Principles
All tables defined in this schema MUST adhere to the following principles:
- **Primary Keys**: Every table MUST use a `UUID` as its primary key.
- **Multi-Tenancy**: Every table MUST include a `tenant_id` (UUID) column to ensure strict data isolation.
- **Timestamps**: Every table MUST include `created_at` and `updated_at` (TIMESTAMP WITH TIME ZONE) columns.
- **Foreign Keys**: Relationships MUST be enforced with explicit foreign key constraints. No "soft" or application-level-only relationships.
- **No Polymorphism**: Polymorphic associations (one foreign key pointing to multiple tables) are STRICTLY FORBIDDEN.
- **Persistence State**: No soft deletes are permitted in this phase. Data lifecycle management will be addressed in a future governance phase.
- **Naming Conventions**: Table and column names MUST use `snake_case`. Table names MUST be plural (e.g., `patients`).

## 4. Table Definitions (Logical)

### 4.1 `patients`
Stores core demographic and administrative data for individuals receiving care.

- **Columns**:
  - `id`: UUID (Primary Key)
  - `tenant_id`: UUID (NOT NULL)
  - `external_id`: TEXT (NULL) - ID from external systems (e.g., MRN)
  - `first_name`: TEXT (NOT NULL)
  - `last_name`: TEXT (NOT NULL)
  - `date_of_birth`: DATE (NOT NULL)
  - `gender`: TEXT (NULL)
  - `email`: TEXT (NULL)
  - `phone`: TEXT (NULL)
  - `created_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
  - `updated_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
- **Indexes**:
  - `idx_patients_tenant_id`: On `tenant_id`
  - `idx_patients_external_id`: On `(tenant_id, external_id)` WHERE `external_id` IS NOT NULL (Unique)
  - `idx_patients_name`: On `(tenant_id, last_name, first_name)`

### 4.2 `practitioners`
Stores data for clinicians and other healthcare providers.

- **Columns**:
  - `id`: UUID (Primary Key)
  - `tenant_id`: UUID (NOT NULL)
  - `external_id`: TEXT (NULL) - e.g., NPI or employee ID
  - `first_name`: TEXT (NOT NULL)
  - `last_name`: TEXT (NOT NULL)
  - `specialty`: TEXT (NULL)
  - `email`: TEXT (NOT NULL)
  - `created_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
  - `updated_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
- **Indexes**:
  - `idx_practitioners_tenant_id`: On `tenant_id`
  - `idx_practitioners_email`: On `(tenant_id, email)` (Unique)

### 4.3 `encounters`
Represents an interaction between a patient and the healthcare system.

- **Columns**:
  - `id`: UUID (Primary Key)
  - `tenant_id`: UUID (NOT NULL)
  - `patient_id`: UUID (NOT NULL, Foreign Key -> `patients.id`)
  - `practitioner_id`: UUID (NULL, Foreign Key -> `practitioners.id`)
  - `status`: TEXT (NOT NULL) - e.g., 'planned', 'arrived', 'in-progress', 'finished', 'cancelled'
  - `start_time`: TIMESTAMP WITH TIME ZONE (NULL)
  - `end_time`: TIMESTAMP WITH TIME ZONE (NULL)
  - `encounter_type`: TEXT (NULL) - e.g., 'office-visit', 'telehealth'
  - `created_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
  - `updated_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
- **Constraints**:
  - `fk_encounters_patient`: `patient_id` REFERENCES `patients(id)`
  - `fk_encounters_practitioner`: `practitioner_id` REFERENCES `practitioners(id)`
- **Indexes**:
  - `idx_encounters_tenant_patient`: On `(tenant_id, patient_id)`
  - `idx_encounters_tenant_status`: On `(tenant_id, status)`
  - `idx_encounters_start_time`: On `start_time`

### 4.4 `clinical_notes`
Stores narrative clinical documentation authored during or after an encounter.

- **Columns**:
  - `id`: UUID (Primary Key)
  - `tenant_id`: UUID (NOT NULL)
  - `encounter_id`: UUID (NOT NULL, Foreign Key -> `encounters.id`)
  - `author_id`: UUID (NOT NULL, Foreign Key -> `practitioners.id`)
  - `note_type`: TEXT (NOT NULL) - e.g., 'progress-note', 'consultation'
  - `content_raw`: TEXT (NOT NULL) - The narrative content
  - `status`: TEXT (NOT NULL) - e.g., 'draft', 'final', 'amended'
  - `signed_at`: TIMESTAMP WITH TIME ZONE (NULL)
  - `created_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
  - `updated_at`: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT now())
- **Constraints**:
  - `fk_clinical_notes_encounter`: `encounter_id` REFERENCES `encounters(id)`
  - `fk_clinical_notes_author`: `author_id` REFERENCES `practitioners(id)`
- **Indexes**:
  - `idx_clinical_notes_encounter`: On `encounter_id`
  - `idx_clinical_notes_tenant_status`: On `(tenant_id, status)`

## 5. Relationship Diagram (Textual)
- **Patient ↔ Encounter**: One-to-Many. A Patient can have multiple Encounters.
- **Practitioner ↔ Encounter**: One-to-Many. A Practitioner can be the primary provider for multiple Encounters.
- **Encounter ↔ Clinical Note**: One-to-Many. An Encounter can have multiple Clinical Notes (e.g., a physician note and a nurse note).
- **Practitioner ↔ Clinical Note**: One-to-Many. A Practitioner authors Clinical Notes.

## 6. Prohibited Patterns
- **No JSON Blobs**: Core clinical data (names, dates, statuses) MUST NOT be stored in JSON/JSONB columns. JSONB is permitted ONLY for non-core, highly dynamic metadata if explicitly authorized in a future phase.
- **No EAV (Entity-Attribute-Value)**: Schemas MUST be strongly typed and relational. No "generic" tables for storing arbitrary attributes.
- **No Denormalized Write Models**: The system of record MUST remain normalized to ensure data integrity. Read-optimized views or materialized views may be considered in later phases.
- **No Database Triggers for Business Logic**: Triggers MUST NOT contain healthcare business rules, validation, or orchestration logic.

## 7. Forward Compatibility Notes
The following items are intentionally **DEFERRED** and are not included in this schema lock:
- **Audit Logs**: A separate immutable audit log schema will be defined in Phase G.4.
- **Versioning/History**: Record versioning for clinical notes (amendments) will be handled via a dedicated history table or append-only pattern in a future phase.
- **Attachments**: Storage for binary data (images, PDFs) will be handled via an external object store with metadata references.
- **Complex Demographics**: Address, Insurance, and Contact lists are deferred to future G.x phases.

## 8. Final Declaration
The schema defined in Phase G.1 is now **LOCKED**. Any changes to these table structures, column types, or relationships require a new G.x governance document and explicit re-authorization. This lock ensures that the foundation of the EHR Core is stable and deterministic.
