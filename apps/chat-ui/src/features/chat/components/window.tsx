'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/use-chat';
import { Message } from './message';
import { ChatInput } from './input';

interface ChatWindowProps {
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { messages, isLoading, error, sendMessage } = useChat(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white shadow-xl rounded-none md:rounded-2xl overflow-hidden border border-gray-100">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50" ref={scrollRef}>
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation below</p>
          </div>
        )}
        
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        
        {isLoading && (
          <div className="flex space-x-2 p-4 animate-pulse">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};
