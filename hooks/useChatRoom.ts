import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SafeChatRoom } from '@/types';
import { useAuth } from './useAuth';

export const useChatRoom = (chatRoomId: string) => {
  const [chatRoom, setChatRoom] = useState<SafeChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!chatRoomId || !user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/chat-rooms/${chatRoomId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch chat room: ${response.status}`);
        }
        
        const data = await response.json();
        setChatRoom(data);
      } catch (error) {
        console.error('Error fetching chat room:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch chat room');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoom();
  }, [chatRoomId, user?.id]);

  const refreshChatRoom = async () => {
    if (!chatRoomId || !user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat-rooms/${chatRoomId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to refresh chat room: ${response.status}`);
      }
      
      const data = await response.json();
      setChatRoom(data);
    } catch (error) {
      console.error('Error refreshing chat room:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh chat room');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chatRoom,
    isLoading,
    error,
    refreshChatRoom
  };
};