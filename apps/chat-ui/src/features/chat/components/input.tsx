import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-4 bg-white border-t border-gray-100"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-2 text-white bg-blue-600 rounded-full disabled:bg-gray-300 transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
