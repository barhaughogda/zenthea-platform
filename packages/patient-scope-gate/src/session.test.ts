import { describe, it, expect } from 'vitest';
import { establishPatientSessionContext, createGateRequestFromSession } from './session';
import { ActorType, AccessPurpose } from './types';

describe('SL-03: Patient Session Establishment', () => {
  const validToken = 'mock-jwt-token';
  const validTenantId = 'tenant-123';
  const validPatientId = 'patient-456';

  it('successfully establishes a session context with valid inputs', () => {
    const input = {
      authToken: validToken,
      tenantId: validTenantId,
      patientId: validPatientId
    };

    const context = establishPatientSessionContext(input);

    expect(context.sessionId).toBeDefined();
    expect(context.sessionId).toContain(validTenantId);
    expect(context.sessionId).toContain(validPatientId);
    expect(context.actor.id).toBe(validPatientId);
    expect(context.actor.type).toBe(ActorType.PATIENT);
    expect(context.actor.tenantId).toBe(validTenantId);
    expect(context.sessionMetadata.issuedAt).toBeDefined();
    expect(context.sessionMetadata.expiresAt).toBeDefined();
    expect(new Date(context.sessionMetadata.expiresAt).getTime())
      .toBeGreaterThan(new Date(context.sessionMetadata.issuedAt).getTime());
  });

  it('successfully includes consent proof when provided', () => {
    const consentProof = {
      signature: 'proof-sig',
      validUntil: new Date(Date.now() + 86400000).toISOString(),
      scope: ['records:read']
    };

    const input = {
      authToken: validToken,
      tenantId: validTenantId,
      patientId: validPatientId,
      consentProof
    };

    const context = establishPatientSessionContext(input);

    expect(context.consentProof).toEqual(consentProof);
  });

  it('fails closed when authToken is missing', () => {
    const input = {
      authToken: '',
      tenantId: validTenantId,
      patientId: validPatientId
    };

    expect(() => establishPatientSessionContext(input)).toThrow('MISSING_MANDATORY_SESSION_FIELDS');
  });

  it('fails closed when tenantId is missing', () => {
    const input = {
      authToken: validToken,
      tenantId: '',
      patientId: validPatientId
    };

    expect(() => establishPatientSessionContext(input)).toThrow('MISSING_MANDATORY_SESSION_FIELDS');
  });

  it('fails closed when patientId is missing', () => {
    const input = {
      authToken: validToken,
      tenantId: validTenantId,
      patientId: ''
    };

    expect(() => establishPatientSessionContext(input)).toThrow('MISSING_MANDATORY_SESSION_FIELDS');
  });

  it('is deterministic (no random identifiers)', () => {
    const input = {
      authToken: validToken,
      tenantId: validTenantId,
      patientId: validPatientId
    };

    const context1 = establishPatientSessionContext(input);
    const context2 = establishPatientSessionContext(input);

    expect(context1.sessionId).toBe(context2.sessionId);
  });

  describe('Downstream Wiring (SL-02)', () => {
    it('correctly converts session context to GateRequest', () => {
      const input = {
        authToken: validToken,
        tenantId: validTenantId,
        patientId: validPatientId
      };
      const session = establishPatientSessionContext(input);
      const gateRequest = createGateRequestFromSession(session, AccessPurpose.PATIENT_REQUEST);

      expect(gateRequest.actor.id).toBe(validPatientId);
      expect(gateRequest.actor.tenantId).toBe(validTenantId);
      expect(gateRequest.tenantId).toBe(validTenantId);
      expect(gateRequest.targetPatientId).toBe(validPatientId);
      expect(gateRequest.purpose).toBe(AccessPurpose.PATIENT_REQUEST);
    });
  });
});
