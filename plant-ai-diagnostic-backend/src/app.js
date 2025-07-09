const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const chatRoutes = require('./routes/chatRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());


if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if the connection fails
});
    app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});