import { RequestContext } from './types';

export interface MutationRequest<T = unknown> {
  readonly context: RequestContext;
  readonly operation: string;
  readonly resource: string;
  readonly payload: T;
}

export interface MutationResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

/**
 * Authoritative interface for controlled mutations.
 * All state changes must pass through a controlled boundary.
 */
export interface IControlledMutation {
  execute<TInput, TOutput>(
    request: MutationRequest<TInput>
  ): Promise<MutationResult<TOutput>>;
}
