require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const adminCredentials = {
    username: 'admin',
    email: 'admin@aiplant.com',
    password: 'Admin@123',
    role: 'admin'
};

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminCredentials.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);

        // Create admin user
        const adminUser = new User({
            username: adminCredentials.username,
            email: adminCredentials.email,
            password: hashedPassword,
            role: adminCredentials.role
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminCredentials.email);
        console.log('Password:', adminCredentials.password);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdminUser(); 