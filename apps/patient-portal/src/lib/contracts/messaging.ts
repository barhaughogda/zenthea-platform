export interface MessageData {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  // Add more fields based on MessageCard requirements
}

export interface UIConversation {
  threadId: string;
  otherUser: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  lastMessage: {
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    fromUserId: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface MessagingService {
  getMessages(conversationId: string): Promise<MessageData[]>;
  getConversations(patientId: string): Promise<UIConversation[]>;
  getMessageHandlers(): Record<string, (..._args: unknown[]) => void>;
  sendMessage(patientId: string, conversationId: string, content: string): Promise<void>;
  createConversation(patientId: string, recipientId: string, subject: string, initialMessage: string): Promise<string>;
}
