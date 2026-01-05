/**
 * Proposal Repository Interface
 */
export interface IProposalRepository {
  /**
   * Save a new appointment proposal.
   */
  save(proposal: any): Promise<void>;

  /**
   * Retrieve a proposal by its ID.
   */
  findById(id: string): Promise<any | null>;

  /**
   * Update the status of a proposal (e.g., approved, rejected).
   */
  updateStatus(id: string, status: string): Promise<void>;
}

/**
 * Audit Repository Interface
 */
export interface IAuditRepository {
  /**
   * Record an auditable event.
   */
  record(event: {
    timestamp: Date;
    actorId: string;
    action: string;
    resourceId?: string;
    metadata: any;
  }): Promise<void>;
}

/**
 * Data Layer Entry Point
 */
export const Data = {
  // Placeholder for concrete repository implementations
  // TODO: Implement PostgreSQL/Prisma repositories if required.
  // TODO: Ensure PHI is encrypted at rest.
  // TODO: Implement daily backup logic as per README.
};
