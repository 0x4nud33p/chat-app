'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import ChatInput from '@/components/chat/ChatInput';
import MessageList from '@/components/chat/MessageList';
import { useSocket } from '@/hooks/useSocket';
import { useChatRoom } from '@/hooks/useChatRoom';
import { SafeMessage, SafeUser } from '@/types';

export default function ChatRoomPage() {
  const { chatRoomId } = useParams();
  const { data: session } = useSession();
  const { chatRoom, isLoading, error } = useChatRoom(chatRoomId as string);
  const { isConnected, messages: socketMessages, sendMessage, socket } = useSocket({ chatRoomId: chatRoomId as string });
  const [messages, setMessages] = useState<SafeMessage[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combine initial messages from API with real-time messages from socket
  useEffect(() => {
    if (chatRoom?.messages) {
      const combinedMessages = [...chatRoom.messages];
      
      // Add any socket messages that aren't already in the list
      socketMessages.forEach(socketMsg => {
        if (!combinedMessages.some(msg => msg.id === socketMsg.id)) {
          combinedMessages.push(socketMsg);
        }
      });
      
      // Sort by timestamp
      combinedMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setMessages(combinedMessages);
    }
  }, [chatRoom?.messages, socketMessages]);

  // Listen for online status updates
  useEffect(() => {
    if (!socket) return;
    
    const handleUserStatusChange = (data: { userId: string; status: boolean }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: data.status
      }));
    };
    
    socket.on('user-status-change', handleUserStatusChange);
    
    return () => {
      socket.off('user-status-change', handleUserStatusChange);
    };
  }, [socket]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string) => {
    if (content.trim() && session?.user) {
      // In a real app, you'd save to the database first
      sendMessage(content);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" />
      </div>
    );
  }
  
  if (error || !chatRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl text-red-500 mb-4">Failed to load chat room</h3>
        <Button as={Link} href="/chat">
          Return to Chat Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat room header */}
      <header className="px-4 py-3 bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/chat" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="font-semibold text-lg">{chatRoom.name}</h2>
          {chatRoom.isPrivate && (
            <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
              Private
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMembers(!showMembers)}
            aria-label="Show members"
          >
            <Users size={20} />
          </Button>
          {session?.user?.id === chatRoom.ownerId && (
            <Button 
              variant="ghost" 
              size="icon"
              as={Link}
              href={`/chat/${chatRoomId}/settings`}
              aria-label="Chat room settings"
            >
              <Settings size={20} />
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList 
            messages={messages} 
            currentUser={session?.user}
          />
          <div ref={messagesEndRef} />
        </div>
        
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto"
            >
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Members ({chatRoom.members.length})
                </h3>
                <ul className="space-y-3">
                  {chatRoom.members.map((member: SafeUser) => (
                    <li key={member.id} className="flex items-center space-x-3">
                      <Avatar 
                        src={member.image} 
                        name={member.name} 
                        isOnline={onlineUsers[member.id] || false}
                      />
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.id === chatRoom.ownerId ? 'Owner' : 'Member'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <ChatInput onSendMessage={handleSend} isLoading={!isConnected} />
      </div>
    </div>
  );
}