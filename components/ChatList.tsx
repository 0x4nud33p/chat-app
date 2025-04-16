'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Hash } from 'lucide-react';
import { SafeChatRoom } from '@/types';
import { useSocket } from '@/hooks/useSocket';

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState<SafeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const router = useRouter();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch('/api/chat-rooms');
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat rooms');
        }
        
        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        setError('Failed to load chat rooms');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new chat room creation
    socket.on('chat-room-created', (newChatRoom: SafeChatRoom) => {
      setChatRooms(prev => [...prev, newChatRoom]);
    });

    // Listen for chat room updates
    socket.on('chat-room-updated', (updatedChatRoom: SafeChatRoom) => {
      setChatRooms(prev => 
        prev.map(room => room.id === updatedChatRoom.id ? updatedChatRoom : room)
      );
    });

    // Listen for chat room deletion
    socket.on('chat-room-deleted', (chatRoomId: string) => {
      setChatRooms(prev => prev.filter(room => room.id !== chatRoomId));
    });

    return () => {
      socket.off('chat-room-created');
      socket.off('chat-room-updated');
      socket.off('chat-room-deleted');
    };
  }, [socket]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    router.push(`/chat/${roomId}`);
  };

  const handleCreateRoom = () => {
    router.push('/chat/new');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chatRooms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 p-4">
            No chat rooms found
          </p>
        ) : (
          chatRooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 mb-2 rounded-md cursor-pointer ${
                selectedRoom === room.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleRoomSelect(room.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-md bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white">
                    <Hash className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {room.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {room._count.messages} messages • {room._count.members} members
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t dark:border-gray-700">
        <button
          onClick={handleCreateRoom}
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Chat Room</span>
        </button>
      </div>
    </div>
  );
}
