// components/chat/ChatRoom.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Loading from '@/components/ui/Loading';
import ChatInput from '@/components/chat/ChatInput';
import { useSocket } from '@/hooks/useSocket';
import { useChatRoom } from '@/hooks/useChatRoom';
import { SafeMessage, SafeUser } from '@/types';

type ChatRoomProps = {
  onBack?: () => void;
  isMobile?: boolean;
};

export default function ChatRoom({ onBack, isMobile = false }: ChatRoomProps) {
  const params = useParams();
  const chatRoomId = params?.chatRoomId as string;
  const { chatRoom, isLoading, error, mutate } = useChatRoom(chatRoomId);
  const { messages, sendMessage, isConnected } = useSocket({ chatRoomId });
  const [allMessages, setAllMessages] = useState<SafeMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combine server-fetched messages with real-time socket messages
  useEffect(() => {
    if (chatRoom?.messages) {
      // Start with existing messages from the API
      const existingMessageIds = new Set(messages.map(m => m.id));
      const combinedMessages = [
        ...chatRoom.messages,
        // Add only new socket messages that aren't already in the API response
        ...messages.filter(m => !m.id || !existingMessageIds.has(m.id))
      ];
      
      // Sort by createdAt
      combinedMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setAllMessages(combinedMessages);
    }
  }, [chatRoom?.messages, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !chatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Failed to load chat room
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center">
          <Avatar src={null} name={chatRoom.name} />
          <div className="ml-3">
            <h2 className="font-semibold">{chatRoom.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {chatRoom.members.length} members •{" "}
              {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
            <p>No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          <>
            {allMessages.map((message, index) => (
              <MessageBubble
                key={message.id || `temp-${index}`}
                message={message}
                isConsecutive={
                  index > 0 && allMessages[index - 1].userId === message.userId
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}

type MessageBubbleProps = {
  message: SafeMessage;
  isConsecutive?: boolean;
};

function MessageBubble({ message, isConsecutive = false }: MessageBubbleProps) {
  // This would come from session in a real app
  const isCurrentUser = false; // Replace with actual check: message.userId === session.user.id
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex ${isConsecutive ? 'pl-12' : ''} ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {!isConsecutive && !isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <Avatar 
              src={message.user.image} 
              name={message.user.name} 
              isOnline={true} // This would be dynamic based on user status
            />
          </div>
        )}
        <div>
          {!isConsecutive && (
            <div className={`flex items-center mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              {!isCurrentUser && <span className="text-sm font-medium">{message.user.name}</span>}
              <span className="text-xs text-gray-500 ml-2">
                {format(new Date(message.createdAt), 'h:mm a')}
              </span>
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-2xl 
              ${isCurrentUser 
                ? 'bg-blue-500 text-white rounded-tr-none' 
                : 'bg-gray-200 dark:bg-gray-800 rounded-tl-none'
              }`}
          >
            <p>{message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}