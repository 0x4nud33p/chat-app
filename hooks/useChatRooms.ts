import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SafeChatRoom } from '@/types';
import { useAuth } from './useAuth';

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<SafeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

  const fetchChatRooms = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chat-rooms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }
      console.log("response while fetching chata",response);
      const data = await response.json();
      setChatRooms(data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setError('Failed to load chat rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user]);

  const createChatRoom = async (formData: { name: string; description?: string; isPrivate?: boolean }) => {
    if (!session?.user) return null;
    
    try {
      const response = await fetch('/api/chat-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat room');
      }
      
      const newChatRoom = await response.json();
      setChatRooms(prev => [...prev, newChatRoom]);
      
      return newChatRoom;
    } catch (error) {
      console.error('Error creating chat room:', error);
      return null;
    }
  };

  return {
    chatRooms,
    isLoading,
    error,
    refreshChatRooms: fetchChatRooms,
    createChatRoom,
  };
};