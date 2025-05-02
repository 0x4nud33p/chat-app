import { User, ChatRoom, Message } from "@prisma/client";

export type SafeUser = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeChatRoom = Omit<ChatRoom, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  owner: SafeUser;
  members: SafeUser[];
  _count: {
    messages: number;
    members: number;
  };
};

export type SafeMessage = Omit<Message, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: SafeUser;
};

export type UserStatus = {
  userId: string;
  status: boolean;
};

