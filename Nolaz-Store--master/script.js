// CONFIG - Replace these with your actual values
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0jwvRkIPHLCwoOk0JC-01c3oP1bXTXB7zugyRW5ijxYlKTyQndXyTZ1h6M75fCqEGUySou8yOJ5C/pub?gid=0&single=true&output=csv'; // Get this from Google Sheets: File > Share > Publish to web > CSV
const WHATSAPP_NUMBER = '2349046456469'; // Replace with your WhatsApp number (no + sign)

// Parse CSV data into JavaScript objects
function csvToArray(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines.shift().split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.map(line => {
    // Handle CSV with quoted fields
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

// Create product card HTML
function createProductCard(product) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const imageUrl = product.image || 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  
  div.innerHTML = `
    <div class="card-image">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      <div class="card-badge">New</div>
    </div>
    <div class="card-content">
      <h3>${product.name}</h3>
      <p class="desc">${product.description || 'No description available'}</p>
      <div class="price">${price}</div>
      <div class="actions">
        <button class="btn-buy" onclick="addToCart('${product.id}')">
          Add to Cart
        </button>
        <a class="btn-info" href="#" onclick="showProductDetails('${product.id}')">
          Details
        </a>
      </div>
    </div>
  `;
  
  return div;
}

// Generate WhatsApp link
function generateWhatsAppLink(product) {
  const message = `Hello! I'm interested in:

*${product.name}*
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Product ID: ${product.id}

Could you please provide more details?`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}



// Show loading state
function showLoading() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
      <div style="font-size: 24px; margin-bottom: 16px;">🔄</div>
      <p style="color: var(--muted);">Loading products...</p>
    </div>
  `;
}

// Show error state
function showError(message) {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
      <div style="font-size: 24px; margin-bottom: 16px;">⚠️</div>
      <p style="color: var(--muted); margin-bottom: 16px;">${message}</p>
      <button onclick="init()" class="btn">Try Again</button>
    </div>
  `;
}

// Show empty state
function showEmpty() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
      <div style="font-size: 24px; margin-bottom: 16px;">📦</div>
      <p style="color: var(--muted); margin-bottom: 16px;">No products available yet</p>
      <a href="admin.html" class="btn">Add Products</a>
    </div>
  `;
}

// Sample products for testing
function getSampleProducts() {
  return [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: '15000',
      description: 'Comfortable premium cotton t-shirt perfect for everyday wear',
      category: 'Clothing',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '2',
      name: 'Gold Chain Necklace',
      price: '45000',
      description: 'Elegant gold-plated chain necklace for special occasions',
      category: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '3',
      name: 'Designer Handbag',
      price: '35000',
      description: 'Stylish designer handbag made from premium materials',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      status: 'active'
    }
  ];
}

// Initialize the store
async function init() {
  const productsEl = document.getElementById('products');
  
  showLoading();
  
  let activeProducts = [];
  
  // Try to load from Google Sheets first
  if (SHEET_CSV_URL && !SHEET_CSV_URL.includes('REPLACE_WITH')) {
    try {
      const response = await fetch(SHEET_CSV_URL);
      
      if (response.ok) {
        const csvData = await response.text();
        const products = csvToArray(csvData);
        
        // Filter active products
        activeProducts = products.filter(product => 
          product.name && 
          product.price && 
          (product.status || 'active').toLowerCase() !== 'inactive'
        );
        
        console.log('Products loaded from Google Sheets:', activeProducts.length);
      }
    } catch (error) {
      console.warn('Failed to load from Google Sheets:', error);
    }
  }
  
  // If no products loaded, use sample products
  if (activeProducts.length === 0) {
    activeProducts = getSampleProducts();
    console.log('Using sample products:', activeProducts.length);
  }
  
  // Store products globally for cart and details
  window.productsData = activeProducts;
  
  if (activeProducts.length === 0) {
    showEmpty();
    return;
  }
  
  // Clear loading and add products
  productsEl.innerHTML = '';
  activeProducts.forEach(product => {
    productsEl.appendChild(createProductCard(product));
  });
  
  return activeProducts; // Return for filter setup
}

// Filter and sort functionality
function setupFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (categoryFilter) {
    // Populate categories
    const categories = [...new Set(window.productsData?.map(p => p.category).filter(Boolean))];
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    
    // Filter event
    categoryFilter.addEventListener('change', filterAndSort);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', filterAndSort);
  }
}

function filterAndSort() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const productsEl = document.getElementById('products');
  
  if (!window.productsData || !productsEl) return;
  
  let filteredProducts = [...window.productsData];
  
  // Filter by category
  if (categoryFilter && categoryFilter.value) {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
  }
  
  // Sort products
  if (sortFilter) {
    const sortValue = sortFilter.value;
    switch (sortValue) {
      case 'price-low':
        filteredProducts.sort((a, b) => parseInt(a.price || 0) - parseInt(b.price || 0));
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => parseInt(b.price || 0) - parseInt(a.price || 0));
        break;
      case 'name':
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }
  
  // Render filtered products
  productsEl.innerHTML = '';
  filteredProducts.forEach(product => {
    productsEl.appendChild(createProductCard(product));
  });
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  init().then(() => {
    setupFilters();
  });
  initializeSlider();
});

// Initialize image slider
let slideIndex = 1;

function initializeSlider() {
  showSlide(slideIndex);
  
  // Auto slide every 4 seconds
  setInterval(() => {
    slideIndex++;
    if (slideIndex > 3) slideIndex = 1;
    showSlide(slideIndex);
  }, 4000);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.nav-dot');
  
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].classList.add('active');
  }
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add('active');
  }
}