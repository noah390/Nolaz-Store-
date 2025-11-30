// Authentication System with Firestore
class AuthSystem {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('nolazUser')) || null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showAuthModal());
    }
  }

  showAuthModal() {
    const modalHTML = `
      <div id="authModal" class="modal" style="display: block;">
        <div class="modal-content auth-modal">
          <div class="modal-header">
            <h3 id="authTitle">Login to Your Account</h3>
            <span class="close" onclick="auth.hideAuthModal()">&times;</span>
          </div>
          <div class="auth-content">
            <div class="auth-tabs">
              <button class="auth-tab active" onclick="auth.switchTab('login')">Login</button>
              <button class="auth-tab" onclick="auth.switchTab('signup')">Sign Up</button>
            </div>
            
            <form id="loginForm" class="auth-form">
              <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" required>
              </div>
              <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" required>
              </div>
              <button type="submit" class="btn btn-primary auth-submit">Login</button>
            </form>

            <form id="signupForm" class="auth-form" style="display: none;">
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
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" required>
              </div>
              <button type="submit" class="btn btn-primary auth-submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Bind form events
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });
    
    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.signup();
    });
  }

  hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  }

  switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const title = document.getElementById('authTitle');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.style.display = 'none');
    
    if (tab === 'login') {
      tabs[0].classList.add('active');
      document.getElementById('loginForm').style.display = 'block';
      title.textContent = 'Login to Your Account';
    } else {
      tabs[1].classList.add('active');
      document.getElementById('signupForm').style.display = 'block';
      title.textContent = 'Create New Account';
    }
  }

  async login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).where('password', '==', password).get();
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        this.currentUser = { 
          id: snapshot.docs[0].id, 
          ...userData,
          isAdmin: userData.email === 'admin@nolazstore.com'
        };
        localStorage.setItem('nolazUser', JSON.stringify(this.currentUser));
        this.hideAuthModal();
        this.updateUI();
        this.showNotification('Login successful!', 'success');
      } else {
        this.showNotification('Invalid email or password', 'error');
      }
    } catch (error) {
      this.showNotification('Login failed', 'error');
    }
  }

  async signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }
    
    try {
      // Check if email exists
      const usersRef = db.collection('users');
      const emailCheck = await usersRef.where('email', '==', email).get();
      
      if (!emailCheck.empty) {
        this.showNotification('Email already exists', 'error');
        return;
      }
      
      // Create new user
      const newUser = {
        name,
        email,
        password,
        isAdmin: email === 'admin@nolazstore.com',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await usersRef.add(newUser);
      this.currentUser = { id: docRef.id, ...newUser };
      localStorage.setItem('nolazUser', JSON.stringify(this.currentUser));
      
      this.hideAuthModal();
      this.updateUI();
      this.showNotification('Account created successfully!', 'success');
    } catch (error) {
      this.showNotification('Signup failed', 'error');
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('nolazUser');
    this.updateUI();
    this.showNotification('Logged out successfully', 'success');
  }

  updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    if (this.currentUser) {
      loginBtn.textContent = this.currentUser.name;
      loginBtn.onclick = () => this.showUserMenu();
    } else {
      loginBtn.textContent = 'Login';
      loginBtn.onclick = () => this.showAuthModal();
    }
  }

  showUserMenu() {
    const menuHTML = `
      <div id="userMenu" class="user-menu">
        <div class="user-info">
          <strong>${this.currentUser.name}</strong>
          <span>${this.currentUser.email}</span>
        </div>
        ${this.currentUser.isAdmin ? '<button onclick="window.location.href=\'blog-admin.html\'">Manage Blog</button>' : ''}
        <button onclick="auth.logout(); document.getElementById('userMenu').remove();">Logout</button>
      </div>
    `;
    
    // Remove existing menu
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) existingMenu.remove();
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    // Close menu when clicking outside
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

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin;
  }
}

// Initialize auth system
const auth = new AuthSystem();
window.auth = auth;