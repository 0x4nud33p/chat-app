'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
};

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t dark:border-gray-700">
      <div className="flex items-end bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'You must join the chat to send messages' : 'Type a message...'}
          disabled={disabled}
          className="flex-1 py-2 px-3 bg-transparent outline-none resize-none max-h-32 text-gray-900 dark:text-white"
          rows={1}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-2 mr-1 rounded-full ${
            !message.trim() || disabled
              ? 'text-gray-400'
              : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </div>
    </form>
  );
}

