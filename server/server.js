const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    exposedHeaders: ['X-User-Key', 'Content-Disposition']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cached Serverless Database Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Root route for sanity check
app.get('/', (req, res) => {
  res.status(200).send('FileEncrypta backend is running on Vercel!');
});

// Routes (Prefixes all fileRoutes with /api)
app.use('/api', fileRoutes);

// Ping 
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Only listen on port during local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;