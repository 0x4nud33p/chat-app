import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { SafeMessage } from '@/types';

type UseSocketProps = {
  chatRoomId?: string;
};

export const useSocket = ({ chatRoomId }: UseSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SafeMessage[]>([]);
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
    
    return () => {
      // Leave the room when component unmounts or chatRoomId changes
      socket.emit('leave-room', chatRoomId);
      socket.off('new-message');
    };
  }, [chatRoomId]);

  // Function to send message
  const sendMessage = (content: string) => {
    if (!socketRef.current || !chatRoomId || !session?.user) return;
    
    const messageData = {
      content,
      chatRoomId,
      userId: session.user.id,
      user: session.user,
      createdAt: new Date().toISOString(),
    };
    
    socketRef.current.emit('send-message', messageData);
  };

  return {
    isConnected,
    messages,
    sendMessage,
    socket: socketRef.current,
  };
};