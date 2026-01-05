import { MessagingService, MessageData } from '../lib/contracts/messaging';

export const mockMessagingService: MessagingService = {
  getMessages: (): MessageData[] => [],
  getMessageHandlers: () => ({}),
};
