/**
 * Metadata-only event for an attempted or completed lifecycle transition.
 * 🚫 MUST NOT include PHI, tenantId, or actorId.
 */
export interface TransitionEvent {
  agentVersion: string;
  fromState: string;
  toState: string;
  decision: 'requested' | 'approved' | 'rejected';
  policySnapshotHash: string;
  timestamp: string;
}

/**
 * Interface for emitting lifecycle transition telemetry.
 */
export interface ITransitionTelemetry {
  /**
   * Emits a transition event. 
   * MUST be non-blocking and fire-and-forget.
   */
  emitTransitionEvent(event: TransitionEvent): void;
}

/**
 * Factory for creating a transition telemetry emitter.
 * Uses a generic logger to emit events.
 */
export interface IGenericLogger {
  info(tag: string, message: string, data: Record<string, unknown>): void;
}

export const createTransitionTelemetry = (logger: IGenericLogger): ITransitionTelemetry => {
  return {
    emitTransitionEvent: (event: TransitionEvent) => {
      // Fire-and-forget logging
      logger.info('lifecycle_transition', 'Lifecycle transition event recorded', event as unknown as Record<string, unknown>);
    },
  };
};
