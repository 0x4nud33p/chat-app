#Project Folder Structure

chat-app/
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script for initial data
├── public/
│   └── assets/
│       └── images/
│           └── default-avatar.png
├── server.js                    # Custom server with Socket.io
├── app/                         # App Router
│   ├── api/                     # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts     # NextAuth API route
│   │   ├── chat-rooms/
│   │   │   ├── route.ts         # Chat rooms API routes
│   │   │   ├── [chatRoomId]/
│   │   │   │   ├── route.ts     # Single chat room API routes
│   │   │   │   ├── members/
│   │   │   │   │   └── route.ts # Chat room members API routes
│   │   │   │   └── messages/
│   │   │   │       └── route.ts # Messages API routes
│   │   └── users/
│   │       ├── route.ts         # Users API routes
│   │       └── [userId]/
│   │           └── route.ts     # Single user API routes
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx         # Sign-in page
│   │   └── signup/
│   │       └── page.tsx         # Sign-up page
│   ├── chat/
│   │   ├── page.tsx             # Chat home page
│   │   └── [chatRoomId]/
│   │       └── page.tsx         # Single chat room page
│   ├── profile/
│   │   └── page.tsx             # User profile page
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # Reusable components
│   ├── chat/
│   │   ├── ChatInput.tsx        # Message input component
│   │   ├── ChatList.tsx         # List of chat rooms
│   │   ├── ChatMessage.tsx      # Individual message component
│   │   ├── ChatRoom.tsx         # Chat room component
│   │   ├── CreateChatRoom.tsx   # Form to create a new chat room
│   │   └── MessageList.tsx      # List of messages
│   ├── layouts/
│   │   ├── ChatLayout.tsx       # Layout for chat pages
│   │   ├── MainLayout.tsx       # Main application layout
│   │   └── Sidebar.tsx          # Sidebar component
│   └── ui/
│       ├── Avatar.tsx           # User avatar component
│       ├── Button.tsx           # Button component
│       ├── Input.tsx            # Input component
│       ├── Loading.tsx          # Loading spinner component
│       ├── Modal.tsx            # Modal component
│       └── ThemeToggle.tsx      # Theme toggle component
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useChatRoom.ts           # Chat room data hook
│   ├── useChatRooms.ts          # Multiple chat rooms hook
│   └── useSocket.ts             # Socket.io hook
├── lib/                         # Utility functions and libraries
│   ├── prisma.ts                # Prisma client
│   ├── socket.ts                # Socket.io client setup
│   └── utils.ts                 # Utility functions
├── providers/                   # React context providers
│   ├── SessionProvider.tsx      # NextAuth session provider
│   └── ThemeProvider.tsx        # Theme provider
├── types/                       # TypeScript type definitions
│   ├── index.ts                 # Shared types
│   └── next-auth.d.ts           # NextAuth type extensions
├── middleware.ts                # Next.js middleware for auth protection
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration