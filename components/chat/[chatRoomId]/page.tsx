'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, Info, MoreVertical, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { SafeChatRoom, SafeMessage, SafeUser } from '@/types';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

export default function ChatRoomPage() {
  const params = useParams();
  const chatRoomId = params.chatRoomId as string;
  const { data: session } = useSession();
  const [chatRoom, setChatRoom] = useState<SafeChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<SafeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  
  const { isConnected, messages, sendMessage } = useSocket({
    chatRoomId,
  });

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const response = await fetch(`/api/chat-rooms/${chatRoomId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat room');
        }
        
        const data = await response.json();
        setChatRoom(data);
        setChatMessages(data.messages);
      } catch (error) {
        console.error('Error fetching chat room:', error);
        setError('Failed to load chat room');
      } finally {
        setIsLoading(false);
      }
    };

    if (chatRoomId) {
      fetchChatRoom();
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages(prev => [...prev, ...messages]);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chatRoomId || !session?.user) return;
    
    try {
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
      
      // socket io 
      const newMessage = await response.json();
      sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/chat" className="text-blue-500 flex items-center gap-2">
          <ChevronLeft size={16} />
          Back to chats
        </Link>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-4">Chat room not found</div>
        <Link href="/chat" className="text-blue-500 flex items-center gap-2">
          <ChevronLeft size={16} />
          Back to chats
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Avatar 
              src={chatRoom.imageUrl} 
              fallback={chatRoom.name?.charAt(0) || '?'} 
              size="md"
            />
            <div>
              <h1 className="font-semibold">{chatRoom.name}</h1>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowMembers(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <Users size={20} />
            {chatRoom.members && chatRoom.members.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chatRoom.members.length}
              </span>
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Info size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList 
              messages={chatMessages}
              currentUser={session?.user as SafeUser}
            />
          </div>
          <div className="p-4 border-t">
            <MessageInput onSendMessage={handleSendMessage} isConnected={isConnected} />
          </div>
        </div>

        {showMembers && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="w-64 border-l bg-gray-50 overflow-y-auto"
          >
            <div className="p-4 border-b">
              <h2 className="font-semibold">Members ({chatRoom.members?.length || 0})</h2>
            </div>
            <div className="p-2">
              {chatRoom.members?.map((member: SafeUser) => (
                <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                  <Avatar 
                    src={member.image || undefined} 
                    fallback={member.name?.charAt(0) || '?'} 
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}