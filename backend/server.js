require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const http = require('http');
const { initSocket } = require('./socketHandler');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Must specify origins for credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Session Configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'super_secret_session_key',
  resave: false,
  saveUninitialized: false, // Don't create sessions until something is stored
  cookie: {
    secure: false, // Must be false for localhost without HTTPs
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Simple logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Auth: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  next();
});

// Routes (to be added)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create HTTP server explicitly to attach Socket.io
const server = http.createServer(app);
initSocket(server);

// Start Server & Connect Database
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Ensure DB exists before connecting
  const { createDatabaseIfNotExists } = require('./config/initDb');
  await createDatabaseIfNotExists();

  await connectDB();
  
  // Sync database models (creates tables if they don't exist)
  try {
    const { sequelize } = require('./models/index');
    await sequelize.sync({ force: false }); // Change to true carefully to drop existing tables during dev
    console.log('Database synced.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
});
