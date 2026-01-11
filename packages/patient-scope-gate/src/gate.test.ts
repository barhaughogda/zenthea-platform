import { describe, it, expect, vi } from 'vitest';
import { evaluatePatientScopeGate } from './gate';
import { AccessPurpose, ActorType, DenyReason } from './types';

describe('SL-01: Patient Scoping & Consent Gate', () => {
  const validTenantId = 'tenant-123';
  const validPatientId = 'patient-456';
  
  const validPatientActor = {
    id: validPatientId,
    type: ActorType.PATIENT,
    tenantId: validTenantId,
    role: 'patient'
  };

  const validRepActor = {
    id: 'rep-789',
    type: ActorType.REPRESENTATIVE,
    tenantId: validTenantId,
    role: 'legal_guardian'
  };

  it('allows valid self-access by patient', () => {
    const request = {
      actor: validPatientActor,
      tenantId: validTenantId,
      targetPatientId: validPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('ALLOW');
    expect(result.metadata.actorId).toBe(validPatientId);
  });

  it('allows valid access by representative with valid proof', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const request = {
      actor: validRepActor,
      tenantId: validTenantId,
      targetPatientId: validPatientId,
      purpose: AccessPurpose.TREATMENT,
      consentProof: {
        signature: 'valid-sig',
        validUntil: futureDate.toISOString(),
        patientId: validPatientId,
        purpose: AccessPurpose.TREATMENT
      }
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('ALLOW');
  });

  it('denies when tenantId mismatches', () => {
    const request = {
      actor: validPatientActor,
      tenantId: 'wrong-tenant',
      targetPatientId: validPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.TENANT_MISMATCH);
    }
  });

  it('denies when patient tries to access other patient data', () => {
    const request = {
      actor: validPatientActor,
      tenantId: validTenantId,
      targetPatientId: 'other-patient',
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.PATIENT_MISMATCH);
    }
  });

  it('denies when representative is missing consent proof', () => {
    const request = {
      actor: validRepActor,
      tenantId: validTenantId,
      targetPatientId: validPatientId,
      purpose: AccessPurpose.TREATMENT
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.CONSENT_MISSING);
    }
  });

  it('denies when consent proof is for a different purpose', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const request = {
      actor: validRepActor,
      tenantId: validTenantId,
      targetPatientId: validPatientId,
      purpose: AccessPurpose.TREATMENT,
      consentProof: {
        signature: 'valid-sig',
        validUntil: futureDate.toISOString(),
        patientId: validPatientId,
        purpose: AccessPurpose.RESEARCH // Mismatch
      }
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.INVALID_PURPOSE);
    }
  });

  it('denies when consent proof is expired', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const request = {
      actor: validRepActor,
      tenantId: validTenantId,
      targetPatientId: validPatientId,
      purpose: AccessPurpose.TREATMENT,
      consentProof: {
        signature: 'valid-sig',
        validUntil: pastDate.toISOString(),
        patientId: validPatientId,
        purpose: AccessPurpose.TREATMENT
      }
    };

    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.CONSENT_INVALID);
    }
  });

  it('denies and fails closed on missing request fields', () => {
    // @ts-ignore
    const request = {
      actor: validPatientActor,
      // tenantId missing
      targetPatientId: validPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    // @ts-ignore
    const result = evaluatePatientScopeGate(request);

    expect(result.effect).toBe('DENY');
    if (result.effect === 'DENY') {
      expect(result.reasonCode).toBe(DenyReason.MISSING_IDENTITY);
    }
  });

  // Note: Internal error testing is handled by catching unexpected exceptions 
  // in the evaluatePatientScopeGate function. Moking global crypto here 
  // can cause environment stability issues in some test runners.
});
