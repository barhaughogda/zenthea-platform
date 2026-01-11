import { AuditEmitter, AuditSignal, AuditResult } from '../../audit/auditTypes';

/**
 * PR-09: FakeAuditEmitter (Deterministic, Fail-Closed)
 * 
 * Returns ACK, NACK, or throws based on provided flags.
 * Simulates both AUD-001 (Unreachable) and AUD-002 (Rejected).
 */
export class FakeAuditEmitter implements AuditEmitter {
  private mode: 'ACK' | 'NACK' | 'THROW' = 'ACK';
  private lastSignal: AuditSignal | null = null;
  private emissionCount = 0;

  public setMode(mode: 'ACK' | 'NACK' | 'THROW'): void {
    this.mode = mode;
  }

  public emit(signal: AuditSignal): AuditResult {
    this.lastSignal = signal;
    this.emissionCount++;

    if (this.mode === 'THROW') {
      throw new Error('Audit sink unreachable');
    }

    if (this.mode === 'NACK') {
      return {
        status: 'NACK',
        reason: 'Audit rejected by sink',
        error_code: 'AUD-002'
      };
    }

    return {
      status: 'ACK',
      audit_id: `audit-${signal.orchestration_attempt_id}-${this.emissionCount}`
    };
  }

  public getLastSignal(): AuditSignal | null {
    return this.lastSignal;
  }

  public getEmissionCount(): number {
    return this.emissionCount;
  }
}
