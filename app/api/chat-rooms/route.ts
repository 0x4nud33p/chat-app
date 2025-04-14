import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { members: { some: { id: session.user.id } } },
          { ownerId: session.user.id }
        ]
      },
      include: {
        owner: true,
        members: true,
        _count: {
          select: {
            messages: true,
            members: true
          }
        }
      }
    });
    
    return NextResponse.json(chatRooms);
  } catch (error) {
    console.log("[CHAT_ROOMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    const { name, description, isPrivate } = body;
    
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        description,
        isPrivate: isPrivate || false,
        owner: {
          connect: {
            id: session.user.id
          }
        },
        members: {
          connect: {
            id: session.user.id
          }
        }
      }
    });
    
    return NextResponse.json(chatRoom);
  } catch (error) {
    console.log("[CHAT_ROOMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}