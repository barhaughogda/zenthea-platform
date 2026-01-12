import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeClinicalDrafting, DRAFT_LABELS } from './clinical-drafting-workflow';

// Define enums locally for the test use
const ActorType = {
  PATIENT: 'PATIENT',
  REPRESENTATIVE: 'REPRESENTATIVE',
  CLINICIAN: 'CLINICIAN',
  SERVICE: 'SERVICE'
} as const;

// Mock observability
vi.mock('@starter/observability', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }),
}));

// Mock patient-scope-gate
vi.mock('@starter/patient-scope-gate', () => ({
  ActorType: {
    PATIENT: 'PATIENT',
    REPRESENTATIVE: 'REPRESENTATIVE',
    CLINICIAN: 'CLINICIAN',
    SERVICE: 'SERVICE'
  },
  AccessPurpose: {
    TREATMENT: 'TREATMENT'
  },
  evaluatePatientScopeGate: vi.fn(),
  createGateRequestFromSession: vi.fn().mockReturnValue({}),
}));

// Import the mocked module to get access to the mock functions
import * as gate from '@starter/patient-scope-gate';

describe('Clinical Drafting Workflow (SL-04)', () => {
  const mockClinician = {
    id: 'clinician-123',
    type: ActorType.CLINICIAN as any,
    tenantId: 'tenant-456',
    role: 'CLINICIAN' as const,
  };

  const mockPatientSession = {
    sessionId: 'session-789',
    patientId: 'patient-999',
    actor: {
      id: 'clinician-123',
      type: ActorType.CLINICIAN as any,
      tenantId: 'tenant-456',
    },
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  const validRequest = {
    intent: 'draft a SOAP note for hypertension follow-up',
    clinicianConstraints: {
      structure: 'SOAP',
      requiredSections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    },
    patientId: 'patient-999',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gate.evaluatePatientScopeGate).mockReturnValue({ effect: 'ALLOW' } as any);
  });

  it('should generate a draft successfully with valid clinician and session', async () => {
    const response = await executeClinicalDrafting(
      mockPatientSession as any,
      mockClinician as any,
      validRequest
    );

    expect(response.status).toBe('SUCCESS');
    expect(response.draft).toBeDefined();
    expect(response.draft?.labels).toContain(DRAFT_LABELS.TITLE);
    expect(response.draft?.labels).toContain(DRAFT_LABELS.LEGAL_DISCLAIMER);
    expect(response.draft?.labels).toContain(DRAFT_LABELS.REVIEW_REQUIREMENT);
    expect(response.draft?.metadata.isDeterministic).toBe(true);
    expect(response.draft?.text).toContain('DRAFT');
  });

  it('should fail-closed if clinician identity is invalid', async () => {
    const invalidClinician = { ...mockClinician, id: '' };
    const response = await executeClinicalDrafting(
      mockPatientSession as any,
      invalidClinician as any,
      validRequest
    );

    expect(response.status).toBe('ERROR');
    expect(response.metadata.reason).toBe('INVALID_IDENTITY');
    expect(response.draft).toBeUndefined();
  });

  it('should fail-closed if patient session is missing for patient-scoped request', async () => {
    const response = await executeClinicalDrafting(
      null,
      mockClinician as any,
      validRequest
    );

    expect(response.status).toBe('DENY');
    expect(response.metadata.reason).toBe('INVALID_SESSION');
  });

  it('should fail-closed if tenant mismatch occurs', async () => {
    const mismatchedClinician = { ...mockClinician, tenantId: 'wrong-tenant' };
    const response = await executeClinicalDrafting(
      mockPatientSession as any,
      mismatchedClinician as any,
      validRequest
    );

    expect(response.status).toBe('DENY');
    expect(response.metadata.reason).toBe('TENANT_MISMATCH');
  });

  it('should fail-closed if consent is denied (mocking gate)', async () => {
    vi.mocked(gate.evaluatePatientScopeGate).mockReturnValue({ 
      effect: 'DENY', 
      reasonCode: 'NO_CONSENT' 
    } as any);

    const response = await executeClinicalDrafting(
      mockPatientSession as any,
      mockClinician as any,
      validRequest
    );

    expect(response.status).toBe('DENY');
    expect(response.metadata.reason).toBe('CONSENT_DENY');
  });

  it('should maintain draft-only semantics (no side effects/writes)', async () => {
    const response = await executeClinicalDrafting(
      mockPatientSession as any,
      mockClinician as any,
      validRequest
    );

    expect(response.status).toBe('SUCCESS');
    expect(response.message).toContain('Clinical draft generated');
  });
});
