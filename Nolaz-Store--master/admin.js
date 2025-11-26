// ADMIN CONFIG - Replace with your actual values
const ADMIN_PASSWORD = 'Admin54321'; // Change this to your desired admin password
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby54bsDXUMXHRy5ClElrry_LIUmeABe9g5Uvzc90pitmWyT5UIImCQZnUYNxgu13r8WkA/exec'; // Get this from Google Apps Script deployment
const CLOUDINARY_CLOUD_NAME = 'da6jkfeju'; // Your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'Products'; // Your Cloudinary upload preset
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0jwvRkIPHLCwoOk0JC-01c3oP1bXTXB7zugyRW5ijxYlKTyQndXyTZ1h6M75fCqEGUySou8yOJ5C/pub?gid=0&single=true&output=csv'; // Get this from Google Sheets: File > Share > Publish to web > CSV


// DOM elements
const loginPanel = document.getElementById('loginPanel');
const adminArea = document.getElementById('adminArea');
const adminPass = document.getElementById('adminPass');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const productForm = document.getElementById('productForm');
const statusEl = document.getElementById('status');
const addProductBtn = document.getElementById('addProductBtn');
const viewProductsBtn = document.getElementById('viewProductsBtn');
const addProductSection = document.getElementById('addProductSection');
const viewProductsSection = document.getElementById('viewProductsSection');
const liveVisitorsSection = document.getElementById('liveVisitorsSection');
const liveVisitorsBtn = document.getElementById('liveVisitorsBtn');

// Check if already logged in
if (localStorage.getItem('nolazAdminLoggedIn') === 'true') {
  showAdminArea();
}

// Login functionality
loginBtn.addEventListener('click', () => {
  if (adminPass.value === ADMIN_PASSWORD) {
    localStorage.setItem('nolazAdminLoggedIn', 'true');
    showAdminArea();
  } else {
    showStatus('Invalid password', 'error');
  }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('nolazAdminLoggedIn');
  showLoginPanel();
});

// Navigation
addProductBtn.addEventListener('click', () => {
  resetForm();
  addProductSection.style.display = 'block';
  viewProductsSection.style.display = 'none';
  liveVisitorsSection.style.display = 'none';
  addProductBtn.classList.add('btn-success');
  viewProductsBtn.classList.remove('btn-success');
  liveVisitorsBtn.classList.remove('btn-success');
  clearStatus();
});

viewProductsBtn.addEventListener('click', () => {
  addProductSection.style.display = 'none';
  viewProductsSection.style.display = 'block';
  liveVisitorsSection.style.display = 'none';
  viewProductsBtn.classList.add('btn-success');
  addProductBtn.classList.remove('btn-success');
  liveVisitorsBtn.classList.remove('btn-success');
  loadProducts();
});

liveVisitorsBtn.addEventListener('click', () => {
  addProductSection.style.display = 'none';
  viewProductsSection.style.display = 'none';
  liveVisitorsSection.style.display = 'block';
  liveVisitorsBtn.classList.add('btn-success');
  addProductBtn.classList.remove('btn-success');
  viewProductsBtn.classList.remove('btn-success');
  loadLiveVisitors();
});

// Enter key login
adminPass.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

// Form submission
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value.trim();
  const status = document.getElementById('status').value;
  const file = document.getElementById('imageFile').files[0];
  
  if (!name || !price) {
    showStatus('Product name and price are required', 'error');
    return;
  }
  
  // Test connection first
  if (!await testConnection()) {
    showStatus('Unable to connect to Google Sheets. Please check configuration.', 'error');
    return;
  }
  
  try {
    showStatus('Processing...', 'info');
    
    let imageUrl = window.currentProductImage || '';
    
    // Upload image to Cloudinary if new file provided
    if (file) {
      if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.includes('REPLACE_WITH')) {
        showStatus('Image upload not configured', 'info');
        return;
      }
      
      showStatus('Uploading image...', 'info');
      imageUrl = await uploadImage(file);
    }
    
    // Create product object
    const product = {
      id: window.editingProductId || Date.now().toString(),
      name,
      price: parseInt(price),
      description,
      category,
      image: imageUrl,
      status,
      action: window.editingProductId ? 'update' : 'add'
    };
    
    // Save to Google Sheets
    showStatus('Saving product...', 'info');
    await saveProduct(product);
    
    const action = window.editingProductId ? 'updated' : 'added';
    showStatus(`Product ${action} successfully!`, 'success');
    resetForm();
    
  } catch (error) {
    console.error('Error adding product:', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
});

// Upload image to Cloudinary
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Image upload failed');
  }
  
  const data = await response.json();
  return data.secure_url;
}

// Save product to Google Sheets
async function saveProduct(product) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.status !== 'ok') {
    throw new Error(data.error || 'Failed to save product');
  }
}

// Load and display products
async function loadProducts() {
  const productsTable = document.getElementById('productsTable');
  
  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('REPLACE_WITH')) {
    productsTable.innerHTML = '<p>Loading products...</p>';
    return;
  }
  
  try {
    productsTable.innerHTML = 'Loading products...';
    
    const response = await fetch(SHEET_CSV_URL);
    const csvData = await response.text();
    const products = csvToArray(csvData);
    
    if (products.length === 0) {
      productsTable.innerHTML = '<p>No products found</p>';
      return;
    }
    
    // Create table
    let tableHTML = `
      <table class="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    products.forEach(product => {
      const imageHTML = product.image ? 
        `<img src="${product.image}" alt="${product.name}">` : 
        '<div style="width:60px;height:60px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#9ca3af;">No Image</div>';
      
      const statusBadge = product.status === 'active' ? 
        '<span style="background:#d1fae5;color:#065f46;padding:4px 8px;border-radius:4px;font-size:12px;">Active</span>' :
        '<span style="background:#fee2e2;color:#991b1b;padding:4px 8px;border-radius:4px;font-size:12px;">Inactive</span>';
      
      tableHTML += `
        <tr>
          <td data-label="Image">${imageHTML}</td>
          <td data-label="Name">${product.name}</td>
          <td data-label="Price">₦${parseInt(product.price || 0).toLocaleString()}</td>
          <td data-label="Category">${product.category || '-'}</td>
          <td data-label="Status">${statusBadge}</td>
          <td data-label="Actions">
            <button class="btn btn-small" onclick="editProduct('${product.id}')" style="background:#3b82f6;">Edit</button>
            <button class="btn btn-small" onclick="deleteProduct('${product.id}', '${product.name}')" style="background:#ef4444;">Delete</button>
          </td>
        </tr>
      `;
    });
    
    tableHTML += '</tbody></table>';
    productsTable.innerHTML = tableHTML;
    
  } catch (error) {
    console.error('Error loading products:', error);
    productsTable.innerHTML = '<p>Error loading products</p>';
  }
}

// Parse CSV (same as main script)
function csvToArray(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines.shift().split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.map(line => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim());
    
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || '').replace(/"/g, '');
    });
    return obj;
  });
}

// Edit product
function editProduct(productId) {
  const product = window.allProducts?.find(p => p.id === productId);
  if (!product) {
    showStatus('Product not found', 'error');
    return;
  }
  
  // Switch to add product section and populate form
  addProductSection.style.display = 'block';
  viewProductsSection.style.display = 'none';
  addProductBtn.classList.add('btn-success');
  viewProductsBtn.classList.remove('btn-success');
  
  // Populate form with existing data
  document.getElementById('name').value = product.name || '';
  document.getElementById('price').value = product.price || '';
  document.getElementById('description').value = product.description || '';
  document.getElementById('category').value = product.category || '';
  document.getElementById('status').value = product.status || 'active';
  
  // Show current image if exists
  const currentImageDiv = document.getElementById('currentImage');
  const currentImagePreview = document.getElementById('currentImagePreview');
  if (product.image) {
    currentImagePreview.src = product.image;
    currentImageDiv.style.display = 'block';
  } else {
    currentImageDiv.style.display = 'none';
  }
  
  // Store product ID and current image for editing
  window.editingProductId = productId;
  window.currentProductImage = product.image || '';
  
  // Change button text
  const submitBtn = document.querySelector('#productForm button[type="submit"]');
  submitBtn.textContent = 'Update Product';
  
  showStatus('Editing product. Update the fields and click "Update Product".', 'info');
}

// Delete product
async function deleteProduct(productId, productName) {
  if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
    return;
  }
  
  try {
    showStatus('Deleting product...', 'info');
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'delete',
        id: productId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'ok') {
      showStatus('Product deleted successfully!', 'success');
      loadProducts(); // Refresh the table
    } else {
      throw new Error(data.error || 'Failed to delete product');
    }
    
  } catch (error) {
    console.error('Error deleting product:', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
}

// Reset form for adding new product
function resetForm() {
  productForm.reset();
  window.editingProductId = null;
  window.currentProductImage = null;
  document.getElementById('currentImage').style.display = 'none';
  const submitBtn = document.querySelector('#productForm button[type="submit"]');
  submitBtn.textContent = 'Add Product';
}

// Show/hide panels
function showAdminArea() {
  loginPanel.style.display = 'none';
  adminArea.style.display = 'block';
  clearStatus();
}

function showLoginPanel() {
  loginPanel.style.display = 'block';
  adminArea.style.display = 'none';
  adminPass.value = '';
  clearStatus();
}

// Status messages
function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status-${type}`;
  statusEl.style.display = 'block';
}

function clearStatus() {
  statusEl.textContent = '';
  statusEl.className = '';
  statusEl.style.display = 'none';
}

// Test connection to Google Apps Script
async function testConnection() {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      mode: 'cors'
    });
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

// Initialize admin panel
function initAdmin() {
  // Load products data for editing
  window.allProducts = [];
  
  // Test configuration on load
  if (localStorage.getItem('nolazAdminLoggedIn') === 'true') {
    testConnection().then(connected => {
      if (connected) {
        console.log('✅ Google Apps Script connection successful');
      } else {
        console.warn('⚠️ Google Apps Script connection failed');
      }
    });
  }
}

// Load and display live visitors
function loadLiveVisitors() {
  const visitorsTable = document.getElementById('visitorsTable');
  const visitorCount = document.getElementById('visitorCount');
  const onlineCount = document.getElementById('onlineCount');
  const todayCount = document.getElementById('todayCount');
  const totalCount = document.getElementById('totalCount');
  
  try {
    const liveVisitors = JSON.parse(localStorage.getItem('nolazLiveVisitors') || '[]');
    const allVisitors = JSON.parse(localStorage.getItem('nolazVisitors') || '[]');
    
    // Filter visitors from today
    const today = new Date().toDateString();
    const todayVisitors = allVisitors.filter(v => new Date(v.timestamp).toDateString() === today);
    
    // Update counts
    visitorCount.textContent = liveVisitors.length;
    onlineCount.textContent = liveVisitors.length;
    todayCount.textContent = todayVisitors.length;
    totalCount.textContent = allVisitors.length;
    
    if (liveVisitors.length === 0) {
      visitorsTable.innerHTML = '<p>No visitors currently online</p>';
      return;
    }
    
    // Create table
    let tableHTML = `
      <table class="products-table">
        <thead>
          <tr>
            <th>Visitor ID</th>
            <th>Page</th>
            <th>Device</th>
            <th>Browser</th>
            <th>Location</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    liveVisitors.forEach(visitor => {
      const timeAgo = getTimeAgo(visitor.timestamp);
      const isActive = new Date() - new Date(visitor.timestamp) < 60000; // Active if last seen < 1 min
      
      tableHTML += `
        <tr>
          <td data-label="Visitor ID">${visitor.id.substring(0, 12)}...</td>
          <td data-label="Page">${visitor.page}</td>
          <td data-label="Device">${visitor.device}</td>
          <td data-label="Browser">${visitor.browser}</td>
          <td data-label="Location">${visitor.country || 'Unknown'}</td>
          <td data-label="Time">${timeAgo}</td>
          <td data-label="Status">
            <span style="color: ${isActive ? '#10b981' : '#f59e0b'}; font-weight: bold;">
              ${isActive ? '🟢 Active' : '🟡 Idle'}
            </span>
          </td>
        </tr>
      `;
    });
    
    tableHTML += '</tbody></table>';
    visitorsTable.innerHTML = tableHTML;
    
  } catch (error) {
    console.error('Error loading visitors:', error);
    visitorsTable.innerHTML = '<p>Error loading visitor data</p>';
  }
}

// Get time ago string
function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Auto-refresh visitors every 10 seconds
setInterval(() => {
  if (liveVisitorsSection && liveVisitorsSection.style.display === 'block') {
    loadLiveVisitors();
  }
}, 10000);

// Call init when page loads
window.addEventListener('DOMContentLoaded', initAdmin);