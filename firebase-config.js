// Firebase Configuration
const firebaseConfig = {
<<<<<<< HEAD
  apiKey: "AIzaSyDI7AyVosXpbQGydrGGRqbhysKGGVg3M0c",
  authDomain: "nolaz-blog.firebaseapp.com",
  projectId: "nolaz-blog",
  storageBucket: "nolaz-blog.firebasestorage.app",
  messagingSenderId: "28266143574",
  appId: "1:28266143574:web:e12d67979e07fc95e8c0f7"
=======
  apiKey: "AIzaSyAWMrKWaWFyJSHotvPtja99saQWSjbIAyo",
  authDomain: "nolaz-store.firebaseapp.com",
  projectId: "nolaz-store",
  storageBucket: "nolaz-store.firebasestorage.app",
  messagingSenderId: "973021887983",
  appId: "1:973021887983:web:d02d54ab03d31287c74a1a",
  measurementId: "G-8W0WW8NC6R"
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
window.auth = auth;
window.db = db;