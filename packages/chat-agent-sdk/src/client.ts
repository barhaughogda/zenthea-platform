import {
  Conversation,
  ConversationSchema,
  CreateConversationRequest,
  CreateMessageRequest,
  Message,
  MessageSchema,
  ConversationHistory,
  ConversationHistorySchema,
  ConversationList,
  ConversationListSchema,
  StreamChunk,
  StreamChunkSchema,
} from './types';
import { ControlPlaneContext, GovernanceGuard } from '@starter/service-control-adapter';
import {
  ChatAgentClientError,
  ChatAgentNetworkError,
  ChatAgentServerError,
  ChatAgentValidationError,
  ChatAgentSDKError,
} from './errors';

export interface ChatAgentConfig {
  baseUrl: string;
  apiKey?: string;
  getToken?: () => Promise<string>;
  headers?: Record<string, string>;
}

export class ChatAgentClient {
  private readonly baseUrl: string;

  constructor(private readonly config: ChatAgentConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  /**
   * Create a new conversation
   * CP-21: Requires Governance context.
   */
  async createConversation(ctx: ControlPlaneContext, request: CreateConversationRequest): Promise<Conversation> {
    const data = await this.request(ctx, '/conversations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return this.validate(ConversationSchema, data);
  }

  /**
   * Get conversation metadata
   */
  async getConversation(ctx: ControlPlaneContext, id: string): Promise<Conversation> {
    const data = await this.request(ctx, `/conversations/${id}`, {
      method: 'GET',
    });
    return this.validate(ConversationSchema, data);
  }

  /**
   * List all conversations for a tenant/patient
   */
  async listConversations(
    ctx: ControlPlaneContext,
    options: { cursor?: string; limit?: number } = {}
  ): Promise<ConversationList> {
    const params = new URLSearchParams();
    if (options.cursor) params.append('cursor', options.cursor);
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await this.request(ctx, `/conversations${queryString}`, {
      method: 'GET',
    });
    return this.validate(ConversationListSchema, data);
  }

  /**
   * Get message history for a conversation
   */
  async getMessages(
    ctx: ControlPlaneContext,
    conversationId: string,
    options: { cursor?: string; limit?: number } = {}
  ): Promise<ConversationHistory> {
    const params = new URLSearchParams();
    if (options.cursor) params.append('cursor', options.cursor);
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await this.request(ctx, `/conversations/${conversationId}/messages${queryString}`, {
      method: 'GET',
    });
    return this.validate(ConversationHistorySchema, data);
  }

  /**
   * Send a message and get a full response (non-streaming)
   */
  async sendMessage(ctx: ControlPlaneContext, conversationId: string, request: CreateMessageRequest): Promise<Message> {
    const data = await this.request(ctx, `/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ ...request, stream: false }),
    });
    return this.validate(MessageSchema, data);
  }

  /**
   * Send a message and stream the response
   */
  async *streamMessage(
    ctx: ControlPlaneContext,
    conversationId: string,
    request: CreateMessageRequest
  ): AsyncIterableIterator<StreamChunk> {
    const response = await this.rawRequest(ctx, `/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.body) {
      throw new ChatAgentServerError('No response body for stream', 500);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') return;

          try {
            const parsed = JSON.parse(jsonStr);
            yield this.validate(StreamChunkSchema, parsed);
          } catch (e) {
            console.error('Failed to parse stream chunk', e, jsonStr);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
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
          throw new ChatAgentServerError(errorData.message || 'Internal Server Error', status);
        } else {
          throw new ChatAgentClientError(
            errorData.message || 'Bad Request',
            status,
            errorData.code,
            errorData.details
          );
        }
      }

      return response;
    } catch (error) {
      if (error instanceof ChatAgentSDKError) throw error;
      throw new ChatAgentNetworkError((error as Error).message, error);
    }
  }

  private validate<T>(schema: { safeParse: (data: unknown) => any }, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ChatAgentValidationError('Response validation failed', result.error.format());
    }
    return result.data as T;
  }
}
