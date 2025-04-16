'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, PaperclipIcon } from 'lucide-react';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  isDisabled?: boolean;
};

export default function MessageInput({ onSendMessage, isDisabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isDisabled}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || isDisabled}
          className="p-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </form>
    </div>
  );
}

