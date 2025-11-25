# URGENT: MongoDB Connection Fix

## The Problem
Your DNS cannot resolve `cluster0.o0uhy.mongodb.net` - this means either:
1. The MongoDB Atlas cluster doesn't exist or is paused
2. Network/firewall is blocking it

## IMMEDIATE SOLUTION: Check MongoDB Atlas

### Step 1: Login to MongoDB Atlas
Go to: https://cloud.mongodb.com/

### Step 2: Check Your Cluster
- Do you see a cluster named "Cluster0"?
- Is it showing as "Paused" or "Deleted"?
- If paused, click "Resume"
- If deleted, you need to create a new one

### Step 3: If Cluster Exists, Get New Connection String
1. Click "Connect" button on your cluster
2. Choose "Connect your application"
3. Copy the FULL connection string
4. Replace the one in `.env`

## ALTERNATIVE: Use Local MongoDB (Quick Fix)

If you need to work RIGHT NOW while fixing Atlas:

### Option 1: Docker (Easiest)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then update `.env`:
```env
DATABASE_URL="mongodb://localhost:27017/aiplant"
```

### Option 2: Install MongoDB Locally
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Update `.env`:
```env
DATABASE_URL="mongodb://localhost:27017/aiplant"
```

### Option 3: Use MongoDB Atlas Free Tier (New Cluster)
1. Go to https://cloud.mongodb.com/
2. Create new cluster (Free M0)
3. Wait 5-10 minutes for it to deploy
4. Add your IP to Network Access (0.0.0.0/0 for testing)
5. Create database user
6. Get connection string
7. Update `.env`

## After Fixing

1. Save `.env` file
2. Restart your backend:
```bash
cd FYP_backend
npm start
```

3. You should see: `✅ MongoDB is connected successfully`

## Test Connection
```bash
node test-connection.js
```

If successful, you'll see:
```
✅ MongoDB connection successful!
Database: aiplant
```

## Current Status
❌ DNS cannot resolve: cluster0.o0uhy.mongodb.net
❌ This means the cluster might not exist or is inaccessible

## What to Do NOW

**FASTEST FIX:** Use Docker MongoDB locally (takes 30 seconds)
```bash
# 1. Install Docker Desktop if you don't have it
# 2. Run this command:
docker run -d -p 27017:27017 mongo

# 3. Update .env:
DATABASE_URL="mongodb://localhost:27017/aiplant"

# 4. Restart backend
npm start
```

This will get you working immediately while you fix the Atlas issue!
