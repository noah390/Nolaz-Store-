// Authentication Guard - Require login for website access
class AuthGuard {
  constructor() {
    this.init();
  }

  init() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Allow access to admin panel
    if (currentPage === 'admin-unified.html' || currentPage === 'admin.html') {
      return;
    }
    
    // Store original content before Firebase loads
    this.originalContent = document.body.innerHTML;
    
    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        
        const currentUser = {
          uid: user.uid,
          name: user.displayName || userData.name,
          email: user.email,
          isAdmin: userData.isAdmin || false
        };
        
        localStorage.setItem('nolazUser', JSON.stringify(currentUser));
        this.restoreOriginalContent();
        this.setupLoggedInUI();
      } else {
        // User is signed out
        localStorage.removeItem('nolazUser');
        this.showLoginRequired();
      }
    });
  }

  showLoginRequired() {
    document.body.innerHTML = `
      <div class="auth-required">
        <div class="auth-required-content">
          <h1>Welcome to Nolaz Store</h1>
          <p>Please sign up or login to access our fashion collection</p>
          <div class="auth-buttons">
            <button onclick="authGuard.showAuthModal()" class="btn btn-primary">Sign Up / Login</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.style.display = 'block';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .auth-required {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Inter', sans-serif;
      }
      .auth-required-content {
        text-align: center;
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        max-width: 400px;
      }
      .auth-required h1 {
        margin: 0 0 1rem;
        color: #1f2937;
        font-size: 2rem;
      }
      .auth-required p {
        margin: 0 0 2rem;
        color: #6b7280;
        line-height: 1.6;
      }
      .btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .btn:hover {
        background: #5a67d8;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  }

  restoreOriginalContent() {
    if (this.originalContent) {
      document.body.innerHTML = this.originalContent;
      document.body.style.display = 'block';
    }
  }

  showAuthModal() {
    const modalHTML = `
      <div id="authModal" class="modal" style="display: block;">
        <div class="modal-content auth-modal">
          <div class="modal-header">
            <h3 id="authTitle">Join Nolaz Store</h3>
          </div>
          <div class="auth-content">
            <div class="auth-tabs">
              <button class="auth-tab active" onclick="authGuard.switchTab('signup')">Sign Up</button>
              <button class="auth-tab" onclick="authGuard.switchTab('login')">Login</button>
            </div>
            
            <form id="signupForm" class="auth-form">
              <div class="form-group">
                <label for="signupName">Full Name</label>
                <input type="text" id="signupName" required>
              </div>
              <div class="form-group">
                <label for="signupEmail">Email</label>
                <input type="email" id="signupEmail" required>
              </div>
              <div class="form-group">
                <label for="signupPassword">Password</label>
                <input type="password" id="signupPassword" required>
              </div>
              <button type="submit" class="btn btn-primary">Create Account</button>
            </form>

            <form id="loginForm" class="auth-form" style="display: none;">
              <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" required>
              </div>
              <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
      }
      .modal-content {
        background: white;
        margin: 5% auto;
        padding: 0;
        border-radius: 1rem;
        width: 90%;
        max-width: 400px;
      }
      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .modal-header h3 {
        margin: 0;
        font-size: 1.5rem;
        color: #1f2937;
      }
      .auth-content {
        padding: 1.5rem;
      }
      .auth-tabs {
        display: flex;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .auth-tab {
        flex: 1;
        padding: 0.75rem;
        border: none;
        background: none;
        cursor: pointer;
        font-weight: 600;
        color: #6b7280;
      }
      .auth-tab.active {
        color: #667eea;
        border-bottom: 2px solid #667eea;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
      }
      .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .form-group input:focus {
        outline: none;
        border-color: #667eea;
      }
    `;
    document.head.appendChild(style);
    
    // Bind events
    document.getElementById('signupForm').onsubmit = (e) => this.signup(e);
    document.getElementById('loginForm').onsubmit = (e) => this.login(e);
  }

  switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const title = document.getElementById('authTitle');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.style.display = 'none');
    
    if (tab === 'signup') {
      tabs[0].classList.add('active');
      document.getElementById('signupForm').style.display = 'block';
      title.textContent = 'Join Nolaz Store';
    } else {
      tabs[1].classList.add('active');
      document.getElementById('loginForm').style.display = 'block';
      title.textContent = 'Welcome Back';
    }
  }

  async signup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      await user.updateProfile({ displayName: name });
      
      await db.collection('users').doc(user.uid).set({
        name,
        email,
        isAdmin: email === 'admin@nolazstore.com',
        createdAt: new Date().toISOString()
      });
      
      window.location.reload();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please use the Login tab instead.');
        this.switchTab('login');
        document.getElementById('loginEmail').value = email;
      } else {
        alert('Signup failed: ' + error.message);
      }
    }
  }

  async login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.reload();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email. Please sign up first.');
        this.switchTab('signup');
        document.getElementById('signupEmail').value = email;
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  }

  setupLoggedInUI() {
    // User is logged in, setup normal UI
    const user = JSON.parse(localStorage.getItem('nolazUser'));
    
    // Update login button to show user name
    setTimeout(() => {
      const loginBtn = document.getElementById('loginBtn');
      if (loginBtn && user) {
        loginBtn.textContent = user.name;
        loginBtn.onclick = () => this.showUserMenu(user);
      }
    }, 100);
  }

  showUserMenu(user) {
    const menuHTML = `
      <div id="userMenu" class="user-menu">
        <div class="user-info">
          <strong>${user.name}</strong>
          <span>${user.email}</span>
        </div>
        ${user.isAdmin ? '<button onclick="window.location.href=\'admin-unified.html\'">Admin Panel</button>' : ''}
        <button onclick="authGuard.logout()">Logout</button>
      </div>
    `;
    
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) existingMenu.remove();
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('#userMenu') && !e.target.closest('#loginBtn')) {
          const menu = document.getElementById('userMenu');
          if (menu) menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  async logout() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

// Initialize auth guard
const authGuard = new AuthGuard();
window.authGuard = authGuard;