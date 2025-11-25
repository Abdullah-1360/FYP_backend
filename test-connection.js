const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log('Database:', mongoose.connection.name);
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed!');
  console.error('Error:', err.message);
  console.error('\nPossible solutions:');
  console.error('1. Check if MongoDB Atlas cluster is running');
  console.error('2. Verify network access allows your IP');
  console.error('3. Flush DNS: ipconfig /flushdns');
  console.error('4. Change DNS to 8.8.8.8 (Google DNS)');
  console.error('5. Check firewall/antivirus settings');
  process.exit(1);
});
