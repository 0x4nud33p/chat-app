'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { SafeMessage } from '@/types';
import Avatar from './ui/Avatar';

type ChatMessageProps = {
  message: SafeMessage;
  isOwn: boolean;
};

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      <div className="flex-shrink-0">
        <Avatar src={message.user.image} name={message.user.name} />
      </div>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.user.name}</span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div
          className={`p-3 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white rounded-tr-none'
              : 'bg-gray-200 dark:bg-gray-800 rounded-tl-none'
          }`}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
