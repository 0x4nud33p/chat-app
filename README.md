# Real-Time Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/socket.io-%5E4.0.0-black)](https://socket.io/)

A modern, feature-rich real-time chat application built with React, Node.js, and Socket.io. Experience seamless communication with support for direct messages, group channels, file sharing, and video calling.

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication** - JWT-based authentication system
- **Protected Routes** - Middleware-protected API endpoints
- **Session Management** - Persistent user sessions

### 💬 Messaging
- **Real-time Messaging** - Instant message delivery via WebSockets
- **Direct Messages** - Private one-on-one conversations
- **Group Channels** - Create and manage group conversations
- **Message History** - Persistent message storage

### 🎨 User Experience
- **Modern UI** - Clean, responsive design built with Tailwind CSS
- **Profile Management** - User profile customization
- **Contact Management** - Add and manage contacts

### 🔧 Technical Features
- **Real-time Updates** - Socket.io powered real-time communication
- **State Management** - Redux Toolkit for efficient state handling
- **Responsive Design** - Mobile-first responsive interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0x4nud33p/chat-app.git
   cd chat-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

Create `.env` files in both client and server directories:

**Server (.env)**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/chatapp
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key

# Server Configuration
PORT=8747
NODE_ENV=development

# CORS Origin
ORIGIN=http://localhost:5173
```

**Client (.env)**
```env
# API Configuration
VITE_SERVER_URL=http://localhost:8747
VITE_API_URL=http://localhost:8747/api
```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm start
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
---

<div align="center">

**Built with ❤️ by [0x4nud33p](https://github.com/0x4nud33p)**

⭐ **Star this repository if you found it helpful!**

</div>
