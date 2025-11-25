// Home page functionality
const SHEET_CSV_URL = 'REPLACE_WITH_YOUR_PUBLISHED_CSV_URL';

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
    <img src="${imageUrl}" alt="${product.name}" loading="lazy">
    <div class="card-content">
      <h3>${product.name}</h3>
      <p class="desc">${product.description || 'No description available'}</p>
      <div class="price">${price}</div>
      <div class="actions">
        <button class="btn-buy" onclick="addToCart('${product.id}')">
          🛒 Add to Cart
        </button>
        <a class="btn-info" href="#" onclick="showProductDetails('${product.id}')">
          ℹ️ Details
        </a>
      </div>
    </div>
  `;
  
  return div;
}

// Show product details
function showProductDetails(productId) {
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) return;
  
  const details = `
Product Details:

📦 Name: ${product.name}
💰 Price: ₦${parseInt(product.price || 0).toLocaleString()}
📝 Description: ${product.description || 'No description'}
🏷️ Category: ${product.category || 'Uncategorized'}
🆔 Product ID: ${product.id}

Contact us on WhatsApp for more information!
  `;
  
  alert(details);
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', loadFeaturedProducts);