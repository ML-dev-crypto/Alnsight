// Authentication Logic
function checkAuth() {
    const token = getToken();
    const user = getCurrentUser();
    
    if (!token || !user) {
        window.location.href = 'index.html';
        return false;
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
        showToast('Admin access required', 'error');
        logout();
        return false;
    }
    
    return true;
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}

// Initialize auth
if (window.location.pathname.includes('dashboard.html')) {
    if (!checkAuth()) {
        // Will redirect to login
    } else {
        // Update UI with user info
        const user = getCurrentUser();
        const currentUserEl = document.getElementById('currentUser');
        if (currentUserEl) {
            currentUserEl.textContent = user.full_name || user.username;
        }
    }
}
