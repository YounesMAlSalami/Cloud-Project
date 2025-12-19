/**
 * SBARDS Navigation System
 * Advanced navigation between layers and components
 */

class NavigationManager {
    constructor() {
        this.currentLayer = 'dashboard';
        this.layers = {
            'dashboard': {
                name: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                url: '/dashboard',
                description: 'Main system overview'
            },
            'capture': {
                name: 'Capture Layer',
                icon: 'fas fa-shield-alt',
                url: '/api/capture/status/page',
                description: 'File interception and monitoring'
            },
            'analytics': {
                name: 'Analytics',
                icon: 'fas fa-chart-line',
                url: '/analytics',
                description: 'Data analysis and reporting'
            },
            'notifications': {
                name: 'Notifications',
                icon: 'fas fa-bell',
                url: '/notifications',
                description: 'Alert and notification management'
            },
            'health': {
                name: 'System Health',
                icon: 'fas fa-heartbeat',
                url: '/api/health/page',
                description: 'System health monitoring'
            },
            'docs': {
                name: 'API Documentation',
                icon: 'fas fa-book',
                url: '/api/docs/enhanced',
                description: 'Enhanced API documentation with dashboard integration'
            },
            'swagger': {
                name: 'Swagger UI',
                icon: 'fas fa-code',
                url: '/api/docs',
                description: 'Interactive Swagger API documentation'
            }
        };
        this.init();
    }

    /**
     * Initialize navigation system
     */
    init() {
        this.createNavigationBar();
        this.setupEventListeners();
        this.updateCurrentLayer();
        this.initializeTheme();
        console.log('🧭 Navigation system initialized');
    }

    /**
     * Create navigation bar
     */
    createNavigationBar() {
        // Check if navigation already exists
        if (document.getElementById('sbards-navigation')) {
            return;
        }

        const navHTML = `
            <nav id="sbards-navigation" class="sbards-nav">
                <div class="nav-container">
                    <div class="nav-brand">
                        <i class="fas fa-shield-alt"></i>
                        <span>SBARDS</span>
                    </div>
                    <div class="nav-links">
                        ${this.generateNavLinks()}
                    </div>
                    <div class="nav-actions">
                        <button class="nav-action-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode">
                            <i class="fas fa-moon"></i>
                        </button>
                        <button class="nav-action-btn" id="refreshBtn" title="Refresh Data">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="nav-action-btn" id="settingsBtn" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
            </nav>
        `;

        // Insert navigation at the top of body
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // Add navigation styles
        this.addNavigationStyles();
    }

    /**
     * Generate navigation links
     */
    generateNavLinks() {
        return Object.entries(this.layers).map(([key, layer]) => `
            <a href="${layer.url}" class="nav-link" data-layer="${key}" title="${layer.description}">
                <i class="${layer.icon}"></i>
                <span>${layer.name}</span>
            </a>
        `).join('');
    }

    /**
     * Add navigation styles
     */
    addNavigationStyles() {
        if (document.getElementById('navigation-styles')) {
            return;
        }

        const styles = `
            .sbards-nav {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, var(--theme-bg-primary), var(--theme-bg-secondary));
                border-bottom: 1px solid var(--theme-border-color);
                box-shadow: var(--shadow-md);
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .nav-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem 1.5rem;
                max-width: 1400px;
                margin: 0 auto;
            }

            .nav-brand {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--theme-accent-primary);
            }

            .nav-brand i {
                font-size: 1.5rem;
            }

            .nav-links {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .nav-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                color: var(--theme-text-secondary);
                text-decoration: none;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                font-weight: 500;
            }

            .nav-link:hover {
                background: var(--theme-accent-primary-alpha);
                color: var(--theme-accent-primary);
                transform: translateY(-1px);
            }

            .nav-link.active {
                background: var(--theme-accent-primary);
                color: white;
                box-shadow: var(--shadow-sm);
            }

            .nav-link i {
                font-size: 1rem;
            }

            .nav-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .nav-action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 8px;
                background: var(--theme-bg-card);
                color: var(--theme-text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
            }

            .nav-action-btn:hover {
                background: var(--theme-accent-primary);
                color: white;
                transform: translateY(-1px);
            }

            .nav-action-btn.loading {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Adjust main content for navigation */
            body {
                padding-top: 70px;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .nav-container {
                    padding: 0.5rem 1rem;
                }

                .nav-links {
                    gap: 0.25rem;
                }

                .nav-link span {
                    display: none;
                }

                .nav-link {
                    padding: 0.5rem;
                    min-width: 40px;
                    justify-content: center;
                }

                .nav-brand span {
                    display: none;
                }

                body {
                    padding-top: 60px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'navigation-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation link clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const layer = navLink.dataset.layer;
                this.navigateToLayer(layer);
            }
        });

        // Theme toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#themeToggleBtn')) {
                this.toggleTheme();
            }
        });

        // Refresh button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#refreshBtn')) {
                this.refreshCurrentLayer();
            }
        });

        // Settings button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#settingsBtn')) {
                this.openSettings();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.updateCurrentLayer();
        });
    }

    /**
     * Navigate to specific layer
     */
    async navigateToLayer(layerKey) {
        if (!this.layers[layerKey]) {
            console.error(`Unknown layer: ${layerKey}`);
            return;
        }

        const layer = this.layers[layerKey];

        try {
            // Show loading state
            this.setLoadingState(true);

            // Update current layer
            this.currentLayer = layerKey;

            // Direct navigation for better performance
            window.location.href = layer.url;

        } catch (error) {
            console.error(`Navigation error: ${error}`);
            this.showNavigationError(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Load layer content
     */
    async loadLayerContent(layer) {
        try {
            const response = await fetch(layer.url);

            if (!response.ok) {
                throw new Error(`Failed to load ${layer.name}: ${response.statusText}`);
            }

            const content = await response.text();

            // Update page content
            document.title = `SBARDS - ${layer.name}`;

            // If it's HTML content, replace body content
            if (content.includes('<!DOCTYPE html>')) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const newBody = doc.body;

                // Preserve navigation
                const nav = document.getElementById('sbards-navigation');
                document.body.innerHTML = newBody.innerHTML;
                if (nav) {
                    document.body.insertAdjacentElement('afterbegin', nav);
                }
            } else {
                // For API responses, show in a container
                this.showApiResponse(content, layer);
            }

        } catch (error) {
            throw new Error(`Failed to load ${layer.name}: ${error.message}`);
        }
    }

    /**
     * Show API response in formatted container
     */
    showApiResponse(content, layer) {
        try {
            const data = JSON.parse(content);
            const formattedContent = `
                <div class="api-response-container">
                    <div class="api-response-header">
                        <h2><i class="${layer.icon}"></i> ${layer.name}</h2>
                        <p>${layer.description}</p>
                    </div>
                    <div class="api-response-content">
                        <pre><code>${JSON.stringify(data, null, 2)}</code></pre>
                    </div>
                </div>
            `;

            // Find main content area or create one
            let contentArea = document.querySelector('.main-content, main, .container');
            if (!contentArea) {
                contentArea = document.createElement('div');
                contentArea.className = 'main-content';
                document.body.appendChild(contentArea);
            }

            contentArea.innerHTML = formattedContent;

        } catch (error) {
            // If not JSON, show as plain text
            const contentArea = document.querySelector('.main-content, main, .container') || document.body;
            contentArea.innerHTML = `
                <div class="api-response-container">
                    <div class="api-response-header">
                        <h2><i class="${layer.icon}"></i> ${layer.name}</h2>
                        <p>${layer.description}</p>
                    </div>
                    <div class="api-response-content">
                        <pre>${content}</pre>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Update navigation state
     */
    updateNavigationState() {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current layer
        const currentLink = document.querySelector(`[data-layer="${this.currentLayer}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    /**
     * Update current layer based on URL
     */
    updateCurrentLayer() {
        const path = window.location.pathname;

        // Find matching layer
        for (const [key, layer] of Object.entries(this.layers)) {
            if (path === layer.url || path.startsWith(layer.url)) {
                this.currentLayer = key;
                break;
            }
        }

        this.updateNavigationState();
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            if (loading) {
                refreshBtn.classList.add('loading');
            } else {
                refreshBtn.classList.remove('loading');
            }
        }
    }

    /**
     * Refresh current layer
     */
    async refreshCurrentLayer() {
        const layer = this.layers[this.currentLayer];
        if (layer) {
            await this.loadLayerContent(layer);
            console.log(`🔄 Refreshed ${layer.name}`);
        }
    }

    /**
     * Open settings
     */
    openSettings() {
        // Use interactive components if available
        if (window.interactiveComponents) {
            const settingsContent = `
                <div class="settings-container">
                    <h3>SBARDS Settings</h3>
                    <div class="setting-group">
                        <label>Theme</label>
                        <select id="themeSelect">
                            <option value="auto">Auto</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>Auto-refresh</label>
                        <input type="checkbox" id="autoRefresh" checked>
                    </div>
                </div>
            `;

            window.interactiveComponents.showModal('settings', 'Settings', settingsContent);
        } else {
            alert('Settings panel coming soon!');
        }
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);

        // Update button icon
        const themeBtn = document.getElementById('themeToggleBtn');
        const icon = themeBtn.querySelector('i');

        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeBtn.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeBtn.title = 'Switch to Dark Mode';
        }

        // Save preference
        localStorage.setItem('sbards-theme', newTheme);

        // Show notification
        this.showThemeNotification(newTheme);

        console.log(`🎨 Theme switched to: ${newTheme}`);
    }

    /**
     * Initialize theme from saved preference
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('sbards-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', theme);

        // Update button icon
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                themeBtn.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                themeBtn.title = 'Switch to Dark Mode';
            }
        }
    }

    /**
     * Enhanced theme toggle with smooth transition
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Add transition class for smooth theme change
        document.body.classList.add('theme-transitioning');

        // Apply new theme
        this.setTheme(newTheme);

        // Update theme toggle button
        this.updateThemeToggleButton(newTheme);

        // Show notification
        this.showThemeNotification(newTheme);

        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);

        // Save preference
        localStorage.setItem('sbards-theme', newTheme);

        console.log(`🎨 Theme switched to: ${newTheme}`);
    }

    /**
     * Set theme with enhanced functionality
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#f8f9fa';

        // Update favicon if needed
        this.updateFavicon(theme);

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, timestamp: Date.now() }
        }));
    }

    /**
     * Update theme toggle button appearance
     */
    updateThemeToggleButton(theme) {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }

            // Update tooltip
            themeBtn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;

            // Add visual feedback
            themeBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    /**
     * Update favicon based on theme
     */
    updateFavicon(theme) {
        // This is optional - you can add different favicons for light/dark themes
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            // You can implement different favicons for different themes here
            // favicon.href = theme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico';
        }
    }

    /**
     * Show theme change notification
     */
    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${theme === 'dark' ? 'moon' : 'sun'}"></i>
                <span>${theme === 'dark' ? 'Dark' : 'Light'} mode activated</span>
            </div>
        `;

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--theme-accent-primary)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-md)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    /**
     * Show navigation error
     */
    showNavigationError(message) {
        console.error('Navigation error:', message);

        // Show user-friendly error
        if (window.dashboard && window.dashboard.showNotification) {
            window.dashboard.showNotification(`Navigation error: ${message}`, 'error');
        } else {
            alert(`Navigation error: ${message}`);
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.navigationManager = new NavigationManager();
    });
} else {
    window.navigationManager = new NavigationManager();
}
