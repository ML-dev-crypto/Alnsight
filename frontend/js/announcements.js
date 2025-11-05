// Announcements Logic
let currentAnnouncements = [];

async function loadAnnouncements() {
    try {
        const data = await api.getAllAnnouncements('active');
        currentAnnouncements = data.announcements || [];
        
        renderAnnouncements(currentAnnouncements);
    } catch (error) {
        console.error('Failed to load announcements:', error);
        showToast('Failed to load announcements', 'error');
    }
}

function renderAnnouncements(announcements) {
    const container = document.getElementById('announcementsList');
    
    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<p class="empty-state">No announcements yet</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-card" style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid ${getPriorityColor(announcement.priority)}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${announcement.title}</h3>
                    <span class="badge badge-${announcement.priority}">${announcement.priority}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-secondary" onclick="editAnnouncement(${announcement.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAnnouncementConfirm(${announcement.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p style="color: #64748b; margin-bottom: 1rem;">${announcement.message}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #94a3b8;">
                <span><i class="fas fa-user"></i> ${announcement.sender_name || 'Admin'}</span>
                <span><i class="fas fa-calendar"></i> ${new Date(announcement.created_at).toLocaleDateString()}</span>
                <span><i class="fas fa-users"></i> Target: ${formatTarget(announcement.target)}</span>
            </div>
        </div>
    `).join('');
}

function formatTarget(target) {
    if (target === 'all') return 'All Users';
    if (target.startsWith('role:')) return target.split(':')[1].charAt(0).toUpperCase() + target.split(':')[1].slice(1) + 's';
    return target;
}

function getPriorityColor(priority) {
    const colors = {
        info: '#3b82f6',
        warning: '#f59e0b',
        urgent: '#ef4444'
    };
    return colors[priority] || colors.info;
}

function openAnnouncementModal() {
    const modal = document.getElementById('announcementModal');
    const form = document.getElementById('announcementForm');
    
    form.reset();
    delete form.dataset.announcementId;
    
    modal.classList.add('active');
}

async function handleAnnouncementFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const announcementId = form.dataset.announcementId;
    
    const data = {
        title: document.getElementById('announcementTitle').value,
        message: document.getElementById('announcementMessage').value,
        priority: document.getElementById('announcementPriority').value,
        target: document.getElementById('announcementTarget').value
    };
    
    const expiresAt = document.getElementById('announcementExpires').value;
    if (expiresAt) {
        data.expires_at = new Date(expiresAt).toISOString();
    }
    
    try {
        if (announcementId) {
            await api.updateAnnouncement(announcementId, data);
            showToast('Announcement updated successfully');
        } else {
            await api.createAnnouncement(data);
            showToast('Announcement created successfully');
        }
        
        closeModal('announcementModal');
        loadAnnouncements();
    } catch (error) {
        console.error('Failed to save announcement:', error);
        showToast(error.message || 'Failed to save announcement', 'error');
    }
}

async function deleteAnnouncementConfirm(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
    }
    
    try {
        await api.deleteAnnouncement(id);
        showToast('Announcement deleted successfully');
        loadAnnouncements();
    } catch (error) {
        console.error('Failed to delete announcement:', error);
        showToast(error.message || 'Failed to delete announcement', 'error');
    }
}

function editAnnouncement(id) {
    // For now, just show a message
    showToast('Edit feature coming soon');
}

// Event listeners
if (document.getElementById('announcementForm')) {
    document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementFormSubmit);
}

if (document.getElementById('newAnnouncementBtn')) {
    document.getElementById('newAnnouncementBtn').addEventListener('click', openAnnouncementModal);
}

// Load announcements when page is active
if (document.getElementById('announcements-page')) {
    loadAnnouncements();
}
