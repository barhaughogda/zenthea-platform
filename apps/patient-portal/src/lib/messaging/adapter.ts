import { ChatAgentClient, Conversation, Message as SDKMessage } from '@starter/chat-agent-sdk';
import { MessagingService, UIConversation, MessageData } from '../contracts/messaging';
import { ToolExecutionGateway, ToolAuditLogger } from '@starter/tool-gateway';

/**
 * Adapter translating Chat Agent SDK responses to the Patient Portal UI contract.
 * 
 * Mandatory Constraints:
 * - No business logic
 * - No data enrichment
 * - No retries, caching, batching, or orchestration
 * - Minimal structured logging at boundaries
 */
export class MessagingAgentAdapter implements MessagingService {
  private client: ChatAgentClient;
  private toolGateway: ToolExecutionGateway;
  private enableWrites: boolean;

  constructor(config: { 
    baseUrl: string; 
    getToken?: () => Promise<string>;
    enableWrites?: boolean;
  }) {
    this.client = new ChatAgentClient(config);
    this.toolGateway = new ToolExecutionGateway(new ToolAuditLogger());
    this.enableWrites = config.enableWrites || false;
  }

  async getConversations(patientId: string): Promise<UIConversation[]> {
    try {
      console.log('[MessagingAgentAdapter] Fetching conversations', { 
        event: 'CONVERSATIONS_FETCH_START', 
        patientId: patientId.slice(0, 4) + '...' // Redacting PHI
      });
      
      const response = await this.client.listConversations();
      
      const mapped = response.conversations.map((conv) => this.mapToUIConversation(conv));
      
      console.log('[MessagingAgentAdapter] Successfully fetched conversations', { 
        event: 'CONVERSATIONS_FETCH_SUCCESS', 
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        count: mapped.length 
      });
      return mapped;
    } catch (error) {
      console.error('[MessagingAgentAdapter] Failed to fetch conversations', {
        event: 'CONVERSATIONS_FETCH_ERROR',
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getMessages(conversationId: string): Promise<MessageData[]> {
    try {
      console.log('[MessagingAgentAdapter] Fetching messages', { 
        event: 'MESSAGES_FETCH_START', 
        conversationId: conversationId.slice(0, 4) + '...' // Redacting PHI
      });
      
      const response = await this.client.getMessages(conversationId);
      
      const mapped = response.messages.map((msg) => this.mapToUIMessage(msg));
      
      console.log('[MessagingAgentAdapter] Successfully fetched messages', { 
        event: 'MESSAGES_FETCH_SUCCESS', 
        conversationId: conversationId.slice(0, 4) + '...', // Redacting PHI
        count: mapped.length 
      });
      return mapped;
    } catch (error) {
      console.error('[MessagingAgentAdapter] Failed to fetch messages', {
        event: 'MESSAGES_FETCH_ERROR',
        conversationId: conversationId.slice(0, 4) + '...', // Redacting PHI
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async sendMessage(patientId: string, conversationId: string, content: string): Promise<void> {
    if (!this.enableWrites) {
      throw new Error('CHAT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      agentVersion: '1.0.0',
      tool: { name: 'chat.sendMessage', version: '1.0.0' },
      parameters: {
        patientId,
        conversationId,
        content,
      },
      approval: {
        approvedBy: patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `msg-${conversationId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }
  }

  async createConversation(patientId: string, recipientId: string, subject: string, initialMessage: string): Promise<string> {
    if (!this.enableWrites) {
      throw new Error('CHAT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      agentVersion: '1.0.0',
      tool: { name: 'chat.createConversation', version: '1.0.0' },
      parameters: {
        patientId,
        recipientId,
        subject,
        initialMessage,
      },
      approval: {
        approvedBy: patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `conv-${patientId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }

    return result.data?.conversationId || crypto.randomUUID();
  }

  getMessageHandlers(): Record<string, (..._args: unknown[]) => void> {
    return {}; // Read-only integration
  }

  private mapToUIConversation(conv: Conversation): UIConversation {
    const metadata = (conv.metadata || {}) as Record<string, unknown>;
    
    return {
      threadId: conv.id,
      otherUser: {
        id: (metadata.otherUserId as string) || 'unknown-provider',
        name: (metadata.otherUserName as string) || 'Care Team Member',
        email: metadata.otherUserEmail as string,
      },
      lastMessage: {
        content: (metadata.lastMessageContent as string) || 'No messages yet',
        priority: (metadata.lastMessagePriority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
        fromUserId: (metadata.lastMessageFromUserId as string) || 'system',
        createdAt: (metadata.lastMessageCreatedAt as string) || conv.updatedAt,
      },
      unreadCount: (metadata.unreadCount as number) || 0,
    };
  }

  private mapToUIMessage(msg: SDKMessage): MessageData {
    return {
      id: msg.id,
      sender: msg.role === 'assistant' ? 'Provider' : 'You',
      content: msg.content,
      timestamp: msg.createdAt,
    };
  }
}

/**
 * Mock implementation of the Messaging Service for development and testing.
 * Used when the USE_REAL_CHAT_AGENT feature flag is off.
 */
export class MockMessagingAdapter implements MessagingService {
  async getConversations(patientId: string): Promise<UIConversation[]> {
    console.log(`[MockMessagingAdapter] Returning mock conversations for patient: ${patientId}`);
    return [
      {
        threadId: 'mock-thread-1',
        otherUser: {
          id: 'provider-1',
          name: 'Dr. Sarah Smith',
          email: 'sarah.smith@zenthea.com'
        },
        lastMessage: {
          content: 'Hello! I have reviewed your latest test results. Everything looks good.',
          priority: 'normal',
          fromUserId: 'provider-1',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        unreadCount: 1
      },
      {
        threadId: 'mock-thread-2',
        otherUser: {
          id: 'provider-2',
          name: 'Nurse James Wilson',
          email: 'james.wilson@zenthea.com'
        },
        lastMessage: {
          content: 'Please remember to bring your insurance card to the next appointment.',
          priority: 'high',
          fromUserId: 'provider-2',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        unreadCount: 0
      }
    ];
  }

  async getMessages(conversationId: string): Promise<MessageData[]> {
    console.log(`[MockMessagingAdapter] Returning mock messages for conversation: ${conversationId}`);
    return [
      {
        id: 'msg-1',
        sender: 'Provider',
        content: 'Hello! How are you today?',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'You',
        content: 'I am doing well, thank you. I had a question about my prescription.',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  async sendMessage(patientId: string, conversationId: string, content: string): Promise<void> {
    console.log(`[MockMessagingAdapter] Sending mock message for patient: ${patientId}, conversation: ${conversationId}`, { content });
  }

  async createConversation(patientId: string, recipientId: string, subject: string, initialMessage: string): Promise<string> {
    console.log(`[MockMessagingAdapter] Creating mock conversation for patient: ${patientId}, recipient: ${recipientId}`, { subject, initialMessage });
    return `mock-thread-${Math.random().toString(36).substring(7)}`;
  }

  getMessageHandlers(): Record<string, (..._args: unknown[]) => void> {
    return {};
  }
}
