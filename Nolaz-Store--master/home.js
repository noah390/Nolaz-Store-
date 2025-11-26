// Home page functionality
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0jwvRkIPHLCwoOk0JC-01c3oP1bXTXB7zugyRW5ijxYlKTyQndXyTZ1h6M75fCqEGUySou8yOJ5C/pub?gid=0&single=true&output=csv';

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

// Load featured products (first 6 products)
async function loadFeaturedProducts() {
  const featuredEl = document.getElementById('featuredProducts') || document.getElementById('products');
  
  featuredEl.innerHTML = '<p>Loading featured products...</p>';
  
  let activeProducts = [];
  
  // Try to load from Google Sheets first
  if (SHEET_CSV_URL && !SHEET_CSV_URL.includes('REPLACE_WITH')) {
    try {
      const response = await fetch(SHEET_CSV_URL);
      
      if (response.ok) {
        const csvData = await response.text();
        const products = csvToArray(csvData);
        
        activeProducts = products.filter(product => 
          product.name && 
          product.price && 
          (product.status || 'active').toLowerCase() !== 'inactive'
        ).slice(0, 6); // Get first 6 products
        
        console.log('Featured products loaded from Google Sheets:', activeProducts.length);
      }
    } catch (error) {
      console.warn('Failed to load from Google Sheets:', error);
    }
  }
  
  // If no products loaded, use sample products
  if (activeProducts.length === 0) {
    activeProducts = getSampleProducts();
    console.log('Using sample featured products:', activeProducts.length);
  }
  
  window.productsData = activeProducts;
  
  if (activeProducts.length === 0) {
    featuredEl.innerHTML = '<p>No featured products available</p>';
    return;
  }
  
  featuredEl.innerHTML = '';
  activeProducts.forEach(product => {
    featuredEl.appendChild(createProductCard(product));
  });
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

// Create product card (same as main script but with Add to Cart)
function createProductCard(product) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const imageUrl = product.image || 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  
  div.innerHTML = `
    <div class="card-image">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      <div class="card-badge">Featured</div>
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

// Ensure global functions are available
window.showProductDetails = function(productId) {
  console.log('Home.js showProductDetails called for:', productId);
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    alert('Product details not available.');
    return;
  }
  
  const details = `Product Details:

Name: ${product.name}
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Description: ${product.description || 'No description'}
Category: ${product.category || 'Uncategorized'}
Product ID: ${product.id}

Contact us on WhatsApp for more information!`;
  
  alert(details);
};

window.addToCart = function(productId) {
  console.log('Home.js addToCart called for:', productId);
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) {
    alert('Product not found. Please try again.');
    return;
  }
  
  // Use cart if available, otherwise fallback to WhatsApp
  if (window.cart) {
    window.cart.addItem(product);
  } else {
    const message = `Hello! I'd like to add this item to my cart:

${product.name}
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Product ID: ${product.id}

Please help me place an order.`;
    
    const whatsappUrl = `https://wa.me/2349046456469?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
};

// Initialize when page loads
let slideIndex = 1;
let slideIndex2 = 1;

window.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  initializeSlider();
});

// Initialize image sliders
function initializeSlider() {
  let slideIndex = 1;
  let slideIndex2 = 1;
  
  showSlide(slideIndex);
  showSlide2(slideIndex2);
  
  // Auto slide every 4 seconds for first slider
  setInterval(() => {
    slideIndex++;
    if (slideIndex > 3) slideIndex = 1;
    showSlide(slideIndex);
  }, 4000);
  
  // Auto slide every 5 seconds for second slider
  setInterval(() => {
    slideIndex2++;
    if (slideIndex2 > 3) slideIndex2 = 1;
    showSlide2(slideIndex2);
  }, 5000);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function currentSlide2(n) {
  showSlide2(slideIndex2 = n);
}

function showSlide(n) {
  const sliders = document.querySelectorAll('.slider-section');
  const slides = sliders[0]?.querySelectorAll('.slide') || [];
  const dots = sliders[0]?.querySelectorAll('.nav-dot') || [];
  
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

function showSlide2(n) {
  const sliders = document.querySelectorAll('.slider-section');
  const slides = sliders[1]?.querySelectorAll('.slide') || [];
  const dots = sliders[1]?.querySelectorAll('.nav-dot') || [];
  
  if (n > slides.length) slideIndex2 = 1;
  if (n < 1) slideIndex2 = slides.length;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (slides[slideIndex2 - 1]) {
    slides[slideIndex2 - 1].classList.add('active');
  }
  if (dots[slideIndex2 - 1]) {
    dots[slideIndex2 - 1].classList.add('active');
  }
}