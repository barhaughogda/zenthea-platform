/**
 * Mutation Request DTO (V1)
 * Metadata-only, safe for operator surfaces.
 */
export interface MutationRequestDtoV1 {
  proposalId: string;
  toolName: string;
  toolVersion: string;
  idempotencyKey: string;
  approvalType: 'human' | 'automated';
  approvedAt: string;
  metadata: {
    correlationId: string;
  };
}

/**
 * Mutation Result DTO (V1)
 * Metadata-only outcome.
 */
export interface MutationResultDtoV1 {
  executionId: string;
  status: 'success' | 'failure';
  toolName: string;
  toolVersion: string;
  timestamp: string;
  reasonCode?: string;
  summary?: string;
}
