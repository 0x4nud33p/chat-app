"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  MessageSquare,
  Settings,
  Users,
  Clock,
  Edit,
} from "lucide-react";
import { SafeUser, SafeChatRoom, SafeMessage } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

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

        // Check if this is the current user's profile
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="text-blue-500 flex items-center gap-2"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-4">User not found</div>
        <Link href="/chat" className="text-blue-500">
          Back to chats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header / Cover */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          {/* Profile Avatar */}
          <div className="absolute -bottom-16 left-8">
            <Avatar
              src={user?.image || undefined}
              fallback={user?.name?.charAt(0) || "?"}
              size="xl"
              className="border-4 border-white"
            />
          </div>

          {/* Edit Profile Button (only shown if it's the user's own profile) */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Link
                href="/settings"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <Edit size={16} />
                Edit Profile
              </Link>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.email && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
              )}
              {user.createdAt && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Calendar size={16} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>

            {!isOwnProfile && (
              <div className="mt-4 md:mt-0">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                  Send Message
                </button>
              </div>
            )}
          </div>

          {user.bio && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{user?.bio || "bio"}</p>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "messages"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recent Messages
              </button>
              <button
                onClick={() => setActiveTab("rooms")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "rooms"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <MessageSquare className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">
                        {recentMessages.length}
                      </p>
                      <p className="text-gray-500 text-sm">Messages</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <Users className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">{recentRooms.length}</p>
                      <p className="text-gray-500 text-sm">Rooms</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentMessages.slice(0, 3).map((   message) => (
                      <div
                        key={message.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <Clock className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">
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

              {/* Quick Links */}
              {isOwnProfile && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow transition"
                    >
                      <Settings className="w-5 h-5 text-blue-500" />
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow transition"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span>My Chats</span>
                    </Link>
                    <Link
                      href="/chat-rooms"
                      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow transition"
                    >
                      <Users className="w-5 h-5 text-blue-500" />
                      <span>Browse Rooms</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">
                        In{" "}
                        <Link
                          href={`/chat/${message.chatRoomId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {message.chatRoom?.name || "Unknown Room"}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))}

                {recentMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "rooms" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Chat Rooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/chat/${room.id}`}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={room.imageUrl || undefined}
                        fallback={room.name?.charAt(0) || "?"}
                        size="md"
                      />
                      <div>
                        <h4 className="font-medium">{room.name}</h4>
                        {room.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {room.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {room.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}

                {recentRooms.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No chat rooms yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
