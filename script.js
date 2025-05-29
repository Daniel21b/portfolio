// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links that are internal anchors (not external pages)
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scrolling functionality for internal links only
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active section highlighting for internal links only
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link on page load
    updateActiveNavLink();
    
    // Profile photo placeholder functionality
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            // Create a placeholder if image fails to load
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background-color: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                font-size: 2rem;
                font-weight: 600;
                border: 1px solid #e2e8f0;
            `;
            placeholder.textContent = 'DB';
            this.parentNode.appendChild(placeholder);
        });
    }
    
    // Copy email to clipboard functionality
    function addCopyEmailFeature() {
        const emailElement = document.querySelector('a[href^="mailto:"]');
        if (emailElement) {
            emailElement.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                const email = this.href.replace('mailto:', '');
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(email).then(() => {
                        showToast('Email copied to clipboard');
                    });
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Email copied to clipboard');
                }
            });
        }
    }
    
    // Professional toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background-color: #1e293b;
            color: #ffffff;
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid #334155;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }
    
    // Initialize copy email feature
    addCopyEmailFeature();
    
    // Initialize bookshelf filtering
    initializeBookshelfFilters();
    
    // Mobile menu toggle functionality
    function addMobileMenuToggle() {
        const navLinks = document.querySelector('.nav-links');
        const navigation = document.querySelector('.navigation');
        
        // Create mobile menu button
        const menuButton = document.createElement('button');
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #64748b;
            cursor: pointer;
            padding: 8px;
        `;
        menuButton.className = 'mobile-menu-toggle';
        
        // Insert menu button
        navigation.querySelector('.container').insertBefore(menuButton, navLinks);
        
        // Toggle functionality
        menuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
        
        // Close menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('mobile-open');
            }
        });
        
        // Add mobile styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block !important;
                }
                
                .nav-links {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-top: none;
                    flex-direction: column;
                    padding: 16px;
                    gap: 8px;
                }
                
                .nav-links.mobile-open {
                    display: flex;
                }
                
                .navigation {
                    position: relative;
                }
            }
        `;
        document.head.appendChild(mobileStyles);
    }
    
    // Initialize mobile menu
    addMobileMenuToggle();
    
    // Throttle function for performance
    function throttle(func, wait) {
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
    
    // Throttle scroll events for better performance
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
});

// Bookshelf filtering functionality
function initializeBookshelfFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');
    
    if (filterButtons.length === 0 || bookCards.length === 0) {
        return; // Exit if bookshelf elements don't exist
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter books
            bookCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });
    
    // Initialize with 'all' filter active
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.click();
    }
} 