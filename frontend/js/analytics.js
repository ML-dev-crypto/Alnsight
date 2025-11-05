// Analytics Page Logic
let dailyTrendChart = null;
let deviceChart = null;

async function loadAnalytics(days = 30) {
    try {
        const analytics = await api.getAnalyticsSummary(days);
        
        // Update summary cards
        updateAnalyticsSummary(analytics);
        
        // Create charts
        createDailyTrendChart(analytics.daily_usage || []);
        createDeviceChart(analytics.device_usage || []);
        
    } catch (error) {
        console.error('Failed to load analytics:', error);
        showToast('Failed to load analytics', 'error');
    }
}

function updateAnalyticsSummary(analytics) {
    // Find most used feature
    const featureUsage = analytics.feature_usage || [];
    if (featureUsage.length > 0) {
        const topFeature = featureUsage.reduce((max, f) => f.count > max.count ? f : max, featureUsage[0]);
        document.getElementById('topFeature').textContent = formatFeatureName(topFeature.feature);
    }
    
    // Calculate average daily usage
    const dailyUsage = analytics.daily_usage || [];
    if (dailyUsage.length > 0) {
        const avg = Math.round(dailyUsage.reduce((sum, d) => sum + d.count, 0) / dailyUsage.length);
        document.getElementById('avgDailyUsage').textContent = avg;
    }
}

function createDailyTrendChart(dailyData) {
    const ctx = document.getElementById('dailyTrendChart');
    if (!ctx) return;
    
    if (dailyTrendChart) {
        dailyTrendChart.destroy();
    }
    
    const labels = dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const data = dailyData.map(d => d.count);
    
    dailyTrendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Daily Usage',
                data,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: '#6366f1',
                borderWidth: 1
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

function createDeviceChart(deviceData) {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;
    
    if (deviceChart) {
        deviceChart.destroy();
    }
    
    const labels = deviceData.map(d => d.device || 'Unknown');
    const data = deviceData.map(d => d.count);
    
    deviceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#10b981'
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

// Event listener for time range selector
if (document.getElementById('analyticsTimeRange')) {
    document.getElementById('analyticsTimeRange').addEventListener('change', (e) => {
        loadAnalytics(parseInt(e.target.value));
    });
}

// Load analytics when page is visible
if (document.getElementById('analytics-page')) {
    loadAnalytics(30);
}
