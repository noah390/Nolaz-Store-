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

// Load featured products from both Firebase and Google Sheets
async function loadFeaturedProducts() {
  const featuredEl = document.getElementById('featuredProducts') || document.getElementById('products');
  
  featuredEl.innerHTML = '<p>Loading featured products...</p>';
  
  let allProducts = [];
  
  // Load from Firebase Firestore
  try {
    if (window.db) {
      const firestoreSnapshot = await db.collection('products').get();
      firestoreSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.price && data.status !== 'inactive') {
          allProducts.push({
            id: doc.id,
            source: 'Firebase',
            ...data
          });
        }
      });
      console.log('Products loaded from Firebase:', allProducts.length);
    }
  } catch (error) {
    console.warn('Failed to load from Firebase:', error);
  }
  
  // Load from Google Sheets
  if (SHEET_CSV_URL && !SHEET_CSV_URL.includes('REPLACE_WITH')) {
    try {
      const response = await fetch(SHEET_CSV_URL);
      
      if (response.ok) {
        const csvData = await response.text();
        const sheetProducts = csvToArray(csvData);
        
        sheetProducts.forEach(product => {
          if (product.name && product.price && (product.status || 'active').toLowerCase() !== 'inactive') {
            allProducts.push({
              id: product.id || Date.now() + Math.random(),
              source: 'Google Sheets',
              ...product
            });
          }
        });
        
        console.log('Products loaded from Google Sheets:', sheetProducts.length);
      }
    } catch (error) {
      console.warn('Failed to load from Google Sheets:', error);
    }
  }
  
  // If no products loaded, use sample products
  if (allProducts.length === 0) {
    allProducts = getSampleProducts();
    console.log('Using sample featured products:', allProducts.length);
  }
  
  // Take first 6 products for featured section
  const featuredProducts = allProducts.slice(0, 6);
  window.productsData = allProducts; // Store all products globally
  
  if (featuredProducts.length === 0) {
    featuredEl.innerHTML = '<p>No featured products available</p>';
    return;
  }
  
  featuredEl.innerHTML = '';
  featuredProducts.forEach(product => {
    featuredEl.appendChild(createProductCard(product));
  });
  
  console.log('Total products loaded:', allProducts.length, 'Featured:', featuredProducts.length);
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

// Only define functions if they don't exist (cart.js takes priority)
if (typeof window.showProductDetails === 'undefined') {
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
}

if (typeof window.addToCart === 'undefined') {
  window.addToCart = function(productId) {
    console.log('Home.js addToCart fallback called for:', productId);
    const product = window.productsData?.find(p => p.id === productId);
    if (!product) {
      alert('Product not found. Please try again.');
      return;
    }
    
    const message = `Hello! I'd like to add this item to my cart:

${product.name}
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Product ID: ${product.id}

Please help me place an order.`;
    
    const whatsappUrl = `https://wa.me/2349046456469?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
}

// Wait for Firebase to initialize before loading products
if (window.firebase) {
  firebase.auth().onAuthStateChanged(() => {
    loadFeaturedProducts();
  });
} else {
  // Fallback if Firebase not available
  window.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
  });
}