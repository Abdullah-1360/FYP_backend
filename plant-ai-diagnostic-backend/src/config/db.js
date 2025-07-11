const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
   if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

mongoose.connect("mongodb+srv://newuser123:newuser123@cluster0.o0uhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB is connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if the connection fails
});
};

module.exports = connectDB;