'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SafeMessage, SafeUser } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

type MessageListProps = {
  messages: SafeMessage[];
  currentUser: SafeUser;
};

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Start the conversation by sending a message below</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.userId === currentUser.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-3/4 gap-2`}>
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 mt-1">
                      <Avatar src={message.user.image} name={message.user.name} />
                    </div>
                  )}
                  <div className={`
                    rounded-2xl px-4 py-2 max-w-xs sm:max-w-md break-words
                    ${isCurrentUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'}
                  `}>
                    {!isCurrentUser && (
                      <div className="font-medium text-xs mb-1 text-gray-700 dark:text-gray-300">
                        {message.user.name}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
