'use client';

import React, { useState } from 'react';
import { ChatWindow } from '@starter/chat-ui';

export default function ChatPage() {
  const [conversationId] = useState('<CONVERSATION_ID>');

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-500">This chat service is composed from the standalone Chat UI.</p>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}
