// Portfolio Interactive Features
// Made with Bob

// Smooth scroll navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get target section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to section
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Throttle scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveNav();
    });
});

// Initialize on load
window.addEventListener('load', () => {
    updateActiveNav();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const currentActive = document.querySelector('.nav-link.active');
    const currentIndex = Array.from(navLinks).indexOf(currentActive);
    
    if (e.key === 'ArrowDown' && currentIndex < navLinks.length - 1) {
        e.preventDefault();
        navLinks[currentIndex + 1].click();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        navLinks[currentIndex - 1].click();
    }
});

// Photo Modal Functionality
const footballCard = document.getElementById('football-card');
const photoModal = document.getElementById('photo-modal');
const modalClose = document.querySelector('.modal-close');

if (footballCard && photoModal) {
    // Open modal when clicking football card
    footballCard.addEventListener('click', () => {
        photoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal when clicking X
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            photoModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoModal.style.display === 'block') {
            photoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

console.log('Portfolio loaded successfully! 🚀');
