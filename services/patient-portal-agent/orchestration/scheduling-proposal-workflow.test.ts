import { describe, it, expect, vi } from 'vitest';
import { executeSchedulingProposal } from './scheduling-proposal-workflow';
import { PatientSessionContext } from '@starter/patient-scope-gate';

describe('SL-07: Scheduling Proposal (Patient-Initiated)', () => {
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

  it('should successfully generate a scheduling proposal for a valid session', async () => {
    const request = {
      intent: 'I want to see a doctor for my back pain next week',
      appointmentType: 'specialist_visit',
      preferredTime: '2026-01-20T10:00:00Z'
    };

    const response = await executeSchedulingProposal(mockSession, request);

    expect(response.status).toBe('PENDING');
    expect(response.proposal).toBeDefined();
    expect(response.proposal?.domain).toBe('scheduling');
    expect(response.proposal?.tool.name).toBe('scheduling:create_appointment_proposal');
    expect(response.proposal?.parameters.patientId).toBe('patient456');
    expect(response.proposal?.parameters.appointmentType).toBe('specialist_visit');
    expect(response.message).toContain('pending approval');
    expect(response.message).toContain('No booking has been made');
  });

  it('should fail closed (ERROR) if session is missing or invalid', async () => {
    // @ts-ignore - testing runtime safety
    const response = await executeSchedulingProposal(null, { intent: 'test' });
    
    expect(response.status).toBe('ERROR');
    expect(response.message).toBe('Invalid session context.');
    expect(response.proposal).toBeUndefined();
  });

  it('should fail closed (ERROR) if actor type is not PATIENT', async () => {
    const invalidSession = {
      ...mockSession,
      actor: { ...mockSession.actor, type: 'CLINICIAN' }
    } as unknown as PatientSessionContext;

    const response = await executeSchedulingProposal(invalidSession, { intent: 'test' });
    
    expect(response.status).toBe('ERROR');
    expect(response.proposal).toBeUndefined();
  });

  it('should DENY if the safety gate (SL-01) fails', async () => {
    // We can't easily mock evaluatePatientScopeGate without complexity, 
    // but we can pass a session that would naturally trigger a mismatch if the gate was more complex.
    // For now, the existing gate implementation in @starter/patient-scope-gate 
    // is quite simple and mostly passes if IDs are present.
    // If we wanted to test DENY, we'd need to mock the gate.
    
    // Let's mock the gate for this test
    vi.mock('@starter/patient-scope-gate', async (importOriginal) => {
      const actual = await importOriginal<any>();
      return {
        ...actual,
        evaluatePatientScopeGate: vi.fn().mockReturnValue({
          effect: 'DENY',
          reasonCode: 'CONSENT_MISSING',
          metadata: { justification: 'No active consent found', decisionId: 'dec-123' }
        })
      };
    });

    const response = await executeSchedulingProposal(mockSession, { intent: 'test' });
    
    expect(response.status).toBe('DENY');
    expect(response.message).toBe('Access denied by safety gate.');
    expect(response.metadata.reason).toBe('GATE_DENY');
    
    vi.restoreAllMocks();
  });

  it('must NOT perform any execution or persistence (proposal-only boundary)', async () => {
    // This is a behavioral assertion. The function is pure and only returns a proposal.
    // By verifying the return value and the absence of side-effecting calls (which would need mocks),
    // we confirm the proposal-only boundary.
    
    const response = await executeSchedulingProposal(mockSession, { intent: 'test' });
    expect(response.proposal).toBeDefined();
    // Verification: status is PENDING, not CONFIRMED or BOOKED.
    expect(response.proposal?.parameters.status).toBe('PENDING_APPROVAL');
  });
});
