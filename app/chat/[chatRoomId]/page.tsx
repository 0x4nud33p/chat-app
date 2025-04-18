'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { SafeChatRoom, SafeMessage } from '@/types';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatRoomPage({ params }: { params: { chatRoomId: string } }) {
  const { chatRoomId } = params;
  const [chatRoom, setChatRoom] = useState<SafeChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<SafeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Initialize socket connection for this chat room
  const { messages, sendMessage, isConnected } = useSocket({ chatRoomId });

  // Fetch chat room data when component mounts
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat-rooms/${chatRoomId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Chat room not found');
          } else if (response.status === 401) {
            setError('You are not authorized to access this chat room');
          } else {
            setError('Failed to fetch chat room data');
          }
          return;
        }
        
        const data = await response.json();
        setChatRoom(data);
        setChatMessages(data.messages);
      } catch (error) {
        console.error('Error fetching chat room:', error);
        setError('An error occurred while fetching chat room data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatRoom();
  }, [chatRoomId]);

  // Update messages when received from socket
  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages((prev) => [...prev, ...messages]);
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (content: string) => {
    if (!session?.user) return;
    
    try {
      // Send message to API
      const response = await fetch(`/api/chat-rooms/${chatRoomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Send message through socket
      sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-xl font-medium mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/chat')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Chat Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!chatRoom) {
    return null;
  }

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">{chatRoom.name}</h1>
          <p className="text-sm text-gray-500">
            {chatRoom.description || 'No description provided'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Users size={20} />
            <span className="text-sm">{chatRoom._count?.members || 0}</span>
          </motion.button>
          {chatRoom.ownerId === session?.user?.id && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/chat/${chatRoomId}/settings`)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Settings size={20} />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.userId === session?.user?.id}
            />
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </>
  );
}