/**
 * SBARDS Advanced Dashboard JavaScript
 * Real-time, Interactive, and Performance-Optimized
 */

class SBARDSDashboard {
    constructor() {
        this.config = {
            updateInterval: 2000, // 2 seconds for faster updates
            maxDataPoints: 50,
            animationDuration: 200, // Faster animations
            retryAttempts: 3,
            retryDelay: 1000
        };

        // Performance optimization properties
        this.performanceMetrics = {
            loadTime: 0,
            updateTime: 0,
            renderTime: 0,
            apiCalls: 0
        };

        // Debounce and throttle helpers
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();

        // Animation frame management
        this.animationFrameId = null;
        this.pendingUpdates = new Set();

        this.state = {
            isConnected: false,
            lastUpdate: null,
            retryCount: 0,
            charts: {},
            notifications: [],
            theme: localStorage.getItem('sbards-theme') || 'light'
        };

        this.websocket = null;
        this.updateTimer = null;
        this.charts = {};

        this.init();
    }

    /**
     * Initialize Dashboard
     */
    async init() {
        try {
            console.log('🚀 Initializing SBARDS Dashboard...');

            // Set initial theme
            this.setTheme(this.state.theme);

            // Initialize components
            await this.initializeComponents();

            // Setup event listeners
            this.setupEventListeners();

            // Start data updates
            this.startDataUpdates();

            // Initialize HTTP polling (WebSocket not available)
            this.initHttpPolling();

            console.log('✅ Dashboard initialized successfully');
            this.showNotification('Dashboard loaded successfully', 'success');

        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showNotification('Dashboard initialization failed', 'error');
        }
    }

    /**
     * Initialize Dashboard Components
     */
    async initializeComponents() {
        // Initialize charts
        await this.initializeCharts();

        // Initialize metrics
        this.initializeMetrics();

        // Initialize status indicators
        this.initializeStatusIndicators();

        // Initialize theme toggle
        this.initializeThemeToggle();

        // Initialize notifications
        this.initializeNotifications();
    }

    /**
     * Initialize Charts
     */
    async initializeCharts() {
        try {
            // CPU Usage Chart
            this.charts.cpuUsage = this.createLineChart('cpuChart', {
                label: 'CPU Usage (%)',
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                data: []
            });

            // Memory Usage Chart
            this.charts.memoryUsage = this.createLineChart('memoryChart', {
                label: 'Memory Usage (%)',
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                data: []
            });

            // File Processing Chart
            this.charts.fileProcessing = this.createBarChart('fileChart', {
                labels: ['Intercepted', 'Processed', 'Quarantined', 'Restored'],
                data: [0, 0, 0, 0],
                backgroundColor: ['#3498db', '#27ae60', '#e74c3c', '#f39c12']
            });

            // Threat Detection Chart
            this.charts.threatDetection = this.createDoughnutChart('threatChart', {
                labels: ['Clean Files', 'Suspicious', 'Malicious', 'Unknown'],
                data: [0, 0, 0, 0],
                backgroundColor: ['#27ae60', '#f39c12', '#e74c3c', '#95a5a6']
            });

            console.log('📊 Charts initialized successfully');

        } catch (error) {
            console.error('❌ Chart initialization failed:', error);
        }
    }

    /**
     * Create Line Chart
     */
    createLineChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: config.label,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    /**
     * Create Bar Chart
     */
    createBarChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Create Doughnut Chart
     */
    createDoughnutChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Initialize Metrics
     */
    initializeMetrics() {
        this.metrics = {
            totalFiles: 0,
            threatsDetected: 0,
            systemUptime: 0,
            processingSpeed: 0
        };
    }

    /**
     * Initialize Status Indicators
     */
    initializeStatusIndicators() {
        this.statusElements = {
            captureLayer: document.getElementById('captureStatus'),
            staticAnalysis: document.getElementById('staticStatus'),
            apiLayer: document.getElementById('apiStatus'),
            systemHealth: document.getElementById('systemStatus')
        };
    }

    /**
     * Initialize Theme Toggle
     */
    initializeThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * Initialize Notifications
     */
    initializeNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Window events
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Start Data Updates
     */
    startDataUpdates() {
        this.updateTimer = setInterval(() => {
            this.updateDashboard();
        }, this.config.updateInterval);

        // Initial update
        this.updateDashboard();
    }

    /**
     * Update Dashboard Data
     */
    async updateDashboard() {
        try {
            // Fetch latest data
            const data = await this.fetchDashboardData();

            if (data) {
                // Update charts
                this.updateCharts(data);

                // Update metrics
                this.updateMetrics(data);

                // Update status indicators
                this.updateStatusIndicators(data);

                // Update last update time
                this.state.lastUpdate = new Date();
                this.updateLastUpdateTime();

                // Reset retry count on success
                this.state.retryCount = 0;
            }

        } catch (error) {
            console.error('❌ Dashboard update failed:', error);
            this.handleUpdateError(error);
        }
    }

    /**
     * Enhanced Fetch Dashboard Data with retry logic
     */
    async fetchDashboardData() {
        let retryCount = 0;
        const maxRetries = this.config.retryAttempts;

        while (retryCount < maxRetries) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch('/api/dashboard/data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Validate data structure
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid data format received');
                }

                // Mark as connected
                this.state.isConnected = true;
                this.updateConnectionStatus(true);

                return data;

            } catch (error) {
                retryCount++;
                console.warn(`❌ Fetch attempt ${retryCount} failed:`, error.message);

                if (retryCount >= maxRetries) {
                    this.state.isConnected = false;
                    this.updateConnectionStatus(false);
                    this.showNotification(`Failed to fetch data after ${maxRetries} attempts`, 'error');
                    throw error;
                }

                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * retryCount));
            }
        }
    }

    /**
     * Update connection status indicator
     */
    updateConnectionStatus(connected) {
        const statusElements = document.querySelectorAll('.connection-status');
        statusElements.forEach(element => {
            if (connected) {
                element.className = 'connection-status status-active';
                element.innerHTML = '<i class="fas fa-wifi"></i> Connected';
            } else {
                element.className = 'connection-status status-error';
                element.innerHTML = '<i class="fas fa-wifi-slash"></i> Disconnected';
            }
        });

        // Update last update time
        if (connected) {
            this.state.lastUpdate = new Date();
            this.updateLastUpdateTime();
        }
    }

    /**
     * Update last update time display
     */
    updateLastUpdateTime() {
        const timeElements = document.querySelectorAll('.last-update-time');
        const timeString = this.state.lastUpdate ?
            this.state.lastUpdate.toLocaleTimeString() : 'Never';

        timeElements.forEach(element => {
            element.textContent = `Last updated: ${timeString}`;
        });
    }

    /**
     * Update Charts with New Data
     */
    updateCharts(data) {
        try {
            // Update CPU chart
            if (this.charts.cpuUsage && data.system) {
                this.updateLineChart(this.charts.cpuUsage, data.system.cpu_usage);
            }

            // Update Memory chart
            if (this.charts.memoryUsage && data.system) {
                this.updateLineChart(this.charts.memoryUsage, data.system.memory_usage);
            }

            // Update File Processing chart
            if (this.charts.fileProcessing && data.capture) {
                const stats = data.capture.interceptor_stats;
                this.charts.fileProcessing.data.datasets[0].data = [
                    stats.cpp_intercepts || 0,
                    stats.python_processes || 0,
                    stats.files_quarantined || 0,
                    stats.files_restored || 0
                ];
                this.charts.fileProcessing.update();
            }

            // Update Threat Detection chart
            if (this.charts.threatDetection && data.threats) {
                this.charts.threatDetection.data.datasets[0].data = [
                    data.threats.clean || 0,
                    data.threats.suspicious || 0,
                    data.threats.malicious || 0,
                    data.threats.unknown || 0
                ];
                this.charts.threatDetection.update();
            }

        } catch (error) {
            console.error('❌ Chart update failed:', error);
        }
    }

    /**
     * Update Line Chart
     */
    updateLineChart(chart, value) {
        const now = new Date().toLocaleTimeString();

        // Add new data point
        chart.data.labels.push(now);
        chart.data.datasets[0].data.push(value);

        // Remove old data points
        if (chart.data.labels.length > this.config.maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update('none'); // No animation for real-time updates
    }

    /**
     * Update Metrics
     */
    updateMetrics(data) {
        try {
            // Update metric values with animation
            this.animateMetric('totalFilesMetric', data.metrics?.total_files || 0);
            this.animateMetric('threatsDetectedMetric', data.metrics?.threats_detected || 0);
            this.animateMetric('systemUptimeMetric', data.metrics?.uptime_hours || 0);
            this.animateMetric('processingSpeedMetric', data.metrics?.processing_speed || 0);

        } catch (error) {
            console.error('❌ Metrics update failed:', error);
        }
    }

    /**
     * Animate Metric Value
     */
    animateMetric(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        const difference = targetValue - currentValue;
        const steps = 20;
        const stepValue = difference / steps;
        let currentStep = 0;

        const animation = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = newValue.toLocaleString();

            if (currentStep >= steps) {
                clearInterval(animation);
                element.textContent = targetValue.toLocaleString();
            }
        }, this.config.animationDuration / steps);
    }

    /**
     * Update Status Indicators
     */
    updateStatusIndicators(data) {
        try {
            // Update capture layer status
            this.updateStatus('captureStatus', data.capture?.running || false);

            // Update static analysis status
            this.updateStatus('staticStatus', data.static_analysis?.running || false);

            // Update API status
            this.updateStatus('apiStatus', data.api?.running || true);

            // Update system health
            const systemHealth = data.system?.health || 'unknown';
            this.updateSystemHealth('systemStatus', systemHealth);

        } catch (error) {
            console.error('❌ Status update failed:', error);
        }
    }

    /**
     * Update Status Element
     */
    updateStatus(elementId, isActive) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.className = `status-indicator ${isActive ? 'status-active' : 'status-error'}`;
        element.innerHTML = `
            <i class="fas fa-${isActive ? 'check-circle' : 'times-circle'}"></i>
            ${isActive ? 'Active' : 'Inactive'}
        `;
    }

    /**
     * Update System Health
     */
    updateSystemHealth(elementId, health) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const statusMap = {
            'excellent': { class: 'status-active', icon: 'heart', text: 'Excellent' },
            'good': { class: 'status-active', icon: 'thumbs-up', text: 'Good' },
            'warning': { class: 'status-warning', icon: 'exclamation-triangle', text: 'Warning' },
            'critical': { class: 'status-error', icon: 'exclamation-circle', text: 'Critical' },
            'unknown': { class: 'status-info', icon: 'question-circle', text: 'Unknown' }
        };

        const status = statusMap[health] || statusMap['unknown'];

        element.className = `status-indicator ${status.class}`;
        element.innerHTML = `
            <i class="fas fa-${status.icon}"></i>
            ${status.text}
        `;
    }

    /**
     * Update Last Update Time
     */
    updateLastUpdateTime() {
        const element = document.getElementById('lastUpdate');
        if (element && this.state.lastUpdate) {
            element.textContent = `Last updated: ${this.state.lastUpdate.toLocaleTimeString()}`;
        }
    }

    /**
     * Handle Update Errors
     */
    handleUpdateError(error) {
        this.state.retryCount++;

        if (this.state.retryCount <= this.config.retryAttempts) {
            console.log(`🔄 Retrying update (${this.state.retryCount}/${this.config.retryAttempts})...`);
            setTimeout(() => {
                this.updateDashboard();
            }, this.config.retryDelay * this.state.retryCount);
        } else {
            console.error('❌ Max retry attempts reached');
            this.showNotification('Connection lost. Please refresh the page.', 'error');
        }
    }

    /**
     * Toggle Theme
     */
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Set Theme
     */
    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sbards-theme', theme);

        // Update theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-toggle-icon');
            if (icon) {
                icon.className = `theme-toggle-icon fas fa-${theme === 'light' ? 'moon' : 'sun'}`;
            }
        }

        console.log(`🎨 Theme changed to: ${theme}`);
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Get Notification Icon
     */
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * Pause Updates
     */
    pauseUpdates() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    /**
     * Resume Updates
     */
    resumeUpdates() {
        if (!this.updateTimer) {
            this.startDataUpdates();
        }
    }

    /**
     * Initialize HTTP Polling (WebSocket alternative)
     */
    initHttpPolling() {
        console.log('🔄 Initializing HTTP polling for real-time updates');
        this.state.isConnected = true;
        this.updateConnectionStatus(true);
        this.showNotification('Real-time updates via HTTP polling', 'info');
    }

    /**
     * Initialize WebSocket Connection (disabled - library not available)
     */
    initWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/dashboard`;

            this.websocket = new WebSocket(wsUrl);

            this.websocket.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.state.isConnected = true;
                this.showNotification('Real-time connection established', 'success');

                // Update connection status in UI
                this.updateConnectionStatus(true);

                // Send heartbeat every 30 seconds
                this.heartbeatInterval = setInterval(() => {
                    if (this.websocket.readyState === WebSocket.OPEN) {
                        this.websocket.send('ping');
                    }
                }, 30000);
            };

            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('❌ WebSocket message parsing failed:', error);
                }
            };

            this.websocket.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.state.isConnected = false;
                this.showNotification('Real-time connection lost', 'warning');

                // Update connection status in UI
                this.updateConnectionStatus(false);

                // Clear heartbeat
                if (this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                }

                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    this.initWebSocket();
                }, 5000);
            };

            this.websocket.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.showNotification('WebSocket connection error', 'error');
            };

        } catch (error) {
            console.error('❌ WebSocket initialization failed:', error);
            this.showNotification('Failed to initialize real-time connection', 'error');
        }
    }

    /**
     * Handle WebSocket Message
     */
    handleWebSocketMessage(data) {
        if (data.type === 'dashboard_update') {
            // Real-time dashboard update via WebSocket
            this.updateCharts(data.payload);
            this.updateMetrics(data.payload);
            this.updateStatusIndicators(data.payload);

            // Update last update time
            this.state.lastUpdate = new Date();
            this.updateLastUpdateTime();

            // Stop polling since we have real-time data
            if (this.updateTimer) {
                clearInterval(this.updateTimer);
                this.updateTimer = null;
            }

        } else if (data.type === 'notification') {
            // Real-time notification
            this.showNotification(data.title || data.message, data.level || 'info');

        } else if (data.type === 'alert') {
            // System alert
            this.handleSystemAlert(data);

        } else if (data.type === 'pong') {
            // Heartbeat response
            console.log('📡 Heartbeat received');
        }
    }

    /**
     * Handle System Alert
     */
    handleSystemAlert(alertData) {
        const { title, message, level, data } = alertData;

        // Show notification
        this.showNotification(title, level, 10000); // Show for 10 seconds

        // Update alert indicator if exists
        const alertIndicator = document.getElementById('alertIndicator');
        if (alertIndicator) {
            alertIndicator.className = `status-indicator status-${level}`;
            alertIndicator.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Alert`;
        }

        // Log to console
        console.warn('🚨 System Alert:', { title, message, level, data });
    }

    /**
     * Update Connection Status in UI
     */
    updateConnectionStatus(isConnected) {
        const statusElements = document.querySelectorAll('.connection-status');
        statusElements.forEach(element => {
            if (isConnected) {
                element.className = 'status-indicator status-active connection-status';
                element.innerHTML = '<i class="fas fa-wifi"></i> Connected';
            } else {
                element.className = 'status-indicator status-error connection-status';
                element.innerHTML = '<i class="fas fa-wifi"></i> Disconnected';
            }
        });
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }

        if (this.websocket) {
            this.websocket.close();
        }

        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sboardsDashboard = new SBARDSDashboard();
});

// Performance Optimization Utilities
class PerformanceOptimizer {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static enableHardwareAcceleration(element) {
        element.style.transform = 'translateZ(0)';
        element.style.willChange = 'transform, opacity';
        element.style.backfaceVisibility = 'hidden';
    }

    static optimizeScrolling() {
        let ticking = false;

        function updateScrollPosition() {
            const scrollTop = window.pageYOffset;
            const elements = document.querySelectorAll('.scroll-animate');

            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible) {
                    element.classList.add('in-view');
                }
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    static enableSmoothTransitions() {
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
}

// Enhanced performance for existing dashboard
if (window.sboardsDashboard) {
    // Enable hardware acceleration for charts
    document.querySelectorAll('canvas').forEach(canvas => {
        PerformanceOptimizer.enableHardwareAcceleration(canvas);
    });

    // Optimize scrolling
    PerformanceOptimizer.optimizeScrolling();

    // Enable smooth transitions
    PerformanceOptimizer.enableSmoothTransitions();

    console.log('⚡ Performance optimizations applied to existing dashboard');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SBARDSDashboard;
}
