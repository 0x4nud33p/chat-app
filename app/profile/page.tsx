"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Mail,
  Calendar,
  MessageSquare,
  Users,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { SafeUser, SafeChatRoom, SafeMessage } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: session } = useAuth();
  const userId = session?.id || null;

  const [user, setUser] = useState<SafeUser | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [recentRooms, setRecentRooms] = useState<SafeChatRoom[]>([]);
  const [recentMessages, setRecentMessages] = useState<SafeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "messages" | "rooms">(
    "overview"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data.user);
        setRecentRooms(data.recentRooms || []);
        setRecentMessages(data.recentMessages || []);

        if (session?.id === userId) {
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, session]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="text-indigo-500 flex items-center gap-2"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
        <div className="text-gray-400 mb-4">User not found</div>
        <Link href="/chat" className="text-indigo-500">
          Back to chats
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white/5 backdrop-blur-md rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar
                src={user?.image || null}
                fallback={user?.name?.charAt(0) || "?"}
                size="xl"
                className="border-4 border-white"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.email && (
                  <div className="flex items-center gap-2 text-gray-300 mt-1">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-2 text-gray-300 mt-1">
                    <Calendar size={16} />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>

              {!isOwnProfile && (
                <div className="mt-4 md:mt-0">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">
                    Send Message
                  </button>
                </div>
              )}
            </div>

            {user.bio && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-300">{user?.bio || "bio"}</p>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-gray-700 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "messages"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  Recent Messages
                </button>
                <button
                  onClick={() => setActiveTab("rooms")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "rooms"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  Chat Rooms
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Stats */}
                  <div className="bg-white/10 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg shadow-sm">
                        <MessageSquare className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
                        <p className="text-2xl font-bold">
                          {recentMessages.length}
                        </p>
                        <p className="text-gray-400 text-sm">Messages</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg shadow-sm">
                        <Users className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
                        <p className="text-2xl font-bold">
                          {recentRooms.length}
                        </p>
                        <p className="text-gray-400 text-sm">Rooms</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/10 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentMessages.slice(0, 3).map((message) => (
                        <div
                          key={message.id}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg shadow-sm"
                        >
                          <Clock className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-300">
                              Posted in{" "}
                              <span className="font-medium">
                                {message.chatRoom?.name || "Unknown Room"}
                              </span>
                            </p>
                            <p className="text-sm mt-1 line-clamp-2">
                              {message.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {recentMessages.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-white/5 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-gray-300">
                        From{" "}
                        <span className="font-semibold">
                          {msg.sender?.name || "Unknown"}
                        </span>{" "}
                        in{" "}
                        <span className="text-indigo-400">
                          {msg.chatRoom?.name || "Room"}
                        </span>
                      </p>
                      <p className="mt-2 text-white">{msg.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  ))}

                  {recentMessages.length === 0 && (
                    <p className="text-gray-500">No messages found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Chat Rooms</h3>
                <div className="space-y-4">
                  {recentRooms.map((room) => (
                    <Link
                      href={`/chat/room/${room.id}`}
                      key={room.id}
                      className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold">
                            {room.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Created {formatDate(room.createdAt)}
                          </p>
                        </div>
                        <Users className="w-5 h-5 text-indigo-400" />
                      </div>
                    </Link>
                  ))}

                  {recentRooms.length === 0 && (
                    <p className="text-gray-500">No rooms found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

 
