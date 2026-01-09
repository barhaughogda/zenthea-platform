import { RequestContext, Severity } from './types';

export type LifecycleStatus = 'STARTED' | 'COMPLETED' | 'FAILED' | 'ABORTED';

export interface LifecycleSignal {
  readonly context: RequestContext;
  readonly orchestrationId: string;
  readonly phase: string;
  readonly status: LifecycleStatus;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Authoritative interface for orchestration lifecycle signaling.
 */
export interface IOrchestrationSignal {
  signal(signal: LifecycleSignal): Promise<void>;
}
