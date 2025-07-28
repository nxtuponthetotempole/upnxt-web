// Import supabase client from supabase-config.js
import { supabase } from './supabase-config.js';

// Smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animations
    const fadeElements = document.querySelectorAll('.oneliner-text, .demo-video-placeholder, .cta-title, .final-form');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Smooth scroll for arrow indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const scrollTitleSection = document.querySelector('.scroll-title-section');
            scrollTitleSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Demo placeholder click handler
    const demoPlaceholder = document.querySelector('.demo-placeholder');
    if (demoPlaceholder) {
        demoPlaceholder.addEventListener('click', () => {
            showToast('🎬 Demo coming soon! We\'re crafting the perfect showcase.', 'success');
        });
    }
    
    // Form handling
    const forms = document.querySelectorAll('.waitlist-form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    
        // Add real-time validation for phone and checkbox
        const phoneInput = form.querySelector('input[type="tel"]');
        const checkbox = form.querySelector('input[type="checkbox"]');
        const submitButton = form.querySelector('.cta-button');
        
        if (phoneInput && checkbox && submitButton) {
            const validateForm = () => {
                const phoneValid = phoneInput.value.trim().length > 0;
                const checkboxValid = checkbox.checked;
                submitButton.disabled = !(phoneValid && checkboxValid);
            };
            
            phoneInput.addEventListener('input', validateForm);
            checkbox.addEventListener('change', validateForm);
            
            // Initial validation
            validateForm();
        }
    });
    
    // Additional direct event listener for debugging
    const finalForm = document.getElementById('finalForm');
    if (finalForm) {
        console.log('Final form found and event listener attached');
        finalForm.addEventListener('submit', (e) => {
            console.log('Form submit event triggered');
            handleFormSubmit(e);
        });
    } else {
        console.warn('Final form not found');
    }
    
    // Scroll title animation
    const scrollTitle = document.querySelector('.scroll-title');
    if (scrollTitle) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;
            const scrollProgress = Math.min(scrolled / heroHeight, 1);
            
            // Move title up and overlap hero section
            const translateY = Math.max(-heroHeight * 0.3, -scrolled * 0.5);
            scrollTitle.style.transform = `translateY(${translateY}px)`;
            
            // Fade in as user scrolls
            const opacity = Math.min(1, scrollProgress * 2);
            scrollTitle.style.opacity = opacity;
    });
    }
    
    // Floating elements animation enhancement
    const floatingEmojis = document.querySelectorAll('.floating-emoji');
    floatingEmojis.forEach((emoji, index) => {
        emoji.style.animationDelay = `${index * 1.5}s`;
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.demo-video-placeholder, .cta-button, .social-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', addHoverEffect);
        element.addEventListener('mouseleave', removeHoverEffect);
    });
    
    // Smooth reveal animations on scroll
    const revealElements = document.querySelectorAll('.demo-section, .oneliner-section, .final-cta');
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s ease';
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });
        
        elementObserver.observe(element);
    });
});

// Fix Supabase waitlist submission bug

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const phoneInput = form.querySelector('input[type="tel"]');
    const checkbox = form.querySelector('input[type="checkbox"]');
    const button = form.querySelector('.cta-button');
    const originalText = button.textContent;
    
    const phoneNumber = phoneInput.value.trim();
    const consented = checkbox.checked;

    // Validation
    if (!phoneNumber || !consented) {
        showToast('Please enter your phone number and agree to SMS updates.', 'error');
        return;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    // Show loading state and disable button to prevent double clicks
    button.textContent = 'Joining...';
    button.disabled = true;
    
    try {
        // Debug: Log the data being sent
        const insertData = { 
            phone_number: phoneNumber, 
            consented_to_sms: consented 
        };
        console.log('Attempting to insert data:', insertData);
        
        // Check if Supabase client is properly initialized
        if (!supabase || !supabase.from) {
            throw new Error('Supabase client not properly initialized');
        }
        
        // Insert into Supabase with RLS-compliant data structure
        const { data, error } = await supabase
            .from('waitlist_signups')
            .insert([insertData])
            .select();
        
        if (error) {
            console.error('Supabase insert error:', error);
            console.error('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }
        
        console.log('Successfully inserted data:', data);
        
        // Success state
        button.textContent = 'Welcome! 🎬';
        button.style.background = '#26A67E';
        
        showToast('🎉 You\'re on the waitlist!', 'success');
        
        // Reset form
        phoneInput.value = '';
        checkbox.checked = false;
        button.disabled = true;
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '#2CCB99';
        }, 3000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Show specific error message based on error type
        let errorMessage = '⚠️ Something went wrong. Please try again.';
        
        if (error.message) {
            if (error.message.includes('RLS')) {
                errorMessage = '⚠️ Permission denied. Please check your consent.';
            } else if (error.message.includes('network')) {
                errorMessage = '⚠️ Network error. Please check your connection.';
            } else if (error.message.includes('phone_number')) {
                errorMessage = '⚠️ Invalid phone number format.';
            }
        }
        
        showToast(errorMessage, 'error');
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create toast content
    const icon = type === 'success' ? '🎬' : '⚠️';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 100);
    
    // Auto remove after delay
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Hover effects
function addHoverEffect(e) {
    const element = e.target;
    element.style.transform = element.style.transform + ' scale(1.05)';
}

function removeHoverEffect(e) {
    const element = e.target;
    element.style.transform = element.style.transform.replace(' scale(1.05)', '');
}

// Add some cinematic particle effects
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(245, 173, 255, 0.3);
            border-radius: 50%;
            animation: particle-float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particle-float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles after page load
window.addEventListener('load', () => {
    setTimeout(createParticles, 2000);
});

// Add smooth cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(245, 173, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(newCursor);
    }
    
    if (cursor) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    }
});

// Hide cursor on interactive elements
document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('button, a, input, .demo-video-placeholder')) {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.transform = 'scale(1.5)';
    }
});

document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('button, a, input, .demo-video-placeholder')) {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.transform = 'scale(1)';
    }
}); 