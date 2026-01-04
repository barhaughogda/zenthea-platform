import React from 'react';
import { ChatMessage } from '../../../types/chat';
import { clsx } from 'clsx';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div
      className={clsx(
        "flex flex-col mb-4 max-w-[85%] md:max-w-[75%]",
        isAssistant ? "self-start" : "self-end items-end"
      )}
    >
      <div
        className={clsx(
          "px-4 py-2 rounded-2xl text-sm md:text-base",
          isAssistant 
            ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none" 
            : "bg-blue-600 text-white rounded-tr-none"
        )}
      >
        {message.content}
      </div>
      {isAssistant && message.isDraft && (
        <span className="text-[10px] text-gray-400 mt-1 ml-1 uppercase tracking-wider font-semibold">
          AI Draft
        </span>
      )}
    </div>
  );
};
