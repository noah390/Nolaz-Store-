# Google Authentication Domain Authorization

## Issue
Google Sign-In shows error: "This domain is not authorized for OAuth operations"

## Solution
Add your domain to Firebase authorized domains:

### Steps:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **nolaz-store**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your current domain (e.g., `localhost`, `127.0.0.1`, or your live domain)

### Common domains to add:
- `localhost` (for local development)
- `127.0.0.1` (for local development)
- Your live website domain (e.g., `nolazstore.com`)

### Alternative
Users can still sign up using email/password method which works without domain authorization.

## Current Status
- ✅ Email/Password authentication works
- ⚠️ Google Sign-In requires domain authorization
- ✅ All other website features work normally