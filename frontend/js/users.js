// User Management Logic
let currentUsers = [];

async function loadUsers(filters = {}) {
    try {
        const data = await api.getUsers(filters);
        currentUsers = data.users || [];
        
        renderUsersTable(currentUsers);
    } catch (error) {
        console.error('Failed to load users:', error);
        showToast('Failed to load users', 'error');
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <strong>${user.full_name || 'N/A'}</strong><br>
                <small style="color: #64748b;">@${user.username}</small>
            </td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role === 'admin' ? 'warning' : 'info'}">${user.role}</span></td>
            <td><span class="badge badge-${getStatusBadge(user.status)}">${user.status}</span></td>
            <td>${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUserConfirm(${user.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadge(status) {
    const badges = {
        active: 'success',
        inactive: 'warning',
        suspended: 'danger'
    };
    return badges[status] || 'info';
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalTitle');
    
    if (userId) {
        title.textContent = 'Edit User';
        loadUserData(userId);
    } else {
        title.textContent = 'Add User';
        form.reset();
    }
    
    modal.classList.add('active');
}

async function loadUserData(userId) {
    try {
        const data = await api.getUser(userId);
        const user = data.user;
        
        document.getElementById('userName').value = user.full_name || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userUsername').value = user.username || '';
        document.getElementById('userRole').value = user.role || 'employee';
        
        // Set permissions
        const permissions = user.permissions || {};
        document.querySelectorAll('input[name="permission"]').forEach(checkbox => {
            checkbox.checked = permissions[checkbox.value] !== false;
        });
        
        // Store user ID for update
        document.getElementById('userForm').dataset.userId = userId;
    } catch (error) {
        console.error('Failed to load user:', error);
        showToast('Failed to load user data', 'error');
    }
}

async function handleUserFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const userId = form.dataset.userId;
    
    // Collect form data
    const userData = {
        full_name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        username: document.getElementById('userUsername').value,
        role: document.getElementById('userRole').value
    };
    
    // Add password only for new users
    if (!userId) {
        userData.password = document.getElementById('userPassword').value;
    }
    
    // Collect permissions
    const permissions = {};
    document.querySelectorAll('input[name="permission"]').forEach(checkbox => {
        permissions[checkbox.value] = checkbox.checked;
    });
    userData.permissions = permissions;
    
    try {
        if (userId) {
            await api.updateUser(userId, userData);
            showToast('User updated successfully');
        } else {
            await api.createUser(userData);
            showToast('User created successfully');
        }
        
        closeModal('userModal');
        loadUsers();
    } catch (error) {
        console.error('Failed to save user:', error);
        showToast(error.message || 'Failed to save user', 'error');
    }
}

async function deleteUserConfirm(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        await api.deleteUser(userId);
        showToast('User deleted successfully');
        loadUsers();
    } catch (error) {
        console.error('Failed to delete user:', error);
        showToast(error.message || 'Failed to delete user', 'error');
    }
}

function editUser(userId) {
    openUserModal(userId);
}

// Event listeners
if (document.getElementById('userForm')) {
    document.getElementById('userForm').addEventListener('submit', handleUserFormSubmit);
}

if (document.getElementById('addUserBtn')) {
    document.getElementById('addUserBtn').addEventListener('click', () => openUserModal());
}

// Filters
if (document.getElementById('userSearch')) {
    document.getElementById('userSearch').addEventListener('input', debounce((e) => {
        const search = e.target.value;
        const role = document.getElementById('roleFilter').value;
        const status = document.getElementById('statusFilter').value;
        loadUsers({ search, role, status });
    }, 500));
}

if (document.getElementById('roleFilter')) {
    document.getElementById('roleFilter').addEventListener('change', (e) => {
        const search = document.getElementById('userSearch').value;
        const role = e.target.value;
        const status = document.getElementById('statusFilter').value;
        loadUsers({ search, role, status });
    });
}

if (document.getElementById('statusFilter')) {
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        const search = document.getElementById('userSearch').value;
        const role = document.getElementById('roleFilter').value;
        const status = e.target.value;
        loadUsers({ search, role, status });
    });
}

// Debounce helper
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

// Load users when page is active
if (document.getElementById('users-page')) {
    loadUsers();
}
