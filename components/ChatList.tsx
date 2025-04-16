'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { SafeChatRoom } from '@/types';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState<SafeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch('/api/chat-rooms');
        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChatRoom = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/chat-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      const newChatRoom = await response.json();
      setChatRooms(prev => [...prev, newChatRoom]);
      setShowNewChatModal(false);
      
      // Navigate to the new chat room
      router.push(`/chat/${newChatRoom.id}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewChatModal(true)}
            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
            aria-label="New chat"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredChatRooms.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredChatRooms.map((room) => (
              <motion.li
                key={room.id}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                onClick={() => router.push(`/chat/${room.id}`)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {room.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {room.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {room.description || `${room._count.members} members`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                      {room._count.messages}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
            <p>No chat rooms found</p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create a new chat
            </button>
          </div>
        )}
      </div>
      
      {/* Current user info */}
      {session?.user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar
              src={session.user.image}
              name={session.user.name}
              isOnline={true}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreate={handleCreateChatRoom}
        />
      )}
    </div>
  );
}