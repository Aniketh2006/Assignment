# SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

A full-stack web application that enables users to exchange calendar time slots through a peer-to-peer marketplace system.

---

## Project Overview

SlotSwapper is a scheduling application where users can create calendar events, mark them as swappable, and request to exchange time slots with other users. The application handles the complete swap workflow from request creation to acceptance/rejection, with automatic ownership transfer of events.

### Key Features
- Secure user authentication with JWT tokens
- Create and manage personal calendar events
- Mark busy slots as available for swapping
- Browse marketplace of swappable events from all users
- Send swap requests offering your own swappable slots
- Accept or reject incoming swap requests
- Automatic event ownership transfer on swap acceptance
- Real-time status tracking (BUSY, SWAPPABLE, SWAPPENDING)

---

## Design Choices

### Architecture Decisions

**Backend: Node.js + Express + SQLite**
- **Express.js**: Chosen for its minimalist, flexible approach to building REST APIs. Allows rapid development with extensive middleware ecosystem.
- **SQLite**: Selected over PostgreSQL/MySQL for simplicity and portability. Single-file database makes setup trivial, perfect for development and small-scale deployment. No separate database server required.
- **JWT Authentication**: Implemented stateless authentication for better scalability. Tokens stored client-side reduce server memory usage.

**Frontend: React + Vite**
- **React 18**: Component-based architecture enables reusable UI elements and better state management.
- **Vite**: Modern build tool providing instant hot-reload during development. Significantly faster than Create React App.
- **Single-Page Application**: Client-side routing eliminates page reloads, providing smoother user experience.
- **Context API**: Used for global authentication state instead of Redux to reduce complexity.

**Database Schema Design**
- **Three-table structure**: users, events, swap_requests
- **Foreign key relationships**: Maintains referential integrity between users, events, and swap requests
- **Status enums**: Event status (BUSY/SWAPPABLE/SWAPPENDING) and swap status (PENDING/ACCEPTED/REJECTED) stored as text for readability
- **Cascading logic**: Manual handling of event ownership transfer to ensure data consistency

**Security Considerations**
- **bcrypt password hashing**: Passwords hashed with salt rounds of 10
- **JWT token expiration**: 7-day expiration to balance security and user experience
- **CORS enabled**: Allows frontend-backend communication during development
- **Input validation**: All API endpoints validate required fields before processing

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your Linux/Ubuntu system:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git**

Install prerequisites:

```bash
sudo apt update
sudo apt install nodejs npm git
Verify installation:

bash
Copy code
node --version
npm --version
Installation Steps
1. Clone Repository
bash
Copy code
git clone <your-repository-url>
cd slot-swapper
2. Backend Setup
Navigate to backend folder:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Dependencies installed:

express (^4.18.2)

sqlite3 (^5.1.6)

jsonwebtoken (^9.0.0)

bcryptjs (^2.4.3)

cors (^2.8.5)

Initialize database (creates tables):

bash
Copy code
node src/seed.js
Expected output:

pgsql
Copy code
✅ Users table created
✅ Events table created
✅ Swap_requests table created
✅ Database initialization complete!
This creates database.sqlite file in the backend directory.

3. Frontend Setup
Navigate to frontend folder (from project root):

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Dependencies installed:

react (^18.2.0)

react-dom (^18.2.0)

react-router-dom (^6.12.1)

axios (^1.6.0)

vite (build tool)

Running the Application
You need TWO terminal windows running simultaneously.

Terminal 1: Start Backend Server
bash
Copy code
cd backend
npm start
Expected output:

pgsql
Copy code
✅ Database tables initialized
🚀 Backend server running on http://localhost:3001
Keep this terminal running.

Terminal 2: Start Frontend Development Server
bash
Copy code
cd frontend
npm run dev
Expected output:

arduino
Copy code
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
Open your browser at:
👉 http://localhost:5173

API Endpoints
Base URL: http://localhost:3001/api

Authentication Endpoints
Method	Endpoint	Description	Auth
POST	/auth/signup	Create new user account	No
POST	/auth/login	Authenticate and receive JWT token	No

Example signup:

json
Copy code
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
Example login success:

json
Copy code
{
  "token": "jwt...",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com" }
}
Events API
Method	Endpoint	Description
GET	/events	Get user events
POST	/events	Create event
PUT	/events/swappable/:id	Mark event swappable
GET	/events/swappable	Get swappable events from others

All require:
Authorization: Bearer <your-jwt-token>

Example create event:

json
Copy code
{
  "title": "Team Meeting",
  "startTime": "2025-11-02T10:00:00",
  "endTime": "2025-11-02T11:00:00"
}
Swap Requests API
Method	Endpoint	Description
POST	/swap/request	Create new swap request
GET	/swap/incoming	Incoming swap requests
GET	/swap/outgoing	Outgoing swap requests
POST	/swap/response/:id	Accept or reject request

Example create request:

json
Copy code
{
  "mySlotId": 1,
  "theirSlotId": 3
}
Example accept/reject:

json
Copy code
{
  "accept": true
}
Database Schema
users
sql
Copy code
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
events
sql
Copy code
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  status TEXT DEFAULT 'BUSY',
  userId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
swap_requests
sql
Copy code
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
Project Structure
pgsql
Copy code
slot-swapper/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config.js
│   │   ├── seed.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── auth/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
Assumptions Made
Single timezone (UTC)

No event overlap checking

Permanent swaps only

No event editing/deletion

No pagination

localStorage for JWT (dev use only)

Fixed ports: backend 3001, frontend 5173

Challenges Faced
1. SQLite Connection Persistence
Kept DB connection open throughout app lifecycle to avoid “database closed” errors.

2. JWT State Persistence
Returned user data with token for frontend persistence.

3. Date Formatting
Fixed missing fields in SQL JOINs to show proper times.

4. Orphaned Swap Requests
Documented issue; suggested soft deletes or denormalized history.

5. CORS
Enabled cors() middleware for local development.

6. React Router Auth Context
Used Context API + localStorage for session persistence.

7. Async Password Hashing
Used bcrypt.hash() async to avoid event loop blocking.

8. Event Status Machine
Enforced valid transitions: BUSY → SWAPPABLE → SWAPPENDING → BUSY.

Testing the Application
Register Alice and Bob

Create events

Mark some swappable

Send and respond to swap requests

Verify ownership transfers after acceptance

Troubleshooting
Backend won't start:

bash
Copy code
cd backend && rm -rf node_modules package-lock.json && npm install && npm start
Frontend won't start:

bash
Copy code
cd frontend && rm -rf node_modules package-lock.json && npm install && npm run dev
Reset Database:

bash
Copy code
cd backend
rm database.sqlite
node src/seed.js
Free ports:

bash
Copy code
sudo fuser -k 3001/tcp
sudo fuser -k 5173/tcp
Future Improvements
High Priority
Event editing/deletion

Transaction management

Pagination

Validation

Medium Priority
Email notifications

Swap history

Time zone support

Production Readiness
Environment variables

PostgreSQL migration

HTTPS & rate limiting

Docker + CI/CD pipelines

Jest / Cypress testing

License
MIT License - free for educational and personal use.

Author
Developer: Shetty Aniketh Nishikanth
Email: shettyaniketh09@gmail.com
GitHub: Aniketh2006
Project Date: November 2025
Assignment: ServiceHive Full Stack Intern Technical Challenge

Contact
For questions or issues:
📧 shettyaniketh09@gmail.com
🐙 [repository-url]/issues
