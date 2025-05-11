// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
// Quantity Selector Functionality
document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentNode.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (this.classList.contains('minus') && value > 1) {
            input.value = value - 1;
        } else if (this.classList.contains('plus')) {
            input.value = value + 1;
        }
    });
});

// Update cart count in header
function updateCartCount() {
    fetch('/cart/count/')  // You'll need to create this endpoint
        .then(response => response.json())
        .then(data => {
            document.querySelector('.cart-count').textContent = data.count;
        });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Add to cart form submission
document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateCartCount();
                // Show success message or animation
                const btn = this.querySelector('.add-to-cart-btn');
                btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                }, 2000);
            }
        });
    });
});
// Function to update cart count
function updateCartCount() {
    fetch('/cart/count/')  // You'll need to create this endpoint
        .then(response => response.json())
        .then(data => {
            const cartCount = document.querySelector('.cart-count');
            cartCount.textContent = data.count;
            
            // Add animation when count changes
            if (data.count > 0) {
                cartCount.classList.add('pulse');
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 500);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Call this after adding to cart
function addToCart(productId, quantity) {
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('quantity', quantity);
    formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
    
    fetch('/cart/add/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCartCount();
            // Show added to cart message
            showCartMessage('Added to cart!');
        }
    });
}

// Small popup message
function showCartMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'cart-message';
    msg.textContent = message;
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        msg.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(msg);
        }, 300);
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Handle all add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('form');
            const productId = form.querySelector('input[name="product_id"]').value;
            const quantity = form.querySelector('input[name="quantity"]').value;
            addToCart(productId, quantity);
        });
    });
});