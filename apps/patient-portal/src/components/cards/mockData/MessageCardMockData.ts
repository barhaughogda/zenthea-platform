import { mockMessagingService } from '@/mocks/messaging';

export const MessageCardMockData = []; // Default to empty for now as it's a mock
export const createMockMessageData = (..._args: unknown[]) => [];
export const mockMessageHandlers = mockMessagingService.getMessageHandlers();
