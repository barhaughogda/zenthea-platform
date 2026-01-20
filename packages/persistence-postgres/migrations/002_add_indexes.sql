-- Migration: 002_add_indexes.sql
-- Phase G.1 Schema Design Lock - Index Creation
--
-- This migration creates all indexes as defined in Phase G.1.
-- Indexes are created separately to allow for controlled deployment.
--
-- INVARIANTS:
-- - All tenant_id columns are indexed for isolation queries
-- - Composite indexes include tenant_id as first column for multi-tenant queries
-- - Unique constraints enforce business rules at the database level

-- ============================================================================
-- PATIENTS INDEXES
-- ============================================================================

-- Index for tenant-scoped queries
CREATE INDEX idx_patients_tenant_id 
    ON patients (tenant_id);

-- Unique index for external_id within a tenant (partial index)
CREATE UNIQUE INDEX idx_patients_external_id 
    ON patients (tenant_id, external_id) 
    WHERE external_id IS NOT NULL;

-- Index for name searches within a tenant
CREATE INDEX idx_patients_name 
    ON patients (tenant_id, last_name, first_name);

-- ============================================================================
-- PRACTITIONERS INDEXES
-- ============================================================================

-- Index for tenant-scoped queries
CREATE INDEX idx_practitioners_tenant_id 
    ON practitioners (tenant_id);

-- Unique index for email within a tenant
CREATE UNIQUE INDEX idx_practitioners_email 
    ON practitioners (tenant_id, email);

-- ============================================================================
-- ENCOUNTERS INDEXES
-- ============================================================================

-- Index for patient-scoped encounter queries
CREATE INDEX idx_encounters_tenant_patient 
    ON encounters (tenant_id, patient_id);

-- Index for status-based queries within a tenant
CREATE INDEX idx_encounters_tenant_status 
    ON encounters (tenant_id, status);

-- Index for time-based queries
CREATE INDEX idx_encounters_start_time 
    ON encounters (start_time);

-- ============================================================================
-- CLINICAL NOTES INDEXES
-- ============================================================================

-- Index for encounter-scoped note queries
CREATE INDEX idx_clinical_notes_encounter 
    ON clinical_notes (encounter_id);

-- Index for status-based queries within a tenant
CREATE INDEX idx_clinical_notes_tenant_status 
    ON clinical_notes (tenant_id, status);
