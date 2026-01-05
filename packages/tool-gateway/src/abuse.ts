import { AbuseSignalEvent, ToolGatewayEvent } from './types';

/**
 * Deterministic Abuse Signal Engine
 * 
 * Detects suspicious patterns in tool usage without enforcing or blocking.
 * Operates on metadata-only telemetry.
 * 🚫 NO PHI, NO actorId, NO tenantId.
 */
export class AbuseSignalEngine {
  // In-memory sliding window: Map<RuleKey, Timestamps[]>
  private windows = new Map<string, number[]>();
  
  // Throttle: Map<RuleKey, lastEmittedTimestamp>
  // Requirement: "At most once per rule per window"
  private throttles = new Map<string, number>();

  // Memory bounds: Max number of keys to track
  private readonly MAX_TRACKED_KEYS = 1000;

  constructor(private readonly emitter: (event: AbuseSignalEvent) => void) {}

  /**
   * Processes a telemetry event and evaluates all active rules.
   * MUST NEVER throw.
   */
  public processEvent(event: ToolGatewayEvent): void {
    try {
      this.evaluateRuleA(event); // Excessive RATE_LIMITED
      this.evaluateRuleB(event); // Repeated FORBIDDEN
      this.evaluateRuleC(event); // Writes While Disabled
      this.evaluateRuleD(event); // Idempotency Conflicts
      
      this.cleanupMemory();
    } catch (err) {
      // Signals must never throw or affect control flow
      console.error('[AbuseSignalEngine] Unexpected error during evaluation:', err);
    }
  }

  /**
   * Rule A: Excessive RATE_LIMITED
   * >= 10 in 5 minutes per toolName + actorType
   */
  private evaluateRuleA(event: ToolGatewayEvent): void {
    if (event.decision !== 'rate_limited') return;

    const windowMs = 5 * 60 * 1000; // 5 minutes
    const threshold = 10;
    const ruleId = 'RULE_A_EXCESSIVE_RATE_LIMIT';
    const key = `${ruleId}:${event.toolName}:${event.actorType}`;

    this.trackAndEmit(key, ruleId, 'medium', event.toolName, event.actorType, windowMs, threshold);
  }

  /**
   * Rule B: Repeated FORBIDDEN
   * >= 5 in 10 minutes per toolName
   */
  private evaluateRuleB(event: ToolGatewayEvent): void {
    if (event.errorCode !== 'FORBIDDEN') return;

    const windowMs = 10 * 60 * 1000; // 10 minutes
    const threshold = 5;
    const ruleId = 'RULE_B_REPEATED_FORBIDDEN';
    const key = `${ruleId}:${event.toolName}`;

    this.trackAndEmit(key, ruleId, 'high', event.toolName, event.actorType, windowMs, threshold);
  }

  /**
   * Rule C: Writes While Disabled
   * >= 1 occurrence if feature is disabled
   */
  private evaluateRuleC(event: ToolGatewayEvent): void {
    // Trigger when errorCode is FEATURE_DISABLED
    if (event.errorCode !== 'FEATURE_DISABLED') return;

    const windowMs = 60 * 1000; // 1 minute throttle for signals
    const threshold = 1;
    const ruleId = 'RULE_C_WRITE_WHILE_DISABLED';
    const key = `${ruleId}:${event.toolName}`;

    this.trackAndEmit(key, ruleId, 'high', event.toolName, event.actorType, windowMs, threshold);
  }

  /**
   * Rule D: Idempotency Conflicts
   * >= 5 CONFLICT in 10 minutes
   */
  private evaluateRuleD(event: ToolGatewayEvent): void {
    if (event.errorCode !== 'CONFLICT') return;

    const windowMs = 10 * 60 * 1000; // 10 minutes
    const threshold = 5;
    const ruleId = 'RULE_D_IDEMPOTENCY_CONFLICTS';
    const key = `${ruleId}:${event.toolName}`;

    this.trackAndEmit(key, ruleId, 'low', event.toolName, event.actorType, windowMs, threshold);
  }

  /**
   * Generic sliding window tracker and signal emitter.
   */
  private trackAndEmit(
    key: string,
    ruleId: string,
    severity: AbuseSignalEvent['severity'],
    toolName: string,
    actorType: AbuseSignalEvent['actorType'],
    windowMs: number,
    threshold: number
  ): void {
    const now = Date.now();
    
    // 1. Update sliding window
    let timestamps = this.windows.get(key) || [];
    timestamps = timestamps.filter(t => now - t < windowMs);
    timestamps.push(now);
    
    // Prevent unbounded array growth if threshold is high
    if (timestamps.length > threshold * 2) {
      timestamps = timestamps.slice(-threshold * 2);
    }
    
    this.windows.set(key, timestamps);

    // 2. Check threshold
    if (timestamps.length >= threshold) {
      // 3. Apply throttling (at most once per rule per window)
      const lastEmitted = this.throttles.get(key) || 0;
      if (now - lastEmitted >= windowMs) {
        const signal: AbuseSignalEvent = {
          ruleId,
          severity,
          toolName,
          actorType,
          windowMs,
          observedCount: timestamps.length,
          threshold,
          timestamp: new Date().toISOString(),
        };

        this.emitter(signal);
        this.throttles.set(key, now);
      }
    }
  }

  /**
   * Simple cleanup to prevent memory leaks in long-running processes.
   */
  private cleanupMemory(): void {
    if (this.windows.size < this.MAX_TRACKED_KEYS) return;

    const now = Date.now();
    
    // Cleanup windows
    for (const [key, timestamps] of this.windows.entries()) {
      // If no timestamps in the last hour, remove key
      const lastTimestamp = timestamps[timestamps.length - 1];
      if (now - lastTimestamp > 3600000) {
        this.windows.delete(key);
        this.throttles.delete(key);
      }
    }
  }
}
