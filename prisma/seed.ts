// import { PrismaClient } from '@/app/generated/client/deno/edge.ts'
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient()

async function main() {
  console.log("Running seed script...");
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashedpassword1',
      image: 'https://i.pravatar.cc/150?u=alice',
      onlineStatus: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'hashedpassword2',
      image: 'https://i.pravatar.cc/150?u=bob',
      onlineStatus: false,
    },
  });

  const chatRoom = await prisma.chatRoom.create({
    data: {
      name: 'General Chat',
      description: 'A place to hang out',
      isPrivate: false,
      ownerId: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      {
        content: 'Hey Bob! Welcome to the chat.',
        userId: user1.id,
        chatRoomId: chatRoom.id,
        isRead: true,
      },
      {
        content: 'Thanks Alice! Glad to be here.',
        userId: user2.id,
        chatRoomId: chatRoom.id,
        isRead: false,
      },
    ],
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
