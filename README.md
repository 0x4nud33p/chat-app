# 💬 Real-Time Chat Application

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
- **File Sharing** - Upload and share files seamlessly
- **Message History** - Persistent message storage

### 🎥 Communication
- **Video Calling** - Built-in video call functionality
- **Real-time Presence** - See who's online
- **Typing Indicators** - Live typing status

### 🎨 User Experience
- **Modern UI** - Clean, responsive design built with Tailwind CSS
- **Dark/Light Theme** - Customizable theme preferences
- **Profile Management** - User profile customization
- **Contact Management** - Add and manage contacts

### 🔧 Technical Features
- **Real-time Updates** - Socket.io powered real-time communication
- **State Management** - Redux Toolkit for efficient state handling
- **File Upload** - Secure file upload and storage
- **Responsive Design** - Mobile-first responsive interface

## 🏗️ Architecture

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── store/          # Redux store configuration
│   │   ├── context/        # React context providers
│   │   └── lib/            # Utility libraries
└── server/                 # Node.js backend application
    ├── controllers/        # Route controllers
    ├── models/             # Database models
    ├── routes/             # API route definitions
    ├── middlewares/        # Custom middleware
    └── uploads/            # File upload storage
```

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

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8747`

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup    # User registration
POST /api/auth/login     # User login
POST /api/auth/logout    # User logout
GET  /api/auth/user-info # Get current user info
```

### Contact Management
```
POST /api/contacts/search       # Search for contacts
GET  /api/contacts/get-contacts-for-dm  # Get DM contacts
GET  /api/contacts/get-all-contacts     # Get all contacts
```

### Messaging
```
GET  /api/messages/get-messages     # Retrieve messages
POST /api/messages/upload-file      # Upload file
```

### Channels
```
POST /api/channel/create-channel    # Create new channel
GET  /api/channel/get-user-channels # Get user's channels
GET  /api/channel/get-channel-messages # Get channel messages
```

## 🎯 Usage Guide

### Getting Started
1. **Sign Up** - Create a new account or log in with existing credentials
2. **Complete Profile** - Set up your profile with avatar and personal details
3. **Add Contacts** - Search and add contacts to start conversations
4. **Start Chatting** - Begin direct messages or create group channels

### Creating Channels
1. Navigate to the contacts panel
2. Click "Create Channel"
3. Add channel name and select members
4. Start group conversations

### File Sharing
- Click the attachment icon in the message bar
- Select files to upload (supports various formats)
- Files are stored securely and shared instantly

### Video Calling
- Click the video call button in any conversation
- Enjoy high-quality video communication
- Built-in call controls and interface

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

## 🏗️ Building for Production

### Client Build
```bash
cd client
npm run build
```

### Server Deployment
The server includes Vercel configuration for easy deployment:
```bash
# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow existing code conventions
- Use meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.io](https://socket.io/) for real-time communication
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. **Check existing issues** in the GitHub repository
2. **Create a new issue** with detailed description
3. **Join our community** for discussions and support

## 🗺️ Roadmap

- [ ] **Push Notifications** - Browser and mobile notifications
- [ ] **Message Reactions** - Emoji reactions to messages
- [ ] **Message Threading** - Reply to specific messages
- [ ] **Advanced File Sharing** - Drag and drop, preview support
- [ ] **Voice Messages** - Audio message recording and playback
- [ ] **Screen Sharing** - Share screen during video calls
- [ ] **Mobile App** - React Native mobile application
- [ ] **Message Encryption** - End-to-end encryption
- [ ] **Advanced Admin Panel** - Channel moderation tools
- [ ] **Bot Integration** - Chatbot support and webhooks

---

<div align="center">

**Built with ❤️ by [0x4nud33p](https://github.com/0x4nud33p)**

⭐ **Star this repository if you found it helpful!**

</div>