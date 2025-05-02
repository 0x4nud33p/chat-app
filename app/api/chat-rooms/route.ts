import { NextResponse } from "next/server";
import getUserSession from "@/utils/getUserData";
import prisma from "@/prisma/index";

export async function GET() {
  try {
    const session = await getUserSession();
    
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
        messages: true,
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
    const session = await getUserSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description, isPrivate } = await request.json();

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }

    const existingChatRoom = await prisma.chatRoom.findFirst({
      where: {
        name,
        ownerId: session.user.id,
      },
    });

    if (existingChatRoom) {
      return new NextResponse("Chat Room Already Exists", { status: 403 });
    }

    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        description: description || "",
        isPrivate: isPrivate ?? false,
        ownerId: session.user.id,
        members: {
          connect: [{ id: session.user.id }],
        },
      },
    });

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error("[CHAT_ROOMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}