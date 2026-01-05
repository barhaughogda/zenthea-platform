import {
  ConsentRecord,
  ConsentRecordSchema,
  ConsentHistory,
  ConsentHistorySchema,
  ConsentDecisionResponse,
  ConsentDecisionResponseSchema,
} from './types';
import {
  ConsentAgentClientError,
  ConsentAgentNetworkError,
  ConsentAgentServerError,
  ConsentAgentValidationError,
  ConsentAgentSDKError,
} from './errors';

export interface ConsentAgentConfig {
  baseUrl: string;
  apiKey?: string;
  getToken?: () => Promise<string>;
  headers?: Record<string, string>;
}

export class ConsentAgentClient {
  private readonly baseUrl: string;

  constructor(private readonly config: ConsentAgentConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  /**
   * Get consent history for a patient
   */
  async getHistory(patientId: string): Promise<ConsentHistory> {
    const data = await this.request(`/patients/${patientId}/history`, {
      method: 'GET',
    });
    return this.validate(ConsentHistorySchema, data);
  }

  /**
   * Check if access is allowed
   */
  async checkConsent(request: {
    patientId: string;
    actorId: string;
    purpose: string;
    resourceId?: string;
  }): Promise<ConsentDecisionResponse> {
    const data = await this.request('/check', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return this.validate(ConsentDecisionResponseSchema, data);
  }

  private async request(path: string, options: RequestInit): Promise<unknown> {
    const response = await this.rawRequest(path, options);
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  private async rawRequest(path: string, options: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(this.config.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    if (this.config.apiKey) {
      headers.set('X-API-Key', this.config.apiKey);
    }

    if (this.config.getToken) {
      const token = await this.config.getToken();
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const status = response.status;
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: await response.text() };
        }

        if (status >= 500) {
          throw new ConsentAgentServerError(errorData.message || 'Internal Server Error', status);
        } else {
          throw new ConsentAgentClientError(
            errorData.message || 'Bad Request',
            status,
            errorData.code,
            errorData.details
          );
        }
      }

      return response;
    } catch (error) {
      if (error instanceof ConsentAgentSDKError) throw error;
      throw new ConsentAgentNetworkError((error as Error).message, error);
    }
  }

  private validate<T>(schema: { safeParse: (data: unknown) => any }, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ConsentAgentValidationError('Response validation failed', result.error.format());
    }
    return result.data as T;
  }
}
