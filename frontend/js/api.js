// API Configuration and Helper Functions
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
function getToken() {
    return localStorage.getItem('ainsight_token');
}

// Set auth token
function setToken(token) {
    localStorage.setItem('ainsight_token', token);
}

// Remove auth token
function removeToken() {
    localStorage.removeItem('ainsight_token');
    localStorage.removeItem('ainsight_user');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('ainsight_user');
    return user ? JSON.parse(user) : null;
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('ainsight_user', JSON.stringify(user));
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API Functions
const api = {
    // Auth
    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    getCurrentUser: () => apiRequest('/auth/me'),
    
    changePassword: (oldPassword, newPassword) => apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    }),
    
    // Users
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/users?${query}`);
    },
    
    getUser: (userId) => apiRequest(`/users/${userId}`),
    
    createUser: (userData) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    updateUser: (userId, userData) => apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    }),
    
    deleteUser: (userId) => apiRequest(`/users/${userId}`, {
        method: 'DELETE'
    }),
    
    updatePermissions: (userId, permissions) => apiRequest(`/users/${userId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions })
    }),
    
    updateStatus: (userId, status) => apiRequest(`/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    
    // Analytics
    getAnalyticsSummary: (days = 30) => apiRequest(`/analytics/summary?days=${days}`),
    
    getUserAnalytics: (userId, days = 30) => apiRequest(`/analytics/user/${userId}?days=${days}`),
    
    getMyStats: (days = 30) => apiRequest(`/analytics/my-stats?days=${days}`),
    
    logAnalytics: (data) => apiRequest('/analytics/log', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // Tasks
    getTasks: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/tasks?${query}`);
    },
    
    createTask: (taskData) => apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    }),
    
    updateTask: (taskId, taskData) => apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
    }),
    
    deleteTask: (taskId) => apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE'
    }),
    
    syncTasks: (tasks) => apiRequest('/tasks/sync', {
        method: 'POST',
        body: JSON.stringify({ tasks })
    }),
    
    // Announcements
    getAnnouncements: () => apiRequest('/announcements'),
    
    getAllAnnouncements: (status) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/announcements/all${query}`);
    },
    
    createAnnouncement: (data) => apiRequest('/announcements', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    updateAnnouncement: (id, data) => apiRequest(`/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, {
        method: 'DELETE'
    })
};
