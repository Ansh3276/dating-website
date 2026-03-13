require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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

// Start Server & Connect Database
app.listen(PORT, async () => {
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
