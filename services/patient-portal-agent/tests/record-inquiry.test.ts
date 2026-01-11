import { describe, it, expect, vi } from 'vitest';
import { executeRecordSummaryInquiry } from '../orchestration/record-inquiry-workflow';
import { AccessPurpose, ActorType } from '@starter/patient-scope-gate';

describe('SL-02: Patient Record Inquiry (Read-Only Summary)', () => {
  const mockTenantId = 'tenant-123';
  const mockPatientId = 'patient-456';

  it('should ALLOW access when SL-01 gate passes (self-access)', async () => {
    const request = {
      actor: {
        id: mockPatientId,
        type: ActorType.PATIENT,
        tenantId: mockTenantId,
        role: 'patient'
      },
      tenantId: mockTenantId,
      targetPatientId: mockPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const response = await executeRecordSummaryInquiry(request);

    expect(response.status).toBe('ALLOW');
    expect(response.summary).toBeDefined();
    expect(response.disclaimer).toContain('not medical advice');
    expect(response.labels).toContain('Read-only');
    expect(response.metadata.targetPatientId).toBe(mockPatientId);
  });

  it('should DENY access when SL-01 gate fails (tenant mismatch)', async () => {
    const request = {
      actor: {
        id: mockPatientId,
        type: ActorType.PATIENT,
        tenantId: 'wrong-tenant',
        role: 'patient'
      },
      tenantId: mockTenantId,
      targetPatientId: mockPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const response = await executeRecordSummaryInquiry(request);

    expect(response.status).toBe('DENY');
    expect(response.summary).toBeUndefined();
    expect(response.justification).toContain('tenant does not match');
    expect(response.metadata.reasonCode).toBe('TENANT_MISMATCH');
  });

  it('should DENY access when SL-01 gate fails (patient mismatch)', async () => {
    const request = {
      actor: {
        id: 'wrong-patient',
        type: ActorType.PATIENT,
        tenantId: mockTenantId,
        role: 'patient'
      },
      tenantId: mockTenantId,
      targetPatientId: mockPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const response = await executeRecordSummaryInquiry(request);

    expect(response.status).toBe('DENY');
    expect(response.summary).toBeUndefined();
    expect(response.justification).toContain('does not match target patient');
    expect(response.metadata.reasonCode).toBe('PATIENT_MISMATCH');
  });

  it('should DENY access when SL-01 gate fails (missing identity)', async () => {
    // @ts-ignore - testing missing field
    const request = {
      tenantId: mockTenantId,
      targetPatientId: mockPatientId,
      purpose: AccessPurpose.PATIENT_REQUEST
    };

    const response = await executeRecordSummaryInquiry(request);

    expect(response.status).toBe('DENY');
    expect(response.metadata.reasonCode).toBe('MISSING_IDENTITY');
  });
});
