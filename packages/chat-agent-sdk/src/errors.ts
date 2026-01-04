/**
 * Base error class for ChatAgent SDK
 */
export class ChatAgentSDKError extends Error {
  constructor(message: string, public readonly status?: number, public readonly code?: string) {
    super(message);
    this.name = 'ChatAgentSDKError';
  }
}

/**
 * Thrown when the API returns a 4xx error
 */
export class ChatAgentClientError extends ChatAgentSDKError {
  constructor(message: string, status: number, code?: string, public readonly details?: unknown) {
    super(message, status, code);
    this.name = 'ChatAgentClientError';
  }
}

/**
 * Thrown when the API returns a 5xx error
 */
export class ChatAgentServerError extends ChatAgentSDKError {
  constructor(message: string, status: number, code?: string) {
    super(message, status, code);
    this.name = 'ChatAgentServerError';
  }
}

/**
 * Thrown when request/response validation fails
 */
export class ChatAgentValidationError extends ChatAgentSDKError {
  constructor(message: string, public readonly details: unknown) {
    super(message);
    this.name = 'ChatAgentValidationError';
  }
}

/**
 * Thrown when a network or unknown error occurs
 */
export class ChatAgentNetworkError extends ChatAgentSDKError {
  constructor(message: string, public readonly originalError: unknown) {
    super(message);
    this.name = 'ChatAgentNetworkError';
  }
}
