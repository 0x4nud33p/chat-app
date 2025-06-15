'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-6"
      >
        <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-full inline-block">
          <MessageSquare size={40} className="text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Chat App</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {user?.name ? `Hello ${user.name}!` : 'Hello!'} Select a chat.
        </p>
      </motion.div>
    </div>
  );
}
