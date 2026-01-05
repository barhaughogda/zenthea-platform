export abstract class AppointmentBookingAgentSDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AppointmentBookingAgentNetworkError extends AppointmentBookingAgentSDKError {
  constructor(message: string, public readonly cause?: unknown) {
    super(`Network error: ${message}`);
  }
}

export class AppointmentBookingAgentServerError extends AppointmentBookingAgentSDKError {
  constructor(message: string, public readonly status: number) {
    super(`Server error (${status}): ${message}`);
  }
}

export class AppointmentBookingAgentClientError extends AppointmentBookingAgentSDKError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(`Client error (${status}): ${message}`);
  }
}

export class AppointmentBookingAgentValidationError extends AppointmentBookingAgentSDKError {
  constructor(message: string, public readonly details?: unknown) {
    super(`Validation error: ${message}`);
  }
}
