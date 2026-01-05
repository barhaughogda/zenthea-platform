import { MessagingService, MessageData, UIConversation } from '../lib/contracts/messaging';

export const mockMessagingService: MessagingService = {
  getConversations: async (_patientId: string): Promise<UIConversation[]> => [],
  getMessages: async (_conversationId: string): Promise<MessageData[]> => [],
  getMessageHandlers: () => ({}),
  sendMessage: async (_patientId: string, _conversationId: string, _content: string): Promise<void> => {},
  createConversation: async (_patientId: string, _recipientId: string, _subject: string, _initialMessage: string): Promise<string> => 'mock-thread-id',
};
