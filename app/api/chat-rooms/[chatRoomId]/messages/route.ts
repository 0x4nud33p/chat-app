import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
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
    const { content } = body;
    
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }
    
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId
      },
      include: {
        members: true
      }
    });
    
    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 });
    }
    
    const isMember = chatRoom.members.some(member => member.id === session.user.id);
    
    if (!isMember) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const message = await prisma.message.create({
      data: {
        content,
        user: {
          connect: {
            id: session.user.id
          }
        },
        chatRoom: {
          connect: {
            id: chatRoomId
          }
        }
      },
      include: {
        user: true
      }
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}