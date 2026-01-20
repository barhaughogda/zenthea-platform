-- Migration: 003_domain_extensions.sql
-- Schema Extensions for ehr-core Domain Compatibility
--
-- GOVERNANCE NOTE:
-- This migration extends the G.1 schema to support the domain models
-- defined in packages/ehr-core (Phase F.2). These extensions are
-- REQUIRED for the persistence adapters to return valid domain types.
--
-- Extensions added:
-- 1. patients.last_modified_by - Required by PatientRecord
-- 2. practitioners.display_name - Required by PractitionerRecord (computed from first_name + last_name)
-- 3. practitioners.role - Required by PractitionerRecord
-- 4. practitioners.active - Required by PractitionerRecord
-- 5. encounters.last_modified_by - Required by EncounterRecord
-- 6. clinical_notes.patient_id - Required by ClinicalNoteRecord (denormalized for direct access)
--
-- This migration REQUIRES G.3 governance review acknowledgment before
-- merging to main branch.

-- ============================================================================
-- PATIENTS EXTENSIONS
-- ============================================================================

ALTER TABLE patients
    ADD COLUMN last_modified_by TEXT NOT NULL DEFAULT 'system';

-- Remove the default after column is added (for new rows, must be explicit)
ALTER TABLE patients
    ALTER COLUMN last_modified_by DROP DEFAULT;

-- ============================================================================
-- PRACTITIONERS EXTENSIONS
-- ============================================================================

-- display_name is computed but stored for query efficiency
ALTER TABLE practitioners
    ADD COLUMN display_name TEXT;

-- Update existing rows to compute display_name
UPDATE practitioners 
SET display_name = CONCAT(first_name, ' ', last_name)
WHERE display_name IS NULL;

ALTER TABLE practitioners
    ALTER COLUMN display_name SET NOT NULL;

-- role column (domain restricts to 'clinician' in Slice 2)
ALTER TABLE practitioners
    ADD COLUMN role TEXT NOT NULL DEFAULT 'clinician';

-- active flag
ALTER TABLE practitioners
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;

-- ============================================================================
-- ENCOUNTERS EXTENSIONS
-- ============================================================================

ALTER TABLE encounters
    ADD COLUMN last_modified_by TEXT NOT NULL DEFAULT 'system';

ALTER TABLE encounters
    ALTER COLUMN last_modified_by DROP DEFAULT;

-- ============================================================================
-- CLINICAL NOTES EXTENSIONS
-- ============================================================================

-- Add patient_id for direct access (denormalized from encounter)
ALTER TABLE clinical_notes
    ADD COLUMN patient_id UUID;

-- Populate from existing encounters
UPDATE clinical_notes cn
SET patient_id = e.patient_id
FROM encounters e
WHERE cn.encounter_id = e.id
AND cn.patient_id IS NULL;

ALTER TABLE clinical_notes
    ALTER COLUMN patient_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE clinical_notes
    ADD CONSTRAINT fk_clinical_notes_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id);

-- Add index for patient-scoped queries
CREATE INDEX idx_clinical_notes_patient
    ON clinical_notes (tenant_id, patient_id);
