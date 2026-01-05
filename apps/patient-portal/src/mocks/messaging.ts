import { MessagingService, MessageData, UIConversation } from '../lib/contracts/messaging';

export const mockMessagingService: MessagingService = {
  getConversations: async (_patientId: string): Promise<UIConversation[]> => [],
  getMessages: async (_conversationId: string): Promise<MessageData[]> => [],
  getMessageHandlers: () => ({}),
};
