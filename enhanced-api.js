/**
 * Enhanced API Interaction and UI Management
 * Professional JavaScript for SBARDS API
 */

class EnhancedAPIManager {
    constructor() {
        this.config = {
            apiBaseUrl: '/api',
            retryAttempts: 3,
            retryDelay: 1000,
            requestTimeout: 10000
        };
        
        this.state = {
            isConnected: true,
            lastUpdate: null,
            activeRequests: new Set(),
            cache: new Map()
        };
        
        this.init();
    }

    /**
     * Initialize the API manager
     */
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.startHealthMonitoring();
        console.log('🚀 Enhanced API Manager initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('#themeToggleBtn, #themeToggleBtn *')) {
                this.toggleTheme();
            }
        });

        // Navigation enhancement
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-btn, .nav-btn *')) {
                e.preventDefault();
                const url = e.target.closest('.nav-btn').href;
                this.navigateWithLoading(url);
            }
        });

        // API endpoint testing
        document.addEventListener('click', (e) => {
            if (e.target.matches('.test-endpoint-btn')) {
                e.preventDefault();
                const endpoint = e.target.dataset.endpoint;
                this.testEndpoint(endpoint);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window events
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    /**
     * Initialize theme based on user preference
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('sbards-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        this.setTheme(theme);
        this.updateThemeToggleButton(theme);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class
        document.body.classList.add('theme-transitioning');
        
        // Apply new theme
        this.setTheme(newTheme);
        this.updateThemeToggleButton(newTheme);
        this.showNotification(`Switched to ${newTheme} mode`, 'success');
        
        // Remove transition class
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        // Save preference
        localStorage.setItem('sbards-theme', newTheme);
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#f8f9fa';
    }

    /**
     * Update theme toggle button
     */
    updateThemeToggleButton(theme) {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            themeBtn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
        }
    }

    /**
     * Enhanced navigation with loading states
     */
    async navigateWithLoading(url) {
        this.showLoadingIndicator();
        
        try {
            // Add smooth transition
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0.9';
            
            // Navigate after short delay for smooth effect
            setTimeout(() => {
                window.location.href = url;
            }, 200);
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.hideLoadingIndicator();
            this.showNotification('Navigation failed', 'error');
        }
    }

    /**
     * Test API endpoint
     */
    async testEndpoint(endpoint) {
        const requestId = `test-${Date.now()}`;
        this.state.activeRequests.add(requestId);
        
        try {
            this.showNotification(`Testing ${endpoint}...`, 'info');
            
            const response = await this.makeRequest('GET', endpoint);
            
            if (response.ok) {
                const data = await response.json();
                this.showNotification(`✅ ${endpoint} - Success`, 'success');
                console.log(`API Test Result for ${endpoint}:`, data);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error(`API Test Failed for ${endpoint}:`, error);
            this.showNotification(`❌ ${endpoint} - Failed: ${error.message}`, 'error');
        } finally {
            this.state.activeRequests.delete(requestId);
        }
    }

    /**
     * Make HTTP request with retry logic
     */
    async makeRequest(method, endpoint, data = null, options = {}) {
        const url = `${this.config.apiBaseUrl}${endpoint}`;
        let lastError;
        
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);
                
                const requestOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    signal: controller.signal,
                    ...options
                };
                
                if (data && method !== 'GET') {
                    requestOptions.body = JSON.stringify(data);
                }
                
                const response = await fetch(url, requestOptions);
                clearTimeout(timeoutId);
                
                return response;
                
            } catch (error) {
                lastError = error;
                console.warn(`Request attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.config.retryAttempts) {
                    await this.delay(this.config.retryDelay * attempt);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        const existingLoader = document.getElementById('api-loading');
        if (existingLoader) return;
        
        const loader = document.createElement('div');
        loader.id = 'api-loading';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                background: var(--theme-bg-card);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 1px solid var(--theme-border-color);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--theme-text-primary);
                font-weight: 500;
                animation: slideInRight 0.3s ease;
            ">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--theme-accent-primary);
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                "></div>
                <span>Loading...</span>
            </div>
        `;
        
        document.body.appendChild(loader);
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        const loader = document.getElementById('api-loading');
        if (loader) {
            loader.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 300);
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        const colors = {
            success: 'var(--theme-success)',
            error: 'var(--theme-danger)',
            warning: 'var(--theme-warning)',
            info: 'var(--theme-accent-primary)'
        };
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10002;
                background: var(--theme-bg-card);
                color: var(--theme-text-primary);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-left: 4px solid ${colors[type]};
                max-width: 350px;
                animation: slideInRight 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            ">
                <i class="${icons[type]}" style="color: ${colors[type]}; font-size: 1.2rem;"></i>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: var(--theme-text-secondary);
                    cursor: pointer;
                    padding: 0;
                    font-size: 1.2rem;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.firstElementChild.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.focusSearch();
        }
        
        // Ctrl/Cmd + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleTheme();
        }
        
        // Escape to close modals/notifications
        if (e.key === 'Escape') {
            this.closeModalsAndNotifications();
        }
    }

    /**
     * Focus search input
     */
    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], #endpointSearch');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    /**
     * Close modals and notifications
     */
    closeModalsAndNotifications() {
        // Close notifications
        const notifications = document.querySelectorAll('[id^="api-"], .notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    /**
     * Handle connection change
     */
    handleConnectionChange(isOnline) {
        this.state.isConnected = isOnline;
        const message = isOnline ? 'Connection restored' : 'Connection lost';
        const type = isOnline ? 'success' : 'warning';
        this.showNotification(message, type);
    }

    /**
     * Start health monitoring
     */
    startHealthMonitoring() {
        // Check API health every 30 seconds
        setInterval(async () => {
            try {
                const response = await this.makeRequest('GET', '/health');
                if (response.ok) {
                    this.state.isConnected = true;
                    this.state.lastUpdate = new Date();
                }
            } catch (error) {
                console.warn('Health check failed:', error);
                this.state.isConnected = false;
            }
        }, 30000);
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedAPIManager = new EnhancedAPIManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAPIManager;
}
