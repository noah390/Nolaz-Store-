// Simple Authentication Guard
class SimpleAuth {
  constructor() {
<<<<<<< HEAD
    this.isInitialized = false;
=======
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
    this.init();
  }

  init() {
    // Skip auth for admin pages
    if (window.location.pathname.includes('admin')) {
      return;
    }

    // Wait for Firebase to initialize
    if (typeof firebase === 'undefined' || !firebase.auth) {
      setTimeout(() => this.init(), 100);
      return;
    }

<<<<<<< HEAD
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Check current auth state
=======
    // Handle redirect result first
    this.handleRedirectResult();
    
    // Check auth state
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.showContent();
      } else {
        this.showAuthScreen();
      }
    });
  }

  showAuthScreen() {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif;">
        <div style="text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 400px; width: 90%;">
          <h1 style="margin: 0 0 1rem; color: #1f2937;">Welcome to Nolaz Store</h1>
          <p style="margin: 0 0 2rem; color: #6b7280;">Please sign in with your Gmail to access our fashion collection</p>
          
<<<<<<< HEAD
          <button id="googleSignInBtn" style="width: 100%; background: #4285f4; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
=======
          <button onclick="simpleAuth.signInWithGoogle()" style="width: 100%; background: #4285f4; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div style="margin: 1.5rem 0; position: relative;">
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e5e7eb;"></div>
            <span style="background: white; padding: 0 1rem; color: #6b7280; position: relative;">or</span>
          </div>
          
          <div id="authTabs" style="display: flex; margin-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb;">
<<<<<<< HEAD
            <button id="signupTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #667eea; border-bottom: 2px solid #667eea;">Sign Up</button>
            <button id="loginTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #6b7280;">Login</button>
=======
            <button onclick="simpleAuth.switchTab('signup')" id="signupTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #667eea; border-bottom: 2px solid #667eea;">Sign Up</button>
            <button onclick="simpleAuth.switchTab('login')" id="loginTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #6b7280;">Login</button>
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
          </div>
          
          <form id="signupForm">
            <input type="text" id="signupName" placeholder="Full Name" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
            <input type="email" id="signupEmail" placeholder="Email" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
<<<<<<< HEAD
            <input type="password" id="signupPassword" placeholder="Password (min 6 characters)" minlength="6" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
=======
            <input type="password" id="signupPassword" placeholder="Password" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
            <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">Create Account</button>
          </form>
          
          <form id="loginForm" style="display: none;">
            <input type="email" id="loginEmail" placeholder="Email" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
            <input type="password" id="loginPassword" placeholder="Password" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box;">
            <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-bottom: 0.5rem;">Login</button>
<<<<<<< HEAD
            <button type="button" id="forgotPasswordBtn" style="width: 100%; background: transparent; color: #667eea; border: 1px solid #667eea; padding: 0.5rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">Forgot Password?</button>
=======
            <button type="button" onclick="simpleAuth.forgotPassword()" style="width: 100%; background: transparent; color: #667eea; border: 1px solid #667eea; padding: 0.5rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">Forgot Password?</button>
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
          </form>
        </div>
      </div>
    `;

<<<<<<< HEAD
    this.bindEvents();
  }

  bindEvents() {
    // Google Sign-In
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
      googleBtn.onclick = () => this.signInWithGoogle();
    }

    // Tab switching
    const signupTab = document.getElementById('signupTab');
    const loginTab = document.getElementById('loginTab');
    
    if (signupTab) signupTab.onclick = () => this.switchTab('signup');
    if (loginTab) loginTab.onclick = () => this.switchTab('login');

    // Form submissions
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
      signupForm.onsubmit = (e) => this.signup(e);
    }
    if (loginForm) {
      loginForm.onsubmit = (e) => this.login(e);
    }

    // Forgot password
    const forgotBtn = document.getElementById('forgotPasswordBtn');
    if (forgotBtn) {
      forgotBtn.onclick = () => this.forgotPassword();
    }
=======
    // Bind events
    document.getElementById('signupForm').onsubmit = (e) => this.signup(e);
    document.getElementById('loginForm').onsubmit = (e) => this.login(e);
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
  }

  switchTab(tab) {
    const signupTab = document.getElementById('signupTab');
    const loginTab = document.getElementById('loginTab');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (tab === 'signup') {
      signupTab.style.color = '#667eea';
      signupTab.style.borderBottom = '2px solid #667eea';
      loginTab.style.color = '#6b7280';
      loginTab.style.borderBottom = 'none';
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    } else {
      loginTab.style.color = '#667eea';
      loginTab.style.borderBottom = '2px solid #667eea';
      signupTab.style.color = '#6b7280';
      signupTab.style.borderBottom = 'none';
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    }
  }

  async signup(e) {
    e.preventDefault();
<<<<<<< HEAD
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

=======
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });
      
<<<<<<< HEAD
      // Store user data
=======
      // Store user data for admin to see
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
      try {
        await firebase.firestore().collection('authUsers').doc(userCredential.user.uid).set({
          name: name,
          email: email,
          isAdmin: email === 'admin@nolazstore.com',
          signupDate: new Date().toISOString(),
          uid: userCredential.user.uid
        });
      } catch (dbError) {
        console.log('Could not store user data:', dbError);
      }
      
<<<<<<< HEAD
      // User is automatically signed in after signup
      // onAuthStateChanged will handle showing content
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please use the login form.');
        this.switchTab('login');
        document.getElementById('loginEmail').value = email;
      } else if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address.');
=======
      // Reload page to trigger auth state change
      location.reload();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already registered. Please login instead.');
        this.switchTab('login');
        document.getElementById('loginEmail').value = email;
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
      } else {
        alert('Signup failed: ' + error.message);
      }
    }
  }

  async login(e) {
    e.preventDefault();
<<<<<<< HEAD
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will handle showing content
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email. Please sign up first.');
        this.switchTab('signup');
        document.getElementById('signupEmail').value = email;
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many failed attempts. Please try again later.');
=======
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No account found. Please sign up first.');
        this.switchTab('signup');
        document.getElementById('signupEmail').value = email;
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  }

<<<<<<< HEAD
  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      // Store user data
      try {
        await firebase.firestore().collection('authUsers').doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          isAdmin: user.email === 'admin@nolazstore.com',
          signupDate: new Date().toISOString(),
          uid: user.uid,
          provider: 'google'
        });
      } catch (dbError) {
        console.log('Could not store user data:', dbError);
      }
      
      // onAuthStateChanged will handle showing content
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('Domain not authorized. Please use email/password login below.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup blocked. Please allow popups and try again.');
      } else {
        alert('Google sign-in failed: ' + error.message);
=======
  showContent() {
    // Content is already loaded, just hide auth screen
    this.addLogoutButton();
    this.showUserWelcome();
  }

  showUserWelcome() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userGreeting = document.getElementById('userGreeting');
      const userNameSpan = document.getElementById('userName');
      
      if (userGreeting && userNameSpan) {
        const displayName = user.displayName || user.email.split('@')[0];
        userNameSpan.textContent = displayName;
        userGreeting.style.display = 'inline';
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
      }
    }
  }

  async forgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
      alert('Please enter your email address first.');
      return;
    }
    
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email address.');
      } else {
        alert('Error sending reset email: ' + error.message);
      }
    }
  }

<<<<<<< HEAD
  showContent() {
    // Restore original page content by reloading
    if (document.body.innerHTML.includes('Welcome to Nolaz Store')) {
      location.reload();
    } else {
      this.addLogoutButton();
      this.showUserWelcome();
    }
  }

  addLogoutButton() {
    const headerActions = document.querySelector('.header-actions');
    
=======
  addLogoutButton() {
    // Add logout button to header if user is logged in
    const headerActions = document.querySelector('.header-actions');
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
    if (headerActions && !document.getElementById('logoutBtn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'btn';
      logoutBtn.style.marginLeft = '10px';
      logoutBtn.style.background = '#ef4444';
      logoutBtn.style.color = 'white';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = () => this.logout();
      headerActions.appendChild(logoutBtn);
    }
  }

<<<<<<< HEAD
  showUserWelcome() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userGreeting = document.getElementById('userGreeting');
      const userNameSpan = document.getElementById('userName');
      
      if (userGreeting && userNameSpan) {
        const displayName = user.displayName || user.email.split('@')[0];
        userNameSpan.textContent = displayName;
        userGreeting.style.display = 'inline';
=======
  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      // Try redirect method first (works better with domain authorization)
      await firebase.auth().signInWithRedirect(provider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('Domain not authorized. Please use email/password signup below or contact admin to authorize this domain in Firebase Console.');
      } else {
        alert('Google sign-in failed: ' + error.message);
>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
      }
    }
  }

<<<<<<< HEAD
=======
  // Handle redirect result
  async handleRedirectResult() {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (result.user) {
        const user = result.user;
        
        // Store user data for admin to see
        try {
          await firebase.firestore().collection('authUsers').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            isAdmin: user.email === 'admin@nolazstore.com',
            signupDate: new Date().toISOString(),
            uid: user.uid,
            provider: 'google'
          });
        } catch (dbError) {
          console.log('Could not store user data:', dbError);
        }
        
        location.reload();
      }
    } catch (error) {
      console.error('Redirect result error:', error);
    }
  }

>>>>>>> b8b7aab8030d883b3943e9dfd8361ccc59018302
  async logout() {
    try {
      await firebase.auth().signOut();
      location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

// Initialize
const simpleAuth = new SimpleAuth();