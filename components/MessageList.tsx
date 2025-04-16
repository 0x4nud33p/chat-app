'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import { SafeMessage } from '@/types';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

type MessageListProps = {
  messages: SafeMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p className="text-center">No messages yet</p>
          <p className="text-center text-sm">Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.userId === session?.user?.id;
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <Avatar src={message.user.image} name={message.user.name} />
                  </div>
                )}
                <div className="flex flex-col">
                  {!isCurrentUser && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {message.user.name}
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                    isCurrentUser ? 'text-right' : 'text-left'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
