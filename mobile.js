// Mobile navigation functionality
function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('mobile-open');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('mainNav');
      nav.classList.remove('mobile-open');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
    }
  });
});