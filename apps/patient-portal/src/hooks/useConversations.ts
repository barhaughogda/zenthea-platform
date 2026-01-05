import { useState, useEffect, useMemo } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { MessagingAgentAdapter, MockMessagingAdapter } from '@/lib/messaging/adapter';
import { UIConversation } from '@/lib/contracts/messaging';

export const useConversations = () => {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_CHAT_AGENT');
  const enableWrites = useFeatureFlag('USE_CHAT_WRITES');
  const patientId = session?.user?.id || 'mock-patient-id';

  const [conversations, setConversations] = useState<UIConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adapter = useMemo(() => {
    if (useRealAgent) {
      return new MessagingAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_CHAT_AGENT_URL || 'http://localhost:3003',
        enableWrites,
      });
    }
    return new MockMessagingAdapter();
  }, [useRealAgent, enableWrites]);

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      adapter.getConversations(patientId)
        .then(data => {
          setConversations(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('[useConversations] Error fetching conversations:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
          setIsLoading(false);
        });
    }
  }, [adapter, patientId]);

  const sendMessage = async (conversationId: string, content: string) => {
    if (!patientId) throw new Error('NOT_AUTHENTICATED');
    return adapter.sendMessage(patientId, conversationId, content);
  };

  const createConversation = async (recipientId: string, subject: string, initialMessage: string) => {
    if (!patientId) throw new Error('NOT_AUTHENTICATED');
    return adapter.createConversation(patientId, recipientId, subject, initialMessage);
  };

  return {
    conversations,
    isLoading,
    error,
    sendMessage,
    createConversation,
  };
};
