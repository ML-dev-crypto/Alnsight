// ============================================
// AINSIGHT MODERN THEME JAVASCRIPT
// Interactive features and animations
// ============================================

// Particle Animation for Hero Background
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Animated Counter for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Terminal Animation
function animateTerminal() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    const lines = [
        '[<span class="time">14:32:01</span>] <span class="status-success">DOCUMENT_ANALYZED</span> | TYPE: CONTRACT | CONFIDENCE: 98.5%',
        '[<span class="time">14:32:05</span>] <span class="status-info">EMAIL_DRAFTED</span> | RECIPIENT: CLIENT | SENTIMENT: POSITIVE',
        '[<span class="time">14:32:10</span>] <span class="status-warning">TASK_EXTRACTED</span> | COUNT: 7 | PRIORITY: HIGH',
        '[<span class="time">14:32:14</span>] <span class="status-success">CODE_REVIEWED</span> | ISSUES: 0 | SUGGESTIONS: 3',
        '[<span class="time">14:32:18</span>] <span class="status-info">ANALYTICS_UPDATED</span> | USERS: 143 | ACTIVE: 87%',
        '[<span class="time">14:32:22</span>] <span class="status-success">AI_MODEL_READY</span> | STATUS: ONLINE | LATENCY: 12ms'
    ];
    
    let currentLine = 0;
    
    function addLine() {
        if (currentLine < lines.length) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'terminal-line';
            lineDiv.innerHTML = lines[currentLine];
            lineDiv.style.opacity = '0';
            terminalBody.insertBefore(lineDiv, terminalBody.lastElementChild);
            
            setTimeout(() => {
                lineDiv.style.transition = 'opacity 0.3s';
                lineDiv.style.opacity = '1';
            }, 10);
            
            currentLine++;
            setTimeout(addLine, 800);
        } else {
            // Loop animation
            setTimeout(() => {
                const linesToRemove = terminalBody.querySelectorAll('.terminal-line:not(.typing)');
                linesToRemove.forEach(line => line.remove());
                currentLine = 0;
                addLine();
            }, 5000);
        }
    }
    
    // Clear initial lines and start animation
    const initialLines = terminalBody.querySelectorAll('.terminal-line:not(.typing)');
    initialLines.forEach(line => line.remove());
    addLine();
}

// Smooth Scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Modal Functions
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showDemo() {
    alert('Demo request feature coming soon! For now, try the AI Demo at /webllm-demo.html');
    // In production, this would open a modal or redirect to a demo request form
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-overlay)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.borderTop = '1px solid var(--border-color)';
    }
}

// Login Form Handler
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Here you would normally call your authentication API
    // For now, redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Scroll Reveal Animation
function initScrollReveal() {
    const elements = document.querySelectorAll('.problem-card, .solution-card, .feature-showcase');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 14, 26, 0.98)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'var(--bg-overlay)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Comparison Slider (Interactive Before/After)
function initComparisonSlider() {
    const slider = document.querySelector('.comparison-divider');
    if (!slider) return;
    
    const container = document.querySelector('.comparison-content');
    let isDragging = false;
    
    slider.addEventListener('mousedown', () => {
        isDragging = true;
        slider.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        // Adjust visibility of before/after columns
        const beforeCol = container.querySelector('.before');
        const afterCol = container.querySelector('.after');
        
        if (beforeCol && afterCol) {
            beforeCol.style.opacity = percentage < 50 ? '1' : '0.5';
            afterCol.style.opacity = percentage > 50 ? '1' : '0.5';
        }
    });
}

// Copy Code Snippet
function copyCode(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initParticles();
    animateCounters();
    animateTerminal();
    initScrollReveal();
    initNavbarScroll();
    initComparisonSlider();
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLogin();
            }
        });
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape') {
            closeLogin();
        }
        
        // Ctrl/Cmd + K for quick login
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showLogin();
        }
    });
    
    console.log('%c🚀 AInSight Platform Loaded', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%cPowered by On-Device AI & WebGPU', 'color: #7c3aed; font-size: 14px;');
});

// Export functions for use in HTML
window.scrollToSection = scrollToSection;
window.switchTab = switchTab;
window.showLogin = showLogin;
window.closeLogin = closeLogin;
window.showDemo = showDemo;
window.toggleMobileMenu = toggleMobileMenu;
window.copyCode = copyCode;
