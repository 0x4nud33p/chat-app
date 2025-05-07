# 💬 0x4nud33p Chat App

Welcome to **0x4nud33p Chat App** – a full-stack, real-time chat application built with **Next.js**, **Tailwind CSS**, **Prisma**, **PostgreSQL**, and **Socket.IO**.

> 🌐 GitHub: [github.com/0x4nud33p/chat-app](https://github.com/0x4nud33p/chat-app)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Next API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Google OAuth)
- **WebSockets**: Socket.IO
- **Other**: TypeScript, ESLint, Prettier

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/0x4nud33p/chat-app.git
cd chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root directory and paste this:

```env
DATABASE_URL="YOUR_DATABASE_URL"
NODE_ENV="production"

GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="YOUR_AUTH_SECRET"

NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 4. Setup the database

Make sure PostgreSQL is running locally. Then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

> To view the DB in GUI:  
> `npx prisma studio`

---

## 🚀 Run the App

```bash
npm run dev
```

App will be live at: [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
0x4nud33p-chat-app/
├── app/
│   ├── api/
│   ├── auth/
│   ├── chat/
│   └── profile/
├── components/
│   ├── chat/
│   ├── layouts/
│   └── ui/
├── hooks/
├── lib/
├── prisma/
├── providers/
├── public/
├── svgs/
├── types/
├── utils/
├── .env
├── middleware.ts
├── next.config.ts
├── server.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Scripts

```bash
npm run dev        # Run the app in development
npm run build      # Build the app
npm run start      # Start production server
```

---

## 🤝 Contribution

1. Fork the repo
2. Create a new branch (`git checkout -b feature-x`)
3. Commit changes (`git commit -am 'Add feature x'`)
4. Push and create a PR

---

## 🛡 License

MIT © [0x4nud33p](https://github.com/0x4nud33p)
