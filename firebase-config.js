// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWMrKWaWFyJSHotvPtja99saQWSjbIAyo",
  authDomain: "nolaz-store.firebaseapp.com",
  projectId: "nolaz-store",
  storageBucket: "nolaz-store.firebasestorage.app",
  messagingSenderId: "973021887983",
  appId: "1:973021887983:web:d02d54ab03d31287c74a1a",
  measurementId: "G-8W0WW8NC6R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
window.auth = auth;
window.db = db;