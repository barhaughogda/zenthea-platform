import { Message } from '@starter/chat-agent-sdk';

export interface ChatMessage extends Message {
  isDraft?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
