/*
   Portfolio Website - Main JavaScript
   Author: Your Name
   Date: 2025
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize form validation
    initFormValidation();
    
    // Add animation on scroll
    initScrollAnimations();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile nav if open
                const mobileNav = document.querySelector('.mobile-nav');
                const hamburger = document.querySelector('.hamburger-menu');
                
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                // Scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation and project request handling
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // For forms using Formspree, we still validate but don't prevent submission
            
            // Reset previous error states
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(el => el.remove());
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const projectTypeInput = document.getElementById('project-type');
            const phoneInput = document.getElementById('phone');
            const budgetInput = document.getElementById('budget');
            const timelineInput = document.getElementById('timeline');
            
            let isValid = true;
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate project type
            if (projectTypeInput && !projectTypeInput.value) {
                showError(projectTypeInput, 'Please select a project type');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Project details are required');
                isValid = false;
            }
            
            // If form is valid
            if (isValid) {
                // Store project request in localStorage for the admin dashboard
                saveProjectRequest({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput ? phoneInput.value.trim() : '',
                    projectType: projectTypeInput ? projectTypeInput.options[projectTypeInput.selectedIndex].text : 'General Inquiry',
                    budget: budgetInput ? (budgetInput.value ? budgetInput.options[budgetInput.selectedIndex].text : '') : '',
                    timeline: timelineInput ? (timelineInput.value ? timelineInput.options[timelineInput.selectedIndex].text : '') : '',
                    message: messageInput.value.trim(),
                    date: new Date().toISOString(),
                    status: 'New'
                });
                
                // If using Formspree, don't prevent default
                if (!contactForm.action.includes('formspree.io')) {
                    e.preventDefault();
                    
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitButton.textContent;
                    
                    submitButton.disabled = true;
                    submitButton.textContent = 'Sending...';
                    
                    // Simulate API call with timeout
                    setTimeout(function() {
                        submitButton.textContent = 'Message Sent!';
                        contactForm.reset();
                        
                        // Reset button after 3 seconds
                        setTimeout(function() {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 3000);
                    }, 1500);
                }
            } else {
                e.preventDefault(); // Prevent form submission if not valid
            }
        });
    }
}

// Save project request to localStorage
function saveProjectRequest(request) {
    let projectRequests = JSON.parse(localStorage.getItem('project_requests')) || [];
    projectRequests.push(request);
    localStorage.setItem('project_requests', JSON.stringify(projectRequests));
}

// Helper function to show form errors
function showError(inputElement, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '0.8rem';
    errorMessage.style.marginTop = '5px';
    
    inputElement.parentNode.appendChild(errorMessage);
    inputElement.style.borderColor = 'red';
    
    inputElement.addEventListener('input', function() {
        const error = inputElement.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
            inputElement.style.borderColor = '';
        }
    });
}

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Animation on scroll
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements with .animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('animate');
        });
    }
}

// Portfolio filtering
function filterPortfolioItems(filterValue) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Database schema visualization (for library management system case study)
function initSchemaVisualization() {
    // This function would be used on the library management system case study page
    // It could create an interactive visualization, but for now we'll keep it as a placeholder
    console.log('Schema visualization initialized');
}
