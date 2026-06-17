# Quick Setup Guide

## 🚀 Getting Started

### 1. Create Environment File

Create a file named `.env.local` in the `pdf-chatbot-frontend` directory:

```env
# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_placeholder_key

# Backend API
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 2. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### 3. Access the Application

Open your browser and go to: `http://localhost:3000`

## 🔧 If You Still See Loading Issues

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any error messages

### Common Issues & Solutions

#### Issue: "Missing Clerk Publishable Key"

**Solution:** Make sure `.env.local` file exists and has the correct format

#### Issue: "Network Error" or "Failed to fetch"

**Solution:**

1. Make sure your backend is running on `http://localhost:8000`
2. Check if the backend API is accessible

#### Issue: Page keeps loading

**Solution:**

1. Clear browser cache (Ctrl+Shift+R)
2. Check if all dependencies are installed: `npm install`
3. Restart the development server

## 🎯 For Full Functionality

### Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key
4. Replace `pk_test_placeholder_key` in `.env.local` with your real key

### Start Backend Server

Make sure your backend is running:

```bash
cd ../pdf-chatbot-backend
# Activate virtual environment
source myenv/Scripts/activate  # Windows
# or
source myenv/bin/activate      # Mac/Linux

# Start backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🎉 Expected Behavior

Once everything is set up correctly, you should see:

1. **Landing Page** - Beautiful marketing page with features
2. **Sign In/Sign Up** - Clerk authentication forms
3. **Dashboard** - After authentication, shows user stats and sessions
4. **Chat Interface** - Upload PDFs and chat with AI
5. **Sessions Management** - Create and manage chat sessions
6. **Profile Page** - User information and usage statistics

## 🆘 Still Having Issues?

1. Check the browser console for specific error messages
2. Make sure all dependencies are installed: `npm install`
3. Verify the backend is running and accessible
4. Check that the `.env.local` file is in the correct location
