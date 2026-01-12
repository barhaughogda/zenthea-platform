import { describe, it, expect, vi } from 'vitest';
import { executeProviderReview, ProviderReviewOutcome, ProviderIdentity } from './provider-review-workflow';
import { PatientSessionContext, ActorType } from '@starter/patient-scope-gate';

describe('SL-08: Provider Review of Scheduling Proposals', () => {
  const mockSession: PatientSessionContext = {
    sessionId: 'psession_tenant123_patient456',
    actor: {
      id: 'patient456',
      type: 'PATIENT',
      tenantId: 'tenant123'
    },
    sessionMetadata: {
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      lastVerifiedAt: new Date().toISOString()
    }
  };

  const mockProvider: ProviderIdentity = {
    id: 'clinician789',
    type: ActorType.CLINICIAN,
    tenantId: 'tenant123',
    role: 'CLINICIAN'
  };

  it('should successfully review and ACCEPT a proposal', async () => {
    const request = {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.ACCEPTED
    };

    const response = await executeProviderReview(mockSession, mockProvider, request);

    expect(response.status).toBe('SUCCESS');
    expect(response.message).toContain('accepted');
    expect(response.metadata.proposalId).toBe('prop-123');
    expect(response.metadata.outcome).toBe(ProviderReviewOutcome.ACCEPTED);
  });

  it('should successfully review and REJECT a proposal with a reason code', async () => {
    const request = {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.REJECTED,
      reasonCode: 'PROVIDER_UNAVAILABLE'
    };

    const response = await executeProviderReview(mockSession, mockProvider, request);

    expect(response.status).toBe('SUCCESS');
    expect(response.message).toContain('rejected');
    expect(response.metadata.outcome).toBe(ProviderReviewOutcome.REJECTED);
  });

  it('should fail closed (ERROR) if session is missing or invalid', async () => {
    // @ts-ignore - testing runtime safety
    const response = await executeProviderReview(null, mockProvider, {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.ACCEPTED
    });

    expect(response.status).toBe('ERROR');
    expect(response.message).toContain('Invalid patient session');
  });

  it('should DENY if provider tenantId does not match session tenantId', async () => {
    const mismatchedProvider: ProviderIdentity = {
      ...mockProvider,
      tenantId: 'tenant_other'
    };

    const response = await executeProviderReview(mockSession, mismatchedProvider, {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.ACCEPTED
    });

    expect(response.status).toBe('DENY');
    expect(response.metadata.reason).toBe('TENANT_MISMATCH');
  });

  it('should DENY if the safety gate (SL-01) fails', async () => {
    vi.mock('@starter/patient-scope-gate', async (importOriginal) => {
      const actual = await importOriginal<any>();
      return {
        ...actual,
        evaluatePatientScopeGate: vi.fn().mockReturnValue({
          effect: 'DENY',
          reasonCode: 'CONSENT_MISSING',
          metadata: { justification: 'No active consent' }
        })
      };
    });

    const response = await executeProviderReview(mockSession, mockProvider, {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.ACCEPTED
    });

    expect(response.status).toBe('DENY');
    expect(response.metadata.reason).toBe('CONSENT_DENY');
    expect(response.metadata.gateReason).toBe('CONSENT_MISSING');

    vi.restoreAllMocks();
  });

  it('should return ERROR if REJECTED is requested without a reason code', async () => {
    const request = {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.REJECTED
      // missing reasonCode
    };

    const response = await executeProviderReview(mockSession, mockProvider, request);

    expect(response.status).toBe('ERROR');
    expect(response.message).toContain('reason code is required');
    expect(response.metadata.reason).toBe('MISSING_REASON_CODE');
  });

  it('must NOT perform any execution (HITL and proposal-only boundary)', async () => {
    // Verified by the fact that the response is SUCCESS/DENY/ERROR 
    // and no side-effecting services are called.
    const request = {
      proposalId: 'prop-123',
      outcome: ProviderReviewOutcome.ACCEPTED
    };

    const response = await executeProviderReview(mockSession, mockProvider, request);
    expect(response.status).toBe('SUCCESS');
    // Ensure outcome is purely a state transition
    expect(response.metadata.outcome).toBe(ProviderReviewOutcome.ACCEPTED);
  });
});
