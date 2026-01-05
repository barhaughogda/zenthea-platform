import {
  ClinicalQueryRequest,
  ClinicalQueryResponse,
  ClinicalQueryResponseSchema,
} from './types';
import {
  MedicalAdvisorAgentClientError,
  MedicalAdvisorAgentNetworkError,
  MedicalAdvisorAgentServerError,
  MedicalAdvisorAgentValidationError,
  MedicalAdvisorAgentSDKError,
} from './errors';

export interface MedicalAdvisorAgentConfig {
  baseUrl: string;
  apiKey?: string;
  getToken?: () => Promise<string>;
  headers?: Record<string, string>;
}

export class MedicalAdvisorAgentClient {
  private readonly baseUrl: string;

  constructor(private readonly config: MedicalAdvisorAgentConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  /**
   * Submit a clinical query to the advisor
   */
  async submitQuery(request: ClinicalQueryRequest): Promise<ClinicalQueryResponse> {
    const data = await this.request('/clinical/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return this.validate(ClinicalQueryResponseSchema, data);
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
          throw new MedicalAdvisorAgentServerError(errorData.message || 'Internal Server Error', status);
        } else {
          throw new MedicalAdvisorAgentClientError(
            errorData.message || 'Bad Request',
            status,
            errorData.code,
            errorData.details
          );
        }
      }

      return response;
    } catch (error) {
      if (error instanceof MedicalAdvisorAgentSDKError) throw error;
      throw new MedicalAdvisorAgentNetworkError((error as Error).message, error);
    }
  }

  private validate<T>(schema: { safeParse: (data: unknown) => any }, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new MedicalAdvisorAgentValidationError('Response validation failed', result.error.format());
    }
    return result.data as T;
  }
}
