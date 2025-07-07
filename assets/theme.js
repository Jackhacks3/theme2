/**
 * AI Translation Earbuds Theme - Main JavaScript
 * Handles animations, interactions, and Shopify integration
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('AI Translation Earbuds Theme Loaded');
  
  // Initialize all components
  initAnimations();
  initIntersectionObserver();
  initSmoothScroll();
  initProductInteractions();
});

// Animation Utilities
function initAnimations() {
  // Counter animations
  const counters = document.querySelectorAll('[data-animate="counter"]');
  counters.forEach(counter => {
    const target = parseInt(counter.querySelector('[data-count]').dataset.count);
    animateCounter(counter, target);
  });

  // Pulse animations for CTAs
  const pulseElements = document.querySelectorAll('.pulse-animation');
  pulseElements.forEach(element => {
    element.style.animation = 'pulse 2s infinite';
  });
}

// Counter Animation Function
function animateCounter(element, target) {
  const numberElement = element.querySelector('[data-count]');
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    if (target < 1) {
      numberElement.textContent = current.toFixed(1);
    } else {
      numberElement.textContent = Math.floor(current);
    }
  }, 20);
}

// Intersection Observer for Animations
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Observe feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    observer.observe(card);
  });
}

// Smooth Scroll
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Product Interactions
function initProductInteractions() {
  // Product image 360 viewer
  const product3D = document.getElementById('product3D');
  if (product3D) {
    initProduct360Viewer(product3D);
  }

  // Variant selection
  const variantInputs = document.querySelectorAll('input[name="variant"]');
  variantInputs.forEach(input => {
    input.addEventListener('change', function() {
      updateProductVariant(this.value);
    });
  });

  // Language demo selector
  const langSelectors = document.querySelectorAll('.lang-input');
  langSelectors.forEach(selector => {
    selector.addEventListener('change', updateTranslationDemo);
  });
}

// 360 Product Viewer
function initProduct360Viewer(container) {
  const images = container.querySelectorAll('.product-angle');
  const leftBtn = container.querySelector('[data-direction="left"]');
  const rightBtn = container.querySelector('[data-direction="right"]');
  
  let currentAngle = 0;
  const totalImages = images.length;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  function rotate(direction) {
    if (direction === 'left') {
      currentAngle = currentAngle === 0 ? totalImages - 1 : currentAngle - 1;
    } else {
      currentAngle = currentAngle === totalImages - 1 ? 0 : currentAngle + 1;
    }
    showImage(currentAngle);
  }

  if (leftBtn) leftBtn.addEventListener('click', () => rotate('left'));
  if (rightBtn) rightBtn.addEventListener('click', () => rotate('right'));

  // Auto-rotate every 3 seconds
  setInterval(() => rotate('right'), 3000);
}

// Update Product Variant
function updateProductVariant(variantId) {
  // Update price display
  const priceElements = document.querySelectorAll('.price-display');
  // This would integrate with Shopify's variant data
  console.log('Variant changed to:', variantId);
  
  // Update add to cart buttons
  const addToCartBtns = document.querySelectorAll('[data-variant-id]');
  addToCartBtns.forEach(btn => {
    btn.dataset.variantId = variantId;
  });
}

// Translation Demo Update
function updateTranslationDemo() {
  const sourceSelect = document.querySelector('[data-type="source"]');
  const targetSelect = document.querySelector('[data-type="target"]'); 
  const sourceText = document.querySelector('.source-text');
  const translatedText = document.querySelector('.translated-text');

  if (!sourceSelect || !targetSelect) return;

  const translations = {
    'en-es': { source: '"Hello, how are you?"', target: '"Hola, ¿cómo estás?"' },
    'en-fr': { source: '"Hello, how are you?"', target: '"Bonjour, comment allez-vous?"' },
    'es-en': { source: '"Hola, ¿cómo estás?"', target: '"Hello, how are you?"' },
    'fr-en': { source: '"Bonjour, comment allez-vous?"', target: '"Hello, how are you?"' }
  };

  const key = `${sourceSelect.value}-${targetSelect.value}`;
  const translation = translations[key] || translations['en-es'];

  if (sourceText) sourceText.textContent = translation.source;
  if (translatedText) translatedText.textContent = translation.target;
}

// Cart Functions
function addToCart(variantId, quantity = 1) {
  const data = {
    id: variantId,
    quantity: quantity
  };

  return fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Added to cart:', data);
    updateCartUI();
    showCartNotification();
    return data;
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
    showErrorNotification();
  });
}

// Update Cart UI
function updateCartUI() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
        cartCount.style.display = cart.item_count > 0 ? 'block' : 'none';
      }
    });
}

// Notifications
function showCartNotification() {
  showNotification('Product added to cart!', 'success');
}

function showErrorNotification() {
  showNotification('Something went wrong. Please try again.', 'error');
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease'
  });

  // Set background color based on type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };
  notification.style.background = colors[type] || colors.info;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Device Detection
function isMobile() {
  return window.innerWidth <= 768;
}

function isTablet() {
  return window.innerWidth <= 1024 && window.innerWidth > 768;
}

// Lazy Loading Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Export functions for global use
window.ThemeUtils = {
  addToCart,
  updateCartUI,
  showNotification,
  debounce,
  throttle,
  isMobile,
  isTablet
}; 