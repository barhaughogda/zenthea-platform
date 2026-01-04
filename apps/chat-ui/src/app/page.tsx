"use client";

import { ChatWindow } from "@/features/chat/components/window";

export default function Home() {
  return (
    <div className="h-full flex flex-col md:py-8">
      <div className="flex-1 max-h-screen">
        <ChatWindow conversationId="<CONVERSATION_ID>" />
      </div>
    </div>
  );
}
