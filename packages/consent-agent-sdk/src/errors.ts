export class ConsentAgentSDKError extends Error {
  constructor(message: string, public readonly status?: number, public readonly code?: string, public readonly details?: any) {
    super(message);
    this.name = 'ConsentAgentSDKError';
  }
}

export class ConsentAgentClientError extends ConsentAgentSDKError {
  constructor(message: string, status: number, code?: string, details?: any) {
    super(message, status, code, details);
    this.name = 'ConsentAgentClientError';
  }
}

export class ConsentAgentServerError extends ConsentAgentSDKError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'ConsentAgentServerError';
  }
}

export class ConsentAgentNetworkError extends ConsentAgentSDKError {
  constructor(message: string, public readonly originalError: any) {
    super(message);
    this.name = 'ConsentAgentNetworkError';
  }
}

export class ConsentAgentValidationError extends ConsentAgentSDKError {
  constructor(message: string, details: any) {
    super(message, undefined, 'VALIDATION_ERROR', details);
    this.name = 'ConsentAgentValidationError';
  }
}
