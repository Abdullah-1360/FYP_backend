const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authMiddleware = require('./middlewares/authMiddleware');
const chatService = require('./services/chatService');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('dotenv').config();
const dbconfig=require('./config/db'); 
const app = express();
app.use(express.json());
dbconfig(); // Call the function to connect to the database

// Configure CORS - Must be before routes

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true); // Reflect the request origin
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
// Handle pre-flight requests
app.options('*', cors(corsOptions));

// Serve uploads statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', authMiddleware.authenticateAdmin, adminRoutes);
app.use('/api/chat', chatRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(errorHandler);

const PORT =  5000;

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://fyp-backend-wheat.vercel.app', 'http://192.168.100.187:5000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Move all chat socket logic to a separate file
const setupChatSockets = require('./sockets/chatSocket');
setupChatSockets(io);

server.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});