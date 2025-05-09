import { NextRequest, NextResponse } from 'next/server';
import getUserSession from '@/utils/getUserData';
import prisma from '@/prisma/index';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
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

    const recentRooms = chatRoomMembers.map(member => {
      return {
        id: member.id,
        name: member.name,
        imageUrl: member.members[0]?.image || null,
        description: member.description,
        members: member.members,
      };
    });
    
    const session = await getUserSession();
    const isOwnProfile = session?.user?.id === userId;
    
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const session = await getUserSession();
    
    if (!session || session.user?.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, bio, image } = body;
    
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
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name || undefined,
        image: image || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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