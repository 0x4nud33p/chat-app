'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

type CreateChatRoomProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateChatRoom({ isOpen, onClose }: CreateChatRoomProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      toast.error('Please enter a chat room name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          isPrivate,
        }),
      });
      
      if (!response.ok) {
        toast('Room already exits try to join the room');
        return;
      }
      
      const data = await response.json();
      toast.success('Chat room created successfully!');
      
      // Reset form and close modal
      setName('');
      setDescription('');
      setIsPrivate(false);
      onClose();
      
      router.push(`/chat/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error('Failed to create chat room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Create New Chat Room</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Room Name *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter room name"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description (optional)
            </label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter room description"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPrivate"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm">
              Make this room private
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3 text-black">
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-500 hover:cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer">
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}