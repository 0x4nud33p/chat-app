'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Hash, Settings, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { SafeChatRoom } from '@/types';
import Avatar from './ui/Avatar';
import { motion } from 'framer-motion';
import ThemeToggle from './ui/ThemeToggle';

export default function ChatSidebar() {
  const [chatRooms, setChatRooms] = useState<SafeChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch('/api/chat-rooms');
        if (response.ok) {
          const data = await response.json();
          setChatRooms(data);
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="h-full w-64 bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h1 className="font-semibold text-xl">Chat App</h1>
        <ThemeToggle />
      </div>

      {/* Chat Rooms */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="font-medium text-sm text-gray-500 dark:text-gray-400">CHAT ROOMS</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/chat/new')}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 h-10 w-full"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {chatRooms.map((room) => (
              <Link href={`/chat/${room.id}`} key={room.id}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Hash size={18} className="text-gray-500" />
                  <span className="truncate">{room.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{room._count.messages}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* User Section */}
      {session?.user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={session.user.image} name={session.user.name} isOnline={true} />
            <div className="truncate">
              <div className="font-medium text-sm">{session.user.name}</div>
              <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 15 }}
            onClick={() => signOut()}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      )}
    </div>
  );
}