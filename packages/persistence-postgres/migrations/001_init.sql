-- Migration: 001_init.sql
-- Phase G.1 Schema Design Lock - Initial Table Creation
-- 
-- This migration creates the core EHR tables as defined in Phase G.1.
-- Tables: patients, practitioners, encounters, clinical_notes
--
-- INVARIANTS:
-- - All tables use UUID primary keys
-- - All tables include tenant_id for multi-tenant isolation
-- - All tables include created_at and updated_at timestamps
-- - Foreign keys are explicit and enforced
-- - No soft deletes in this phase

-- ============================================================================
-- SCHEMA MIGRATIONS TABLE
-- ============================================================================
-- Tracks which migrations have been applied

CREATE TABLE IF NOT EXISTS schema_migrations (
    version     TEXT PRIMARY KEY,
    applied_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    checksum    TEXT NOT NULL
);

-- ============================================================================
-- PATIENTS TABLE
-- ============================================================================
-- Stores core demographic and administrative data for individuals receiving care.

CREATE TABLE patients (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    external_id     TEXT NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          TEXT NULL,
    email           TEXT NULL,
    phone           TEXT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PRACTITIONERS TABLE
-- ============================================================================
-- Stores data for clinicians and other healthcare providers.

CREATE TABLE practitioners (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    external_id     TEXT NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    specialty       TEXT NULL,
    email           TEXT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ENCOUNTERS TABLE
-- ============================================================================
-- Represents an interaction between a patient and the healthcare system.

CREATE TABLE encounters (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL,
    patient_id          UUID NOT NULL,
    practitioner_id     UUID NULL,
    status              TEXT NOT NULL,
    start_time          TIMESTAMP WITH TIME ZONE NULL,
    end_time            TIMESTAMP WITH TIME ZONE NULL,
    encounter_type      TEXT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_encounters_patient 
        FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_encounters_practitioner 
        FOREIGN KEY (practitioner_id) REFERENCES practitioners(id),
    CONSTRAINT chk_encounters_status 
        CHECK (status IN ('planned', 'arrived', 'in-progress', 'finished', 'cancelled'))
);

-- ============================================================================
-- CLINICAL NOTES TABLE
-- ============================================================================
-- Stores narrative clinical documentation authored during or after an encounter.

CREATE TABLE clinical_notes (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    encounter_id    UUID NOT NULL,
    author_id       UUID NOT NULL,
    note_type       TEXT NOT NULL,
    content_raw     TEXT NOT NULL,
    status          TEXT NOT NULL,
    signed_at       TIMESTAMP WITH TIME ZONE NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_clinical_notes_encounter 
        FOREIGN KEY (encounter_id) REFERENCES encounters(id),
    CONSTRAINT fk_clinical_notes_author 
        FOREIGN KEY (author_id) REFERENCES practitioners(id),
    CONSTRAINT chk_clinical_notes_status 
        CHECK (status IN ('draft', 'final', 'amended'))
);
