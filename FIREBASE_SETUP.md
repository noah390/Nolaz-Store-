# Firebase Setup Guide for Nolaz Store

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project "nolaz-store"
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app with name "Nolaz Store"
5. Copy the configuration object

## 5. Update Firebase Configuration

Replace the configuration in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 6. Set Up Firestore Security Rules

In Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blog posts - anyone can read, only admins can write
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Subscribers - anyone can add, only admins can read
    match /subscribers/{subscriberId} {
      allow create: if true;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## 7. Create Admin User

1. Sign up with email: `admin@nolazstore.com`
2. The system will automatically set `isAdmin: true` for this email

## 8. Test the System

1. Open your website
2. Click "Login" and create an account
3. Try logging in and out
4. Test blog functionality with admin account

## Features Enabled

✅ **Firebase Authentication**
- Email/password signup and login
- Secure user sessions
- Admin role detection

✅ **Firestore Database**
- Blog posts storage and management
- User profiles and roles
- Newsletter subscriptions
- Real-time data synchronization

✅ **Security**
- Firestore security rules
- Admin-only blog management
- Protected user data

## Troubleshooting

**CORS Issues**: Make sure to serve your files through a web server (not file://)
**Module Errors**: Ensure all scripts use `type="module"`
**Auth Errors**: Check Firebase configuration and enable Email/Password auth

Your Nolaz Store now uses Firebase for secure, scalable authentication and database management!