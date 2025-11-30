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
  
  const normalizedCategory = normalizeCategory(product.category);
  div.setAttribute('data-category', normalizedCategory);
  
  const imageUrl = product.image || 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  const categoryDisplay = normalizedCategory ? normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1) : 'Product';
  
  div.innerHTML = `
    <div class="card-image">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      <div class="card-badge" onclick="filterByCategory('${normalizedCategory}')">${categoryDisplay}</div>
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

// Filter by category when clicking product badge
function filterByCategory(category) {
  if (category) {
    window.location.href = `shop.html?category=${category}`;
  }
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
    // Clothing
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: '15000',
      description: 'Comfortable premium cotton t-shirt perfect for everyday wear',
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '2',
      name: 'Casual Denim Jeans',
      price: '25000',
      description: 'Classic blue denim jeans with modern fit',
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '8',
      name: 'Elegant Dress Shirt',
      price: '20000',
      description: 'Professional dress shirt for formal occasions',
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop',
      status: 'active'
    },
    // Jewelry
    {
      id: '3',
      name: 'Gold Chain Necklace',
      price: '45000',
      description: 'Elegant gold-plated chain necklace for special occasions',
      category: 'jewelry',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '4',
      name: 'Diamond Earrings',
      price: '65000',
      description: 'Sparkling diamond earrings perfect for any occasion',
      category: 'jewelry',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '9',
      name: 'Silver Bracelet',
      price: '30000',
      description: 'Stylish silver bracelet with modern design',
      category: 'jewelry',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
      status: 'active'
    },
    // Shoes
    {
      id: '5',
      name: 'Running Sneakers',
      price: '35000',
      description: 'Comfortable running sneakers for daily activities',
      category: 'shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '10',
      name: 'Formal Leather Shoes',
      price: '50000',
      description: 'Premium leather shoes for business and formal events',
      category: 'shoes',
      image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=300&fit=crop',
      status: 'active'
    },
    // Bags
    {
      id: '6',
      name: 'Designer Handbag',
      price: '40000',
      description: 'Stylish designer handbag made from premium materials',
      category: 'bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '11',
      name: 'Leather Backpack',
      price: '32000',
      description: 'Durable leather backpack perfect for work and travel',
      category: 'bags',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
      status: 'active'
    },
    // Electronics
    {
      id: '7',
      name: 'Wireless Headphones',
      price: '55000',
      description: 'High-quality wireless headphones with noise cancellation',
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '12',
      name: 'Smartphone Case',
      price: '8000',
      description: 'Protective smartphone case with elegant design',
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
      status: 'active'
    }
  ];
}

// Initialize the store with both Firebase and Google Sheets
async function init() {
  const productsEl = document.getElementById('products');
  
  showLoading();
  
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
            category: normalizeCategory(data.category),
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
        
        // Filter active products and normalize categories
        sheetProducts.forEach(product => {
          if (product.name && product.price && (product.status || 'active').toLowerCase() !== 'inactive') {
            allProducts.push({
              id: product.id || Date.now() + Math.random(),
              source: 'Google Sheets',
              category: normalizeCategory(product.category),
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
    console.log('Using sample products:', allProducts.length);
  }
  
  // Store products globally for cart and details
  window.productsData = allProducts;
  
  if (allProducts.length === 0) {
    showEmpty();
    return;
  }
  
  // Clear loading and add products
  productsEl.innerHTML = '';
  allProducts.forEach(product => {
    productsEl.appendChild(createProductCard(product));
  });
  
  console.log('Total products loaded:', allProducts.length);
  return allProducts; // Return for filter setup
}

// Normalize category names to match expected format
function normalizeCategory(category) {
  if (!category) return '';
  
  const normalized = category.toLowerCase().trim();
  
  // Map common variations to standard categories
  const categoryMap = {
    'clothes': 'clothing',
    'cloth': 'clothing',
    'apparel': 'clothing',
    'fashion': 'clothing',
    'jewellery': 'jewelry',
    'jewelery': 'jewelry',
    'accessories': 'jewelry',
    'shoe': 'shoes',
    'footwear': 'shoes',
    'sneakers': 'shoes',
    'bag': 'bags',
    'handbag': 'bags',
    'handbags': 'bags',
    'purse': 'bags',
    'purses': 'bags',
    'electronic': 'electronics',
    'tech': 'electronics',
    'gadget': 'electronics',
    'gadgets': 'electronics'
  };
  
  return categoryMap[normalized] || normalized;
}

// Filter and sort functionality
function setupFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  
  // Setup category filter events
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndSort);
  }
  
  // Setup sort filter
  if (sortFilter) {
    sortFilter.addEventListener('change', filterAndSort);
  }
  
  // Setup search functionality (only on shop page)
  if (searchInput && window.location.pathname.includes('shop.html')) {
    searchInput.addEventListener('input', filterAndSort);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  if (searchBtn && window.location.pathname.includes('shop.html')) {
    searchBtn.addEventListener('click', handleSearch);
  }
}

// Handle search functionality
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  // If on shop page, filter products
  if (window.location.pathname.includes('shop.html')) {
    filterAndSort();
    return;
  }
  
  // If on other pages, redirect to shop with search
  if (searchTerm) {
    window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
  } else {
    window.location.href = 'shop.html';
  }
}

function filterAndSort() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');
  const productsEl = document.getElementById('products');
  
  if (!window.productsData || !productsEl) return;
  
  let filteredProducts = [...window.productsData];
  
  // Filter by category
  if (categoryFilter && categoryFilter.value) {
    const selectedCategory = categoryFilter.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => {
      const productCategory = normalizeCategory(p.category);
      return productCategory === selectedCategory;
    });
  }
  
  // Filter by search term
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm)) ||
      (p.category && normalizeCategory(p.category).toLowerCase().includes(searchTerm))
    );
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
  if (filteredProducts.length === 0) {
    productsEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <div style="font-size: 24px; margin-bottom: 16px;">🔍</div>
        <p style="color: var(--text-muted);">No products found matching your criteria</p>
        <button onclick="clearFilters()" class="btn" style="margin-top: 16px;">Clear Filters</button>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 8px;">Available categories: ${getAvailableCategories().join(', ')}</p>
      </div>
    `;
  } else {
    filteredProducts.forEach(product => {
      productsEl.appendChild(createProductCard(product));
    });
  }
}

// Get available categories for debugging
function getAvailableCategories() {
  if (!window.productsData) return [];
  return [...new Set(window.productsData.map(p => normalizeCategory(p.category)).filter(Boolean))];
}

// Clear all filters
function clearFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  
  if (categoryFilter) categoryFilter.value = '';
  if (searchInput) searchInput.value = '';
  
  filterAndSort();
}

// Show product details
function showProductDetails(productId) {
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  const detailsContainer = document.getElementById('productDetails');
  
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  const categoryDisplay = product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Product';
  
  detailsContainer.innerHTML = `
    <div class="product-detail-content">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <div class="product-category">${categoryDisplay}</div>
        <h2>${product.name}</h2>
        <div class="product-price">${price}</div>
        <p class="product-description">${product.description || 'No description available'}</p>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart('${product.id}'); closeProductModal();">Add to Cart</button>
          <button class="btn btn-success" onclick="contactWhatsApp('${product.id}')">Contact via WhatsApp</button>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
}

// Close product modal
function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
}

// Contact via WhatsApp
function contactWhatsApp(productId) {
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) return;
  
  const whatsappLink = generateWhatsAppLink(product);
  window.open(whatsappLink, '_blank');
}

// Make category cards clickable on homepage
function setupCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const categoryName = card.querySelector('h4').textContent.toLowerCase();
      window.location.href = `shop.html?category=${categoryName}`;
    });
  });
}

// Handle URL parameters for category filtering
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const search = urlParams.get('search');
  
  if (category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.value = category;
    }
  }
  
  if (search) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = decodeURIComponent(search);
    }
  }
  
  setTimeout(() => {
    filterAndSort();
  }, 100);
}

// Wait for Firebase to initialize before loading products
if (window.firebase) {
  firebase.auth().onAuthStateChanged(() => {
    init().then(() => {
      setupFilters();
      
      // Setup category cards on homepage
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        setTimeout(setupCategoryCards, 100);
        // Show only featured products from different categories on homepage
        setTimeout(showFeaturedProducts, 200);
      }
      
      // Handle URL parameters on shop page
      if (window.location.pathname.includes('shop.html')) {
        setTimeout(handleUrlParams, 200);
      }
      
      // Setup modal events
      setupModalEvents();
    });
  });
} else {
  // Fallback if Firebase not available
  window.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
      setupFilters();
      
      // Setup category cards on homepage
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        setTimeout(setupCategoryCards, 100);
        // Show only featured products from different categories on homepage
        setTimeout(showFeaturedProducts, 200);
      }
      
      // Handle URL parameters on shop page
      if (window.location.pathname.includes('shop.html')) {
        setTimeout(handleUrlParams, 200);
      }
      
      // Setup modal events
      setupModalEvents();
    });
  });
}

// Slider initialization handled by individual pages

// Show featured products from different categories on homepage
function showFeaturedProducts() {
  if (!window.productsData || window.location.pathname.includes('shop.html')) return;
  
  const productsEl = document.getElementById('products');
  if (!productsEl) return;
  
  // Get one product from each category for homepage
  const categories = ['clothing', 'jewelry', 'shoes', 'bags', 'electronics'];
  const featuredProducts = [];
  
  categories.forEach(category => {
    const categoryProduct = window.productsData.find(p => normalizeCategory(p.category) === category);
    if (categoryProduct) {
      featuredProducts.push(categoryProduct);
    }
  });
  
  // If we don't have enough featured products, add more
  if (featuredProducts.length < 6) {
    const remaining = window.productsData.filter(p => !featuredProducts.includes(p)).slice(0, 6 - featuredProducts.length);
    featuredProducts.push(...remaining);
  }
  
  // Clear and add featured products
  productsEl.innerHTML = '';
  featuredProducts.slice(0, 6).forEach(product => {
    productsEl.appendChild(createProductCard(product));
  });
  
  // Debug: Log available categories
  console.log('Available categories in data:', getAvailableCategories());
}

// Setup modal events
function setupModalEvents() {
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    const productModal = document.getElementById('productModal');
    
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
    if (e.target === productModal) {
      productModal.style.display = 'none';
    }
  });
}

// Slider functions handled by individual pages