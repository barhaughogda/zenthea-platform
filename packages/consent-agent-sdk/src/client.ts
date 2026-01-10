import {
  ConsentRecord,
  ConsentRecordSchema,
  ConsentHistory,
  ConsentHistorySchema,
  ConsentDecisionResponse,
  ConsentDecisionResponseSchema,
} from './types';
import { ControlPlaneContext, GovernanceGuard } from '@starter/service-control-adapter';
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
  async getHistory(ctx: ControlPlaneContext, patientId: string): Promise<ConsentHistory> {
    const data = await this.request(ctx, `/patients/${patientId}/history`, {
      method: 'GET',
    });
    return this.validate(ConsentHistorySchema, data);
  }

  /**
   * Check if access is allowed
   */
  async checkConsent(ctx: ControlPlaneContext, request: {
    patientId: string;
    actorId: string;
    purpose: string;
    resourceId?: string;
  }): Promise<ConsentDecisionResponse> {
    const data = await this.request(ctx, '/check', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return this.validate(ConsentDecisionResponseSchema, data);
  }

  private async request(ctx: ControlPlaneContext, path: string, options: RequestInit): Promise<unknown> {
    const response = await this.rawRequest(ctx, path, options);
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  private async rawRequest(ctx: ControlPlaneContext, path: string, options: RequestInit): Promise<Response> {
    // CP-21: Mandatory Gate Enforcement - Fail Closed
    GovernanceGuard.enforce(ctx);

    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(this.config.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // CP-21: Propagate governance context via headers
    headers.set('X-Control-Plane-Trace-Id', ctx.traceId);
    headers.set('X-Control-Plane-Actor-Id', ctx.actorId);
    headers.set('X-Control-Plane-Policy-Version', ctx.policyVersion);

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
