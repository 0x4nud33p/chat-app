'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

type ChatInputProps = {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
};

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    // Add new line with Shift + Enter
    if (e.key === 'Enter' && e.shiftKey) {
      // Default behavior - create a new line
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none bg-transparent border-none outline-none max-h-32 py-2 px-3"
          rows={1}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className={`p-2 rounded-full ${
            message.trim() && !isLoading
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
          }`}
        >
          <Send size={20} />
        </motion.button>
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  );
}