import { mockMessagingService } from '@/mocks/messaging';

export const MessageCardMockData = mockMessagingService.getMessages();
export const createMockMessageData = (..._args: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[]) => mockMessagingService.getMessages();
export const mockMessageHandlers = mockMessagingService.getMessageHandlers();
