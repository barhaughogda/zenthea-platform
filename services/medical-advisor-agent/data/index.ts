/**
 * Persistence abstraction for medical advisor data.
 * No concrete implementation here.
 */

/**
 * Repository interface for clinical audit trails.
 * Explicit Note: Audit trails should use structured references (e.g. IDs) instead of raw PHI.
 */
export interface IClinicalAuditRepository {
  saveInvocation(metadata: {
    requestId: string;
    tenantId: string;
    clinicianId: string;
    promptVersion: string;
    timestamp: Date;
  }): Promise<void>;
  
  // TODO: Add methods for evidence retrieval audit and policy decision audit.
}

/**
 * Repository interface for clinical guidelines and evidence metadata.
 * No PHI is stored here.
 */
export interface IEvidenceMetadataRepository {
  getMetadata(sourceId: string): Promise<any>;
}

// TODO: Define typed schemas for stored entities.
// TODO: Explicitly note PHI handling boundaries in repository implementations.
// TODO: Ensure clear separation between PHI and non-PHI data.
