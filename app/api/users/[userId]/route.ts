// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import getUserSession from '@/utils/getUserData';
import prisma from '@/prisma/index';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // bio: true,
        createdAt: true,
        updatedAt: true,
        // Don't select sensitive fields like password hash, etc.
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get recent messages (limited to 10)
    const recentMessages = await prisma.message.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        chatRoom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    // Get chat rooms the user is a member of 
    const chatRoomMembers = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            id: userId
          },
        },
      },
      include: {
        members: true,
      },
    });

        
    // Transform the data to get the chat rooms
    const recentRooms = chatRoomMembers.map(member => {
      return {
        id: member.id,
        name: member.name,
        imageUrl: member.image,
        description: member.description,
        members: member.members,
      };
    });
    
    // Get session to determine if the request is for the current user's profile
    const session = await getUserSession();
    const isOwnProfile = session?.user?.id === userId;
    
    // Return the user data with recent messages and rooms
    return NextResponse.json({
      user,
      recentMessages,
      recentRooms,
      isOwnProfile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// API to update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const session = await getUserSession();
    
    // Check if user is authenticated and is updating their own profile
    if (!session || session.user?.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    const { name, bio, image } = body;
    
    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name format' },
        { status: 400 }
      );
    }
    
    if (bio && typeof bio !== 'string') {
      return NextResponse.json(
        { error: 'Invalid bio format' },
        { status: 400 }
      );
    }
    
    if (image && typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }
    
    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name || undefined,
        // bio: bio || undefined,
        image: image || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

// API to delete user account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const session = await getUserSession();
    
    // Check if user is authenticated and is deleting their own account
    if (!session || session.user?.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // You might want to implement additional confirmations or checks here
    // For example, requiring a password confirmation or a confirmation token
    
    // First, delete related data (messages, chat room memberships, etc.)
    // This depends on your database cascade settings and business logic
    
    // Delete chat room memberships
    await prisma.chatRoomMember.deleteMany({
      where: {
        userId: userId,
      },
    });
    
    // Delete user's messages
    await prisma.message.deleteMany({
      where: {
        userId: userId,
      },
    });
    
    // Finally, delete the user account
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    
    return NextResponse.json({
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete user account' },
      { status: 500 }
    );
  }
}