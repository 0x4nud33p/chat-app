import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { chatRoomId: string } }
) {
  try {
    const { chatRoomId } = params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId
      },
      include: {
        owner: true,
        members: true,
        messages: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 });
    }
    
    // Check if user is a member or owner
    const isMember = chatRoom.members.some(member => member.id === session.user.id);
    const isOwner = chatRoom.owner.id === session.user.id;
    
    if (!isMember && !isOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    return NextResponse.json(chatRoom);
  } catch (error) {
    console.log("[CHAT_ROOM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { chatRoomId: string } }
) {
  try {
    const { chatRoomId } = params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    const { name, description, isPrivate } = body;
    
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId
      },
      include: {
        owner: true
      }
    });
    
    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 });
    }
    
    // Check if user is the owner
    if (chatRoom.owner.id !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const updatedChatRoom = await prisma.chatRoom.update({
      where: {
        id: chatRoomId
      },
      data: {
        name: name || chatRoom.name,
        description: description !== undefined ? description : chatRoom.description,
        isPrivate: isPrivate !== undefined ? isPrivate : chatRoom.isPrivate
      }
    });
    
    return NextResponse.json(updatedChatRoom);
  } catch (error) {
    console.log("[CHAT_ROOM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { chatRoomId: string } }
) {
  try {
    const { chatRoomId } = params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId
      },
      include: {
        owner: true
      }
    });
    
    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 });
    }
    
    // Check if user is the owner
    if (chatRoom.owner.id !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    await prisma.message.deleteMany({
      where: {
        chatRoomId
      }
    });
    
    await prisma.chatRoom.delete({
      where: {
        id: chatRoomId
      }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[CHAT_ROOM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}