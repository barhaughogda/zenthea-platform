import { ChatAgentClient } from '@starter/chat-agent-sdk';

/**
 * Initialize the Chat Agent Client
 * Rules:
 * - SDK initialization belongs in /src/lib
 * - No direct calls to service internals
 */
export const chatClient = new ChatAgentClient({
  baseUrl: process.env.NEXT_PUBLIC_CHAT_AGENT_URL || 'http://localhost:3001',
  getToken: async () => {
    // This would normally integrate with an auth service
    // For now, return a placeholder or get from session
    return 'placeholder-token';
  },
});
