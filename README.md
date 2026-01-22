# DoubtRoom - Real-Time Q&A Platform

## 🎯 Project Overview

**DoubtRoom** is a professional, production-ready MERN stack application for real-time doubt resolution. Unlike basic chat apps, this is a **structured Q&A platform** with topic-based rooms, upvoting, reputation system, and role-based access control.

### ✅ Interview-Ready Features

- **Authentication**: JWT-based auth with role management (Student/Mentor/Admin)
- **Real-Time**: Socket.IO for live questions, answers, and user presence
- **Database Design**: Properly normalized MongoDB schema with indexes
- **Security**: Rate limiting, input validation, password hashing
- **Professional UI**: Modern Tailwind CSS with glassmorphism and animations
- **Scalable Architecture**: Separation of concerns, middleware, error handling

---

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB + Socket.IO)

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── roomController.js     # Room CRUD operations
│   ├── questionController.js # Question management
│   └── answerController.js   # Answer & voting logic
├── middleware/
│   ├── auth.js              # JWT verification & authorization
│   └── rateLimiter.js       # Spam prevention
├── models/
│   ├── User.js              # User schema with roles
│   ├── Room.js              # Topic-based rooms
│   ├── Question.js          # Questions with resolution tracking
│   └── Answer.js            # Answers with upvoting
├── routes/
│   ├── authRoutes.js
│   ├── roomRoutes.js
│   ├── questionRoutes.js
│   └── answerRoutes.js
├── socket/
│   └── socketHandler.js     # Real-time event handlers
├── utils/
│   └── auth.js              # JWT helpers
├── .env
├── .env.example
├── package.json
└── server.js                # Main entry point
```

### Frontend (React + Vite + Tailwind CSS)

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/
│   │   ├── LandingPage.jsx  # Public homepage
│   │   ├── LoginPage.jsx    # Authentication
│   │   ├── RegisterPage.jsx
│   │   ├── Dashboard.jsx    # Room selection
│   │   ├── RoomPage.jsx     # Q&A interface
│   │   └── ProfilePage.jsx  # User stats
│   ├── utils/
│   │   ├── api.js           # Axios instance
│   │   └── socket.js        # Socket.IO client
│   ├── App.jsx              # Router setup
│   ├── main.jsx
│   └── index.css            # Tailwind + custom styles
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Configure Environment**

- Copy `.env.example` to `.env`
- Update MongoDB URI if needed
- Change JWT_SECRET in production

3. **Start MongoDB** (if local)

```bash
mongod
```

4. **Run Backend**

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**

```bash
cd frontend
npm install
```

2. **Create Environment File** (optional)
   Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. **Run Frontend**

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📊 Database Schema

### User

- Authentication & profile
- Role: student/mentor/admin
- Reputation system
- Activity tracking

### Room

- Topic categorization
- Active user tracking
- Statistics (questions, resolution rate)

### Question

- Linked to room & user
- Resolution status
- Pin capability
- Priority levels

### Answer

- Linked to question & user
- Upvoting system
- Accepted answer marking
- Mentor identification

---

## 🔌 Socket.IO Events

### Client → Server

- `joinRoom` - Join a topic room
- `leaveRoom` - Leave current room
- `askQuestion` - Post new question
- `answerQuestion` - Submit answer
- `upvoteAnswer` - Vote on answer
- `markResolved` - Mark question as solved
- `pinQuestion` - Pin important question
- `typing` - Typing indicator

### Server → Client

- `userJoined` - New user in room
- `userLeft` - User left room
- `newQuestion` - Question posted
- `newAnswer` - Answer submitted
- `answerUpvoted` - Vote updated
- `questionResolved` - Question solved
- `questionPinned` - Question pinned
- `userTyping` - Someone is typing

---

## 🎨 UI/UX Features

### Design System

- **Colors**: Custom primary/secondary palette
- **Typography**: Inter + Outfit fonts
- **Components**: Reusable btn, card, input, badge classes
- **Effects**: Glassmorphism, gradients, animations
- **Dark Mode**: Full support

### Pages

1. **Landing**: Hero, problem statement, features, CTA
2. **Auth**: Clean login/register forms
3. **Dashboard**: Room grid with live stats
4. **Room**: Q&A interface (NOT chat-like)
5. **Profile**: User stats, reputation, history

---

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting (login, questions)
- Input validation
- CORS configuration
- Protected routes
- Role-based authorization

---

## 📈 Resume-Worthy Highlights

Use these talking points in interviews:

1. **"Built a scalable real-time Q&A platform using MERN and WebSockets"**

   - Explain Socket.IO event architecture
   - Discuss room-based communication
2. **"Designed event-driven architecture with Socket.IO for live collaboration"**

   - User presence tracking
   - Real-time state synchronization
3. **"Implemented role-based access control and moderation features"**

   - Student/Mentor/Admin roles
   - Authorization middleware
4. **"Optimized MongoDB schema for concurrent read/write operations"**

   - Compound indexes
   - Normalized vs denormalized data
5. **"Applied rate limiting and security best practices"**

   - Spam prevention
   - JWT token management

---

## 🎯 Key Differentiators from Chat Apps

| Feature      | Chat App       | DoubtRoom                |
| ------------ | -------------- | ------------------------ |
| Message Type | Ephemeral chat | Structured Q&A           |
| Organization | Chronological  | Topic-based rooms        |
| Resolution   | N/A            | Mark as resolved         |
| Quality      | No ranking     | Upvoting system          |
| Roles        | Equal users    | Student/Mentor/Admin     |
| Moderation   | Basic          | Pin, resolve, reputation |

---

## 🚢 Deployment

### Backend (Render/Railway)

1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster
2. Get connection string
3. Update backend .env

---

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile

### Rooms

- `GET /api/rooms` - List rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (Mentor/Admin)
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `GET /api/rooms/:id/stats` - Room statistics

### Questions

- `GET /api/questions/room/:roomId` - Get room questions
- `GET /api/questions/:id` - Get question
- `POST /api/questions` - Ask question (rate limited)
- `PUT /api/questions/:id/resolve` - Mark resolved
- `PUT /api/questions/:id/pin` - Pin question (Mentor/Admin)
- `DELETE /api/questions/:id` - Delete question

### Answers

- `GET /api/answers/question/:questionId` - Get answers
- `POST /api/answers` - Submit answer
- `PUT /api/answers/:id/vote` - Upvote/downvote
- `PUT /api/answers/:id/accept` - Accept answer
- `DELETE /api/answers/:id` - Delete answer

---

## 🎓 Learning Outcomes

By building this project, you demonstrate:

- Full-stack MERN development
- Real-time communication (WebSockets)
- Database design & optimization
- Authentication & authorization
- RESTful API design
- Modern UI/UX practices
- Security best practices
- Deployment & DevOps

---

## 📌 Next Steps (Future Enhancements)

- [ ] Code syntax highlighting in answers
- [ ] File/image upload support
- [ ] Email notifications
- [ ] Search functionality
- [ ] Tags for questions
- [ ] Leaderboard
- [ ] Analytics dashboard (Admin)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

This is a learning project. Feel free to fork and customize!

---

## 📄 License

MIT License - Free to use for learning and portfolio

---

**Built by**: [Your Name]
**Tech Stack**: MongoDB, Express, React, Node.js, Socket.IO, Tailwind CSS
**Purpose**: Final Year Project / Portfolio / Interview Preparation

---

## 🎤 Interview Defense Tips

### Be Ready to Explain:

1. **Why Socket.IO + REST together?**

   - REST for CRUD operations (stateless)
   - WebSockets for real-time updates (stateful)
2. **Why separate Question and Answer models?**

   - Better querying (get questions without answers)
   - Independent voting/resolution
   - Scalability
3. **How does rate limiting work?**

   - Prevents spam (3 questions per 5 min)
   - IP-based for public routes
   - User-based for authenticated routes
4. **How do you handle authentication in Socket.IO?**

   - JWT token in handshake auth
   - Middleware verifies before connection
   - User ID attached to socket
5. **What's your deployment strategy?**

   - Backend on Render (auto-deploy from GitHub)
   - Frontend on Vercel (CDN distribution)
   - MongoDB Atlas (managed database)

---

**Remember**: This is NOT a chat app. It's a **problem-solving platform**. Emphasize the structured Q&A flow, moderation, and collaborative learning aspects.


.

.
