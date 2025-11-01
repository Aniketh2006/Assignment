# SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

🚀 **Live Demo:** https://slotswapper-one.vercel.app/
📡 **API Backend:** https://slotswapper-backend-9gps.onrender.com

A full-stack web application that enables users to exchange calendar time slots through a peer-to-peer marketplace system.

---

## 🌟 Features

- 🔐 Secure user authentication (signup/login) with JWT tokens
- 📅 Create and manage personal calendar events
- 🔄 Mark events as swappable
- 🛒 Browse marketplace of available swappable slots
- 💬 Request swaps with other users
- ✅ Accept or reject incoming swap requests
- 🔁 Automatic event ownership transfer on swap acceptance
- 📊 Real-time event status tracking (BUSY, SWAPPABLE, SWAPPENDING)
- 🎨 Modern dark theme UI with gradient effects
- 📱 Fully responsive design

---

## 🛠 Tech Stack

**Backend:**
- Node.js & Express.js - RESTful API server
- SQLite3 - Lightweight database
- JWT (jsonwebtoken) - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing
- dotenv - Environment variable management

**Frontend:**
- React 18 - UI framework
- React Router - Client-side routing
- Axios - HTTP client
- Vite - Build tool & dev server
- CSS3 - Custom styling with design system

**Deployment:**
- Backend: Render (https://render.com)
- Frontend: Vercel (https://vercel.com)
- Version Control: GitHub

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- GitHub account (for deployment)

Install prerequisites on Ubuntu/Linux:

sudo apt update
sudo apt install nodejs npm git

text

Verify installation:

node --version
npm --version
git --version

text

---

## 🚀 Local Installation

### 1. Clone Repository

git clone https://github.com/Aniketh2006/Assignment.git
cd Assignment

text

### 2. Backend Setup

cd backend
npm install
node src/seed.js

text

Expected output:
✅ Users table created
✅ Events table created
✅ Swap_requests table created
✅ Database initialization complete!

text

### 3. Frontend Setup

cd ../frontend
npm install

text

---

## 💻 Running Locally

You need **two terminal windows** running simultaneously.

### Terminal 1 - Start Backend

cd backend
npm start

text

Expected output:
✅ Database tables initialized
🚀 Backend server running on port 3001

text

### Terminal 2 - Start Frontend

cd frontend
npm run dev

text

Expected output:
VITE v5.x.x ready in xxx ms

➜ Local: http://localhost:5173/

text

**Open browser:** http://localhost:5173

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push to GitHub:**
git add .
git commit -m "Initial commit"
git push origin main

text

2. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name:** slotswapper-backend
     - **Region:** Choose closest
     - **Branch:** main
     - **Root Directory:** backend
     - **Runtime:** Node
     - **Build Command:** `npm install && npm rebuild sqlite3`
     - **Start Command:** `npm start`

4. **Add Environment Variables:**
   - `PORT`: 10000
   - `JWT_SECRET`: your-secret-key-here
   - `NODE_ENV`: production
   - `FRONTEND_URL`: (add after Vercel deployment)

5. **Deploy:** Wait 2-3 minutes

### Frontend Deployment (Vercel)

1. **Update Frontend Config:**
cd frontend
echo "VITE_API_URL=https://your-backend.onrender.com/api" > .env.production

text

2. **Create Vercel Account:**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Import GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** dist

4. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`

5. **Deploy:** Wait 30-60 seconds

6. **Update Backend:**
   - Go back to Render
   - Add environment variable:
     - `FRONTEND_URL`: `https://your-app.vercel.app`

---

## 📖 Usage Guide

### 1. User Registration
- Navigate to signup page
- Enter name, email, password
- Click "Sign Up"

### 2. Login
- Enter credentials
- Click "Log In"
- Redirected to dashboard

### 3. Create Event
- Fill event title (e.g., "Team Meeting")
- Select start date/time
- Select end date/time
- Click "Create Event"
- Event appears with BUSY status

### 4. Mark as Swappable
- Find your event in dashboard
- Click "Make Swappable"
- Status changes to SWAPPABLE
- Event appears in marketplace

### 5. Browse Marketplace
- Click "Marketplace" in navigation
- View all swappable events from other users
- See event details and owner information

### 6. Request Swap
- Click "Request Swap" on desired event
- Modal shows your swappable events
- Click "Offer This Slot" on your event
- Both events change to SWAPPENDING status

### 7. Manage Swap Requests
- Click "Requests" in navigation
- View incoming requests (others want your events)
- View outgoing requests (you want their events)
- Click "Accept" to exchange events
- Click "Reject" to decline

### 8. Event Exchange
- On acceptance:
  - Events swap ownership
  - Both events return to BUSY status
  - Users can now manage their new events

---

## 🔌 API Documentation

Base URL: `http://localhost:3001/api` (local) or `https://your-backend.onrender.com/api` (production)

### Authentication Endpoints

**POST `/auth/signup`**
Request:
{
"name": "Alice",
"email": "alice@example.com",
"password": "password123"
}

Response (200):
{
"success": true,
"message": "User created successfully"
}

text

**POST `/auth/login`**
Request:
{
"email": "alice@example.com",
"password": "password123"
}

Response (200):
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": 1,
"name": "Alice",
"email": "alice@example.com"
}
}

text

### Event Endpoints (Require Authentication)

**GET `/events`**
- Headers: `Authorization: Bearer <token>`
- Returns: Array of user's events

**POST `/events`**
Request:
{
"title": "Team Meeting",
"startTime": "2025-11-02T10:00:00",
"endTime": "2025-11-02T11:00:00"
}

text

**PUT `/events/swappable/:id`**
- Mark event as swappable

**GET `/events/swappable`**
- Get swappable events from other users (marketplace)

### Swap Endpoints (Require Authentication)

**POST `/swap/request`**
{
"mySlotId": 1,
"theirSlotId": 3
}

text

**GET `/swap/incoming`**
- Get swap requests where you are the requestee

**GET `/swap/outgoing`**
- Get swap requests where you are the requester

**POST `/swap/response/:id`**
{
"accept": true
}

text

---

## 🗄 Database Schema

### Users Table
CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL
);

text

### Events Table
CREATE TABLE events (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
startTime TEXT NOT NULL,
endTime TEXT NOT NULL,
status TEXT DEFAULT 'BUSY',
userId INTEGER NOT NULL,
FOREIGN KEY (userId) REFERENCES users(id)
);

text

**Status Values:**
- `BUSY` - Default state, not available for swapping
- `SWAPPABLE` - Available in marketplace
- `SWAPPENDING` - Swap request pending

### Swap Requests Table
CREATE TABLE swap_requests (
id INTEGER PRIMARY KEY AUTOINCREMENT,
requesterId INTEGER NOT NULL,
requesteeId INTEGER NOT NULL,
requesterEventId INTEGER NOT NULL,
requesteeEventId INTEGER NOT NULL,
status TEXT DEFAULT 'PENDING',
FOREIGN KEY (requesterId) REFERENCES users(id),
FOREIGN KEY (requesteeId) REFERENCES users(id),
FOREIGN KEY (requesterEventId) REFERENCES events(id),
FOREIGN KEY (requesteeEventId) REFERENCES events(id)
);

text

**Status Values:**
- `PENDING` - Awaiting response
- `ACCEPTED` - Swap completed
- `REJECTED` - Swap declined

---

## 📁 Project Structure

Assignment/
├── backend/
│ ├── src/
│ │ ├── models/ # Database models
│ │ │ ├── User.js
│ │ │ ├── Event.js
│ │ │ ├── SwapRequest.js
│ │ │ └── index.js
│ │ ├── routes/ # API routes
│ │ │ ├── auth.js
│ │ │ ├── events.js
│ │ │ └── swap.js
│ │ ├── middleware/ # Authentication middleware
│ │ │ └── auth.js
│ │ ├── config.js # Database configuration
│ │ ├── seed.js # Database initialization
│ │ └── index.js # Express server
│ ├── .env # Environment variables (local)
│ ├── .env.example # Example environment file
│ ├── .gitignore
│ ├── package.json
│ └── database.sqlite # SQLite database file
│
├── frontend/
│ ├── src/
│ │ ├── pages/ # React pages
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Marketplace.jsx
│ │ │ └── Requests.jsx
│ │ ├── components/ # Reusable components
│ │ │ ├── Nav.jsx
│ │ │ ├── EventList.jsx
│ │ │ ├── EventForm.jsx
│ │ │ └── SwapModal.jsx
│ │ ├── auth/ # Authentication context
│ │ │ └── AuthProvider.jsx
│ │ ├── config.js # API URL configuration
│ │ ├── App.jsx # Main app component
│ │ ├── main.jsx # React entry point
│ │ └── index.css # Global styles
│ ├── .env.production # Production environment
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
└── README.md

text

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
sudo fuser -k 3001/tcp

text

**Database errors:**
cd backend
rm database.sqlite
node src/seed.js
npm start

text

**SQLite rebuild errors (Render):**
- Build Command: `npm install && npm rebuild sqlite3`

### Frontend Issues

**API connection fails:**
- Check `VITE_API_URL` in Vercel environment variables
- Must end with `/api`: `https://backend.onrender.com/api`

**CORS errors:**
- Add `FRONTEND_URL` to Render backend environment variables
- Value: Your Vercel URL

### Deployment Issues

**Render free tier cold starts:**
- First request takes 30-60 seconds
- Service spins down after 15 minutes inactivity

**Vercel environment variables:**
- Update requires manual redeploy
- Go to Deployments → Redeploy

---

## 🎯 Design Decisions

**SQLite Database:**
- Lightweight and serverless
- Single-file storage
- Perfect for development and small-scale deployment
- No separate database server required

**JWT Authentication:**
- Stateless authentication mechanism
- Scalable for distributed systems
- Tokens stored client-side
- 7-day expiration for security

**React + Vite:**
- Fast development with hot-reload
- Component-based architecture
- Modern build tooling
- Smaller bundle sizes

**REST API:**
- Standard HTTP methods
- Clear endpoint naming
- Predictable behavior
- Easy to test and document

**SPA Architecture:**
- No page reloads
- Better user experience
- Reduced server load
- Client-side routing

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Environment variable management

---

## 🚀 Future Enhancements

### High Priority
- Email notifications for swap requests
- PostgreSQL migration for production
- Event deletion with cascade handling
- Event editing functionality
- Pagination for large datasets

### Medium Priority
- Calendar integration (Google Calendar, Outlook)
- Recurring events support
- Event categories and tags
- Search and filter functionality
- User profiles with swap history

### Low Priority
- Real-time notifications with WebSockets
- Mobile app (React Native)
- OAuth integration (Google, GitHub)
- Export calendar (.ics files)
- Analytics dashboard

### Production Readiness
- Comprehensive testing (Jest, React Testing Library)
- CI/CD pipeline (GitHub Actions)
- Docker containerization
- Monitoring and logging (Winston, Sentry)
- Rate limiting
- HTTPS enforcement

---

## 📊 Testing

### Manual Testing Flow

1. **User Authentication:**
   - Sign up user "Alice"
   - Sign up user "Bob" (different browser/incognito)
   - Login as both users

2. **Event Management:**
   - Alice creates "Team Meeting"
   - Alice marks it as swappable
   - Verify status changes

3. **Marketplace:**
   - Bob views marketplace
   - Sees Alice's swappable event
   - Creates own swappable event

4. **Swap Request:**
   - Bob requests swap
   - Offers his event for Alice's
   - Both events show SWAPPENDING

5. **Swap Response:**
   - Alice sees incoming request
   - Alice accepts swap
   - Events exchange ownership
   - Both show BUSY status

---

## 📝 License

MIT License - Free to use for educational and personal projects

---

## 👨‍💻 Author

**Developer:** Aniketh  
**Project:** ServiceHive Full Stack Intern Technical Challenge  
**Date:** November 2025  
**GitHub:** https://github.com/Aniketh2006/Assignment  
**Live Demo:** https://slotswapper-one.vercel.app/

---

## 🙏 Acknowledgments

Built as part of the ServiceHive technical assessment for the Full Stack Developer Intern position. This project demonstrates full-stack development capabilities including:

- RESTful API design and implementation
- Database schema design and relationships
- User authentication and authorization
- Modern React development with hooks
- State management and routing
- Responsive UI design
- Production deployment
- Clean code architecture

---

## 📞 Contact

For questions or issues with this project:
- **GitHub Issues:** https://github.com/Aniketh2006/Assignment/issues
- **Email:** shettyaniketh09@gmail.com

---

## ⭐ Show Your Support

If you found this project helpful, please give it a star ⭐ on GitHub!

---

**Last Updated:** November 1, 2025
