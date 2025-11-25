// Home page functionality
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0jwvRkIPHLCwoOk0JC-01c3oP1bXTXB7zugyRW5ijxYlKTyQndXyTZ1h6M75fCqEGUySou8yOJ5C/pub?gid=0&single=true&output=csv';

// Load featured products (first 6 products)
async function loadFeaturedProducts() {
  const featuredEl = document.getElementById('featuredProducts');
  
  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('REPLACE_WITH')) {
    featuredEl.innerHTML = '<p>Loading products...</p>';
    return;
  }
  
  try {
    featuredEl.innerHTML = '<p>Loading featured products...</p>';
    
    const response = await fetch(SHEET_CSV_URL);
    const csvData = await response.text();
    const products = csvToArray(csvData);
    
    const activeProducts = products.filter(product => 
      product.name && 
      product.price && 
      (product.status || 'active').toLowerCase() !== 'inactive'
    ).slice(0, 6); // Get first 6 products
    
    window.productsData = activeProducts;
    
    if (activeProducts.length === 0) {
      featuredEl.innerHTML = '<p>No featured products available</p>';
      return;
    }
    
    featuredEl.innerHTML = '';
    activeProducts.forEach(product => {
      featuredEl.appendChild(createProductCard(product));
    });
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    featuredEl.innerHTML = '<p>Unable to load featured products</p>';
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

// Show product details (will be overridden by cart.js if loaded)
if (typeof showProductDetails === 'undefined') {
  function showProductDetails(productId) {
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
  }
}

// Add to cart function (will be overridden by cart.js if loaded)
if (typeof addToCart === 'undefined') {
  function addToCart(productId) {
    const product = window.productsData?.find(p => p.id === productId);
    if (!product) {
      alert('Product not found. Please try again.');
      return;
    }
    
    // Fallback if cart.js is not loaded
    const message = `Hello! I'd like to add this item to my cart:

${product.name}
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Product ID: ${product.id}

Please help me place an order.`;
    
    const whatsappUrl = `https://wa.me/2349046456469?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}

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