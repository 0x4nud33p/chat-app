// components/layouts/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, Settings, LogOut, Search } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CreateChatRoom from '@/components/chat/CreateChatRoom';
import { useChatRooms } from '@/hooks/useChatRooms';
import { SafeChatRoom } from '@/types';

type SidebarProps = {
  onSelectChatRoom?: () => void;
};

export default function Sidebar({ onSelectChatRoom }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { chatRooms, isLoading, error } = useChatRooms();
  const [filteredRooms, setFilteredRooms] = useState<SafeChatRoom[]>([]);

  // Filter chat rooms based on search query
  useEffect(() => {
    if (!chatRooms) {
      setFilteredRooms([]);
      return;
    }

    const filtered = chatRooms.filter(room => 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredRooms(filtered);
  }, [searchQuery, chatRooms]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const handleRoomSelect = () => {
    if (onSelectChatRoom) {
      onSelectChatRoom();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">ChatApp</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">Failed to load chats</div>
        ) : filteredRooms.length > 0 ? (
          <div className="space-y-1 px-2">
            {filteredRooms.map((room) => (
              <Link 
                key={room.id} 
                href={`/chat/${room.id}`}
                onClick={handleRoomSelect}
              >
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                    ${pathname === `/chat/${room.id}` 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                >
                  <Avatar src={null} name={room.name} />
                  <div className="ml-3 overflow-hidden">
                    <p className="font-medium truncate">{room.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {room._count.messages} messages • {room._count.members} members
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No chat rooms found</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Chat Room
            </Button>
          </div>
        )}
      </div>

      {/* User profile */}
      {session?.user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar
                src={session.user.image || null}
                name={session.user.name || 'User'}
                isOnline={true}
              />
              <div className="ml-3 overflow-hidden">
                <p className="font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => router.push('/profile')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create chat room modal */}
      <CreateChatRoom 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}