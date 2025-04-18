# Project Folder Structure

chat-app/
├── .env
├── .gitignore
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── assets/
│       └── images/
│           └── default-avatar.png
├── server.js
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── chat-rooms/
│   │   │   ├── route.ts
│   │   │   ├── [chatRoomId]/
│   │   │   │   ├── route.ts
│   │   │   │   ├── members/
│   │   │   │   │   └── route.ts
│   │   │   │   └── messages/
│   │   │   │       └── route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── [userId]/
│   │           └── route.ts
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── chat/
│   │   ├── page.tsx
│   │   └── [chatRoomId]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatInput.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatRoom.tsx
│   │   ├── CreateChatRoom.tsx
│   │   └── MessageList.tsx
│   ├── layouts/
│   │   ├── ChatLayout.tsx
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       ├── Modal.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useChatRoom.ts
│   ├── useChatRooms.ts
│   └── useSocket.ts
├── lib/
│   ├── prisma.ts
│   ├── socket.ts
│   └── utils.ts
├── providers/
│   ├── SessionProvider.tsx
│   └── ThemeProvider.tsx
├── types/
│   ├── index.ts
│   └── next-auth.d.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.js
└── tsconfig.json