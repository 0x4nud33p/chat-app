// hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { SafeMessage, UserStatus, TypingIndicator } from '@/types';

type UseSocketProps = {
  chatRoomId?: string;
};

export const useSocket = ({ chatRoomId }: UseSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SafeMessage[]>([]);
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
    socketRef.current = socket;

    // Event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      
      // Set user as online
      if (session?.user?.id) {
        socket.emit('user-online', session.user.id);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for user status changes
    socket.on('user-status-change', ({ userId, status }: UserStatus) => {
      setUserStatuses(prev => ({
        ...prev,
        [userId]: status
      }));
    });

    return () => {
      // Set user as offline before disconnecting
      if (session?.user?.id) {
        socket.emit('user-offline', session.user.id);
      }
      socket.disconnect();
    };
  }, [session]);

  // Join chat room when chatRoomId changes
  useEffect(() => {
    const socket = socketRef.current;
    
    if (!socket || !chatRoomId) return;
    
    // Join the room
    socket.emit('join-room', chatRoomId);
    
    // Listen for new messages
    socket.on('new-message', (newMessage: SafeMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    // Listen for typing indicators
    socket.on('user-typing', ({ userId }: TypingIndicator) => {
      if (userId !== session?.user?.id) {
        setTypingUsers(prev => [...prev.filter(id => id !== userId), userId]);
      }
    });

    socket.on('user-stop-typing', ({ userId }: TypingIndicator) => {
      setTypingUsers(prev => prev.filter(id => id !== userId));
    });
    
    return () => {
      // Leave the room when component unmounts or chatRoomId changes
      socket.emit('leave-room', chatRoomId);
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [chatRoomId, session]);

  // Function to send message
  const sendMessage = async (content: string) => {
    if (!socketRef.current || !chatRoomId || !session?.user) return;
    
    try {
      // Save message to database
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
      
      const message = await response.json();
      
      // Emit message to socket
      socketRef.current.emit('send-message', message);
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  // Function to indicate typing
  const sendTypingIndicator = () => {
    if (!socketRef.current || !chatRoomId || !session?.user?.id) return;
    socketRef.current.emit('typing', { userId: session.user.id, chatRoomId });
  };

  // Function to stop typing indication
  const sendStopTypingIndicator = () => {
    if (!socketRef.current || !chatRoomId || !session?.user?.id) return;
    socketRef.current.emit('stop-typing', { userId: session.user.id, chatRoomId });
  };

  return {
    isConnected,
    messages,
    setMessages,
    sendMessage,
    userStatuses,
    typingUsers,
    sendTypingIndicator,
    sendStopTypingIndicator,
    socket: socketRef.current,
  };
};