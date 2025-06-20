# mEETuo Video Conferencing App

A production-grade Zoom/Google Meet/Microsoft Teams-like web application.

## Tech Stack
- React.js + TailwindCSS (Frontend)
- Node.js + Express.js + Socket.io (Backend)
- MongoDB Atlas (Database)
- WebRTC (Real-time video/audio)
- JWT Auth

## Setup

### 1. Clone the repo
```
git clone <repo-url>
cd mEETuo
```

### 2. Environment Variables
Copy `.env.example` to `.env` in both `client/` and `server/` as needed, and fill in secrets.

### 3. Install Dependencies
```
cd client && npm install
cd ../server && npm install
```

### 4. Run Development Servers
```
# In one terminal
cd server && npm run dev
# In another terminal
cd client && npm start
```

### 5. Run Tests
```
cd server && npm test
cd ../client && npm test
```

## Features
- Auth (Sign Up, Login, Guest)
- Meeting rooms with unique links
- Lobby/waiting room
- Real-time video/audio, chat, screen share
- Role-based controls (Host, Co-Host, Participant)
- Recording (local or simulated cloud)
- Responsive, modern UI

---

For more details, see code comments and each folder's README.
#   m E E T u o  
 