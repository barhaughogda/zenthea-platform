/**
 * EHR Core - Phase F Implementation
 *
 * This package provides the core EHR entities with deny-by-default,
 * fail-closed authority enforcement.
 *
 * PHASE F.2 SLICE 1: Patient only
 * - Patient write model (authority-gated, fail-closed)
 * - Patient read model (derived, non-authoritative)
 *
 * INVARIANTS (from Phase F-00):
 * - Human authority over clinical truth MUST be preserved
 * - Read model MUST NOT imply write capability
 * - All writes MUST be auditable
 *
 * BOUNDARY RULES:
 * - UI MUST be a client of EHR core and MUST NOT be treated as EHR core
 * - AI MUST be advisory only and MUST NOT be a system of record
 */

// Authority types - for constructing verified authority context
export type { AuthorityContext } from "./authority/types.js";
export { createAuthorityContext, isValidAuthorityContext } from "./authority/types.js";

// Patient types
export type {
  PatientRecord,
  PatientDemographics,
  PatientReadView,
  CreatePatientInput,
  UpdatePatientDemographicsInput,
  WriteResult,
  WriteError,
} from "./patient/types.js";

// Patient models
export { PatientWriteModel } from "./patient/write.js";
export { PatientReadModel } from "./patient/read.js";

// Practitioner types
export type {
  PractitionerRecord,
  PractitionerReadView,
  CreatePractitionerInput,
  UpdatePractitionerInput,
} from "./practitioner/types.js";

// Practitioner models
export { PractitionerWriteModel } from "./practitioner/write.js";
export { PractitionerReadModel } from "./practitioner/read.js";

// Repository (internal, for testing only)
export { InMemoryPatientRepository } from "./patient/repository.js";
export type { PatientRepository } from "./patient/repository.js";
export { InMemoryPractitionerRepository } from "./practitioner/repository.js";
export type { PractitionerRepository } from "./practitioner/repository.js";