import { useState, useCallback, useEffect } from 'react';
import { chatClient } from '../../../lib/chat-agent';
import { ChatMessage, ChatState } from '../../../types/chat';

export function useChat(conversationId?: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const fetchMessages = useCallback(async (id: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const history = await chatClient.getMessages(id);
      setState(s => ({
        ...s,
        messages: history.messages.map(m => ({ ...m, isDraft: m.role === 'assistant' })),
        isLoading: false,
      }));
    } catch (err) {
      setState(s => ({ ...s, isLoading: false, error: (err as Error).message }));
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setState(s => ({
      ...s,
      messages: [...s.messages, userMessage],
    }));

    try {
      const assistantMessage: ChatMessage = {
        id: 'assistant-pending',
        conversationId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        isDraft: true,
      };

      setState(s => ({
        ...s,
        messages: [...s.messages, assistantMessage],
      }));

      const stream = chatClient.streamMessage(conversationId, { content });
      
      let fullContent = '';
      for await (const chunk of stream) {
        if (chunk.delta) {
          fullContent += chunk.delta;
          setState(s => ({
            ...s,
            messages: s.messages.map(m => 
              m.id === 'assistant-pending' ? { ...m, content: fullContent } : m
            ),
          }));
        }
      }
    } catch (err) {
      setState(s => ({ ...s, error: (err as Error).message }));
    }
  }, [conversationId]);

  return {
    ...state,
    sendMessage,
  };
}
