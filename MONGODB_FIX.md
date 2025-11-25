# MongoDB Connection Fix

## Error: `querySrv EREFUSED _mongodb._tcp.cluster0.o0uhy.mongodb.net`

This error means the MongoDB connection cannot be established. Here's how to fix it:

## Solution 1: Check MongoDB Atlas Cluster

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Login** with your credentials
3. **Check Cluster Status:**
   - Is the cluster paused? (Click "Resume" if paused)
   - Is the cluster deleted? (Create a new one)
   - Is the cluster still loading? (Wait for it to finish)

## Solution 2: Update Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**
5. Wait 1-2 minutes for changes to propagate

## Solution 3: Get New Connection String

1. In MongoDB Atlas, click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Update `FYP_backend/.env`:

```env
DATABASE_URL="mongodb+srv://newuser123:newuser123@cluster0.o0uhy.mongodb.net/your_database_name?retryWrites=true&w=majority"
```

**Important:** Replace `your_database_name` with your actual database name (e.g., `aiplant`, `fyp`, etc.)

## Solution 4: Check Database User

1. In MongoDB Atlas, go to **Database Access**
2. Verify user `newuser123` exists
3. Check password is correct: `newuser123`
4. Ensure user has **Read and write to any database** permission

## Solution 5: Test Connection

### Option A: Using MongoDB Compass
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Paste your connection string
3. Click Connect
4. If it works, the issue is with your Node.js setup

### Option B: Using Node.js Test Script

Create `FYP_backend/test-db.js`:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
```

Run: `node test-db.js`

## Solution 6: DNS Issue (Windows)

If you're on Windows and having DNS issues:

1. **Flush DNS Cache:**
```cmd
ipconfig /flushdns
```

2. **Change DNS Servers:**
   - Open Network Settings
   - Change DNS to Google DNS: 8.8.8.8 and 8.8.4.4

3. **Restart Computer**

## Solution 7: Use Alternative Connection String

Try the standard connection format instead of SRV:

```env
DATABASE_URL="mongodb://newuser123:newuser123@cluster0-shard-00-00.o0uhy.mongodb.net:27017,cluster0-shard-00-01.o0uhy.mongodb.net:27017,cluster0-shard-00-02.o0uhy.mongodb.net:27017/your_database_name?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority"
```

Get this from MongoDB Atlas → Connect → Connect your application → Standard connection string

## Solution 8: Firewall/Antivirus

1. Temporarily disable firewall/antivirus
2. Try connecting again
3. If it works, add exception for Node.js

## Quick Fix: Use Local MongoDB (Development Only)

If you need to work immediately:

1. **Install MongoDB locally:**
   - Windows: https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 mongo`

2. **Update .env:**
```env
DATABASE_URL="mongodb://localhost:27017/aiplant"
```

3. **Restart server**

## After Fixing

Once connected, restart your backend:
```bash
cd FYP_backend
npm start
```

You should see: `✅ MongoDB is connected successfully`

## Current Connection String Analysis

Your current string:
```
mongodb+srv://newuser123:newuser123@cluster0.o0uhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Issue:** Missing database name after `.mongodb.net/`

**Should be:**
```
mongodb+srv://newuser123:newuser123@cluster0.o0uhy.mongodb.net/aiplant?retryWrites=true&w=majority&appName=Cluster0
```

Add your database name (e.g., `aiplant`, `fyp`, `test`, etc.) between `.net/` and `?`
