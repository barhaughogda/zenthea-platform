export interface MessageData {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  // Add more fields based on MessageCard requirements
}

export interface MessagingService {
  getMessages(): MessageData[];
  getMessageHandlers(): Record<string, (..._args: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[]) => void>;
}
