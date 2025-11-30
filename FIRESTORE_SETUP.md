# Free Firestore Setup Guide

## 1. Create Firebase Project (FREE)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: "nolaz-store"
4. Disable Google Analytics (to keep it free)
5. Create project

## 2. Enable Firestore Database (FREE)

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location closest to you
5. Click "Done"

## 3. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app: "Nolaz Store"
5. Copy the config object

## 4. Update firebase-config.js

Replace the config in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 5. Set Firestore Rules (FREE TIER)

In Firestore > Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (simple setup)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Free Tier Limits (More than enough for your store):

✅ **1 GB storage** - Thousands of blog posts and users
✅ **50,000 reads/day** - Hundreds of daily visitors  
✅ **20,000 writes/day** - Lots of signups and posts
✅ **20,000 deletes/day** - More than you'll need
✅ **1 GB network egress** - Fast data transfer

## What's Stored in Firestore:

📝 **Blog Posts** - All blog articles and content
👥 **Users** - User accounts and profiles  
📧 **Newsletter** - Email subscriptions
🛒 **Orders** - Future order management

## Test Your Setup:

1. Open your website
2. Sign up for an account
3. Check Firestore console - you should see the user
4. Subscribe to newsletter
5. Check for subscriber in Firestore

Your Nolaz Store now uses free Firestore database!