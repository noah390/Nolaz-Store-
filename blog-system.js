// Blog System with Firestore
class BlogSystem {
  constructor() {
    this.posts = [];
    this.init();
  }

  async init() {
    await this.loadPosts();
    this.renderBlog();
    this.bindEvents();
  }

  async loadPosts() {
    try {
      const postsRef = db.collection('blogPosts').orderBy('date', 'desc');
      const snapshot = await postsRef.get();
      this.posts = [];
      snapshot.forEach(doc => {
        this.posts.push({ id: doc.id, ...doc.data() });
      });
      
      if (this.posts.length === 0) {
        await this.createDefaultPosts();
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      this.posts = this.getDefaultPosts();
    }
  }

  async createDefaultPosts() {
    const defaultPosts = this.getDefaultPosts();
    for (const post of defaultPosts) {
      try {
        await db.collection('blogPosts').add(post);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
    await this.loadPosts();
  }

  getDefaultPosts() {
    return [
      {
        id: '1',
        title: 'Summer 2024: The Ultimate Fashion Guide',
        excerpt: 'Discover the hottest trends this summer season. From vibrant colors to minimalist designs, we\'ve curated the perfect pieces to elevate your wardrobe.',
        content: 'Summer fashion is all about embracing vibrant colors, lightweight fabrics, and versatile pieces that can take you from day to night. This season, we\'re seeing a beautiful blend of bold patterns and minimalist designs...',
        category: 'Fashion Trends',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=400&fit=crop',
        author: 'Nolaz Team',
        date: '2024-12-15',
        readTime: '5 min read',
        featured: true
      },
      {
        id: '2',
        title: 'Winter Wardrobe Essentials',
        excerpt: 'Stay warm and stylish this winter with our curated selection of must-have pieces.',
        content: 'Winter fashion doesn\'t have to be boring. With the right pieces, you can stay warm while looking effortlessly chic...',
        category: 'Style Guide',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop',
        author: 'Nolaz Team',
        date: '2024-12-12',
        readTime: '3 min read',
        featured: false
      },
      {
        id: '3',
        title: 'How to Mix and Match Accessories',
        excerpt: 'Learn the art of accessorizing to transform any basic outfit into a fashion statement.',
        content: 'Accessories are the secret weapon of every fashion enthusiast. They have the power to completely transform an outfit...',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
        author: 'Nolaz Team',
        date: '2024-12-10',
        readTime: '4 min read',
        featured: false
      }
    ];
  }

  renderBlog() {
    this.renderFeaturedPost();
    this.renderBlogPosts();
    this.renderSidebar();
  }

  renderFeaturedPost() {
    const featuredContainer = document.querySelector('.featured-post');
    if (!featuredContainer) return;

    const featured = this.posts.find(post => post.featured) || this.posts[0];
    
    featuredContainer.innerHTML = `
      <div class="featured-post-image">
        <img src="${featured.image}" alt="${featured.title}">
        <div class="post-category">${featured.category}</div>
      </div>
      <div class="featured-post-content">
        <h2>${featured.title}</h2>
        <p class="post-excerpt">${featured.excerpt}</p>
        <div class="post-meta">
          <span class="post-date">${this.formatDate(featured.date)}</span>
          <span class="post-author">By ${featured.author}</span>
          <span class="read-time">${featured.readTime}</span>
        </div>
        <a href="#" class="read-more-btn" onclick="blogSystem.showPost('${featured.id}')">Read Full Article</a>
      </div>
    `;
  }

  renderBlogPosts() {
    const postsContainer = document.querySelector('.posts-grid');
    if (!postsContainer) return;

    const regularPosts = this.posts.filter(post => !post.featured);
    
    postsContainer.innerHTML = regularPosts.map(post => `
      <article class="blog-post">
        <div class="post-image">
          <img src="${post.image}" alt="${post.title}">
          <div class="post-category">${post.category}</div>
        </div>
        <div class="post-content">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="post-meta">
            <span class="post-date">${this.formatDate(post.date)}</span>
            <span class="read-time">${post.readTime}</span>
          </div>
          <a href="#" class="read-more" onclick="blogSystem.showPost('${post.id}')">Read More →</a>
        </div>
      </article>
    `).join('');
  }

  renderSidebar() {
    // Update categories
    const categoryList = document.querySelector('.category-list');
    if (categoryList) {
      const categories = this.getCategoryCounts();
      categoryList.innerHTML = Object.entries(categories).map(([cat, count]) => `
        <li><a href="#" onclick="blogSystem.filterByCategory('${cat}')">${cat} <span>(${count})</span></a></li>
      `).join('');
    }

    // Update popular posts
    const popularPosts = document.querySelector('.popular-posts');
    if (popularPosts) {
      const recent = this.posts.slice(0, 3);
      popularPosts.innerHTML = recent.map(post => `
        <article class="mini-post" onclick="blogSystem.showPost('${post.id}')">
          <img src="${post.image}" alt="${post.title}">
          <div class="mini-post-content">
            <h4>${post.title}</h4>
            <span class="mini-date">${this.formatDate(post.date)}</span>
          </div>
        </article>
      `).join('');
    }
  }

  showPost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modalHTML = `
      <div id="postModal" class="modal" style="display: block;">
        <div class="modal-content post-modal">
          <div class="modal-header">
            <h3>${post.title}</h3>
            <span class="close" onclick="blogSystem.hidePost()">&times;</span>
          </div>
          <div class="post-full-content">
            <img src="${post.image}" alt="${post.title}" class="post-full-image">
            <div class="post-meta">
              <span class="post-category">${post.category}</span>
              <span class="post-date">${this.formatDate(post.date)}</span>
              <span class="post-author">By ${post.author}</span>
              <span class="read-time">${post.readTime}</span>
            </div>
            <div class="post-content-text">
              ${post.content}
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
  }

  hidePost() {
    const modal = document.getElementById('postModal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  }

  filterByCategory(category) {
    const filtered = this.posts.filter(post => post.category === category);
    // Update display with filtered posts
    this.showNotification(`Showing posts in ${category}`, 'info');
  }

  getCategoryCounts() {
    const counts = {};
    this.posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  bindEvents() {
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        this.subscribeNewsletter(email);
      });
    }
  }

  async subscribeNewsletter(email) {
    try {
      // Check if already subscribed
      const subscribersRef = db.collection('subscribers');
      const emailCheck = await subscribersRef.where('email', '==', email).get();
      
      if (!emailCheck.empty) {
        this.showNotification('Email already subscribed', 'info');
        return;
      }
      
      await subscribersRef.add({
        email,
        subscribedAt: new Date().toISOString()
      });
      
      this.showNotification('Successfully subscribed to newsletter!', 'success');
    } catch (error) {
      this.showNotification('Error subscribing to newsletter', 'error');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `blog-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Admin functions for blog management
  async addPost(postData) {
    try {
      const newPost = {
        ...postData,
        author: window.auth?.currentUser?.name || 'Admin',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      
      await db.collection('blogPosts').add(newPost);
      await this.loadPosts();
      this.renderBlog();
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  async editPost(postId, postData) {
    try {
      await db.collection('blogPosts').doc(postId).update(postData);
      await this.loadPosts();
      this.renderBlog();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      await db.collection('blogPosts').doc(postId).delete();
      await this.loadPosts();
      this.renderBlog();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}

// Initialize blog system
let blogSystem;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    blogSystem = new BlogSystem();
    window.blogSystem = blogSystem;
  });
} else {
  blogSystem = new BlogSystem();
  window.blogSystem = blogSystem;
}