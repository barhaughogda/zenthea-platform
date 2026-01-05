export class MedicalAdvisorAgentSDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MedicalAdvisorAgentSDKError';
  }
}

export class MedicalAdvisorAgentNetworkError extends MedicalAdvisorAgentSDKError {
  constructor(message: string, public readonly cause?: unknown) {
    super(`Network error: ${message}`);
    this.name = 'MedicalAdvisorAgentNetworkError';
  }
}

export class MedicalAdvisorAgentServerError extends MedicalAdvisorAgentSDKError {
  constructor(message: string, public readonly status: number) {
    super(`Server error (${status}): ${message}`);
    this.name = 'MedicalAdvisorAgentServerError';
  }
}

export class MedicalAdvisorAgentClientError extends MedicalAdvisorAgentSDKError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(`Client error (${status}): ${message}`);
    this.name = 'MedicalAdvisorAgentClientError';
  }
}

export class MedicalAdvisorAgentValidationError extends MedicalAdvisorAgentSDKError {
  constructor(message: string, public readonly details?: unknown) {
    super(`Validation error: ${message}`);
    this.name = 'MedicalAdvisorAgentValidationError';
  }
}
