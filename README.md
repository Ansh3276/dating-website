# 💖 Crushly — Modern Dating Web App

> A full-stack dating platform with real-time chat, swipe-based matching, and a cinematic landing page — built with React, Express, MySQL, and Socket.io.

---

## ✨ Features

### 🔐 Authentication & Profiles
- Secure user registration and login with **JWT** and **bcrypt** password hashing
- Multi-step signup flow — name, age, gender, bio, interests, and dating preferences
- Profile photo upload via **Multer** with editable profile page
- Cookie-based sessions for persistent login

### 💘 Discover & Matching
- Swipe-based **like/pass** system on the Discover page
- Gender and preference-based filtering (men, women, everyone)
- **Mutual matching** — when two users like each other, a match is created
- View pending likes (sent) and incoming likes (received)
- Real-time match notifications via Socket.io

### 💬 Real-Time Chat
- Instant messaging powered by **Socket.io** WebSockets
- Message delivery status tracking — **sent**, **delivered**, **seen**
- Real-time **typing indicators** (typing / stop typing)
- Conversation threads between matched users
- Unread message tracking

### 🟢 Online Presence
- Real-time **online/offline** status for all users
- Multi-tab support — user stays online across multiple browser tabs
- Live online user list broadcast

### 🎬 Cinematic Landing Page
- Scroll-triggered **frame-by-frame animation** using a 240-frame image sequence on canvas
- Parallax cinematic quote overlays with fade/slide animations
- Ambient floating particle effects
- Preloader splash screen with progress bar
- Smooth scrolling powered by **Lenis**

### 🎨 Premium UI/UX
- Glass-morphism navbar with scroll-based state transitions (transparent → frosted)
- Page transitions and micro-animations via **Framer Motion**
- Responsive design across desktop and mobile
- Sections: Hero, Match Preview, Video, How It Works, Love Stories, Premium Features, App Preview, Testimonials, CTA, Footer

---

## 🛠️ Tech Stack

| Layer        | Technology                                    |
|------------- |-----------------------------------------------|
| **Frontend** | React 18, Vite, Framer Motion, GSAP           |
| **Styling**  | Vanilla CSS, Glass-morphism, Custom Animations |
| **3D/Visual**| Three.js, React Three Fiber, React Three Drei |
| **Backend**  | Node.js, Express 5                            |
| **Database** | MySQL, Sequelize ORM                          |
| **Real-Time**| Socket.io (server + client)                   |
| **Auth**     | JWT, bcrypt, cookie-parser, express-session    |
| **Uploads**  | Multer (profile photo uploads)                |
| **Scrolling**| Lenis (smooth scroll)                         |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MySQL** running locally (e.g., XAMPP, WAMP, or MySQL Server)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ansh3276/dating-website.git
cd dating-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Configuration

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dating_app_db
JWT_SECRET=your_secret_key
```

### Running the App

```bash
# Terminal 1 — Start backend server
cd backend
npm run dev

# Terminal 2 — Start frontend dev server
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

> The database and tables are created automatically on first run via Sequelize sync.

---

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── animations/         # Scroll frame animation logic
│   ├── assets/             # Images, frames, SVGs
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth context provider
│   ├── pages/              # Page routes (Landing, Login, Signup, etc.)
│   ├── services/           # API service layer (Axios)
│   └── styles/             # CSS files per component
├── backend/
│   ├── config/             # Database connection & init
│   ├── controllers/        # Route handlers (auth, user, chat)
│   ├── middleware/          # JWT auth middleware
│   ├── models/             # Sequelize models (User, Match, Message, Conversation)
│   ├── routes/             # Express route definitions
│   ├── uploads/            # User uploaded photos
│   ├── socketHandler.js    # Socket.io event handlers
│   └── server.js           # Express app entry point
├── index.html              # Vite entry HTML
└── package.json
```

---

## 👥 Contributors

| Name               | Role        |
|--------------------|-------------|
| **Ansh**           | Developer   |
| **Ansh Tuteja**    | Developer   |
| **Aman Karakoti**  | Developer   |
| **Ishaan Guglany** | Developer   |

---

## 📄 License

This project is built for educational and personal use.

---

<p align="center">
  Made with 💖 by the Crushly Team
</p>
