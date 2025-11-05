// Dashboard Page Logic
let usageChart = null;
let featureChart = null;

async function loadDashboard() {
    try {
        // Load analytics summary
        const analytics = await api.getAnalyticsSummary(30);
        
        // Update stats
        document.getElementById('totalUsage').textContent = analytics.total_usage || 0;
        document.getElementById('activeUsers').textContent = analytics.active_users || 0;
        
        // Calculate mobile usage
        const mobileUsage = analytics.device_usage?.find(d => d.device === 'mobile')?.count || 0;
        document.getElementById('mobileUsage').textContent = mobileUsage;
        
        // Load total users
        const usersData = await api.getUsers({ per_page: 1 });
        document.getElementById('totalUsers').textContent = usersData.total || 0;
        
        // Create usage trend chart
        createUsageChart(analytics.daily_usage || []);
        
        // Create feature chart
        createFeatureChart(analytics.feature_usage || []);
        
        // Load recent announcements
        await loadRecentAnnouncements();
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function createUsageChart(dailyData) {
    const ctx = document.getElementById('usageChart');
    if (!ctx) return;
    
    if (usageChart) {
        usageChart.destroy();
    }
    
    const labels = dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const data = dailyData.map(d => d.count);
    
    usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'AI Usage',
                data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createFeatureChart(featureData) {
    const ctx = document.getElementById('featureChart');
    if (!ctx) return;
    
    if (featureChart) {
        featureChart.destroy();
    }
    
    const labels = featureData.map(f => formatFeatureName(f.feature));
    const data = featureData.map(f => f.count);
    
    featureChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function formatFeatureName(feature) {
    return feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function loadRecentAnnouncements() {
    try {
        const data = await api.getAllAnnouncements('active');
        const container = document.getElementById('recentAnnouncements');
        
        if (!data.announcements || data.announcements.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent announcements</p>';
            return;
        }
        
        container.innerHTML = data.announcements.slice(0, 5).map(announcement => `
            <div class="announcement-item" style="padding: 1rem; border-left: 4px solid ${getPriorityColor(announcement.priority)}; background: white; margin-bottom: 0.5rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong>${announcement.title}</strong>
                        <p style="color: #64748b; margin-top: 0.25rem; font-size: 0.9rem;">${announcement.message}</p>
                    </div>
                    <span class="badge badge-${announcement.priority}">${announcement.priority}</span>
                </div>
                <small style="color: #94a3b8; font-size: 0.8rem;">
                    ${new Date(announcement.created_at).toLocaleDateString()}
                </small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load announcements:', error);
    }
}

function getPriorityColor(priority) {
    const colors = {
        info: '#3b82f6',
        warning: '#f59e0b',
        urgent: '#ef4444'
    };
    return colors[priority] || colors.info;
}

// Initialize dashboard when page loads
if (document.getElementById('dashboard-page')) {
    loadDashboard();
}
