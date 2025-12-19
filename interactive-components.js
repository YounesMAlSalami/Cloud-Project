/**
 * SBARDS Interactive UI Components
 * Advanced interactive components for enhanced user experience
 */

class InteractiveComponents {
    constructor() {
        this.modals = new Map();
        this.dragDropZones = new Map();
        this.dataTable = null;
        this.filters = new Map();
        this.loadingStates = new Set();
        this.notifications = [];
        this.init();
    }

    /**
     * Initialize all interactive components
     */
    init() {
        this.initModals();
        this.initDragDrop();
        this.initDataTables();
        this.initFilters();
        this.initTooltips();
        this.initContextMenus();
        this.initNotifications();
        this.initLoadingStates();
        this.setupGlobalKeyboardShortcuts();
        console.log('🎯 Interactive components v2.0 initialized');
    }

    /**
     * Initialize Notifications System
     */
    initNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const notificationContainer = document.createElement('div');
            notificationContainer.id = 'notificationContainer';
            notificationContainer.className = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10003;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notificationContainer');
        const id = 'notification_' + Date.now();

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const colors = {
            success: 'var(--theme-success)',
            error: 'var(--theme-danger)',
            warning: 'var(--theme-warning)',
            info: 'var(--theme-accent-primary)'
        };

        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            pointer-events: all;
            cursor: pointer;
            transition: transform 0.2s ease;
            max-width: 100%;
            word-wrap: break-word;
        `;

        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span style="flex: 1;">${message}</span>
            <button onclick="interactiveComponents.hideNotification('${id}')" style="background: none; border: none; color: white; cursor: pointer; padding: 0.25rem;">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add hover effect
        notification.addEventListener('mouseenter', () => {
            notification.style.transform = 'translateX(-5px)';
        });

        notification.addEventListener('mouseleave', () => {
            notification.style.transform = 'translateX(0)';
        });

        // Click to dismiss
        notification.addEventListener('click', () => {
            this.hideNotification(id);
        });

        container.appendChild(notification);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(id);
            }, duration);
        }

        return id;
    }

    /**
     * Hide Notification
     */
    hideNotification(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    /**
     * Initialize Loading States
     */
    initLoadingStates() {
        // Add loading styles
        const loadingStyles = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10004;
                backdrop-filter: blur(3px);
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid var(--theme-bg-tertiary);
                border-top: 4px solid var(--theme-accent-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-content {
                text-align: center;
                color: white;
            }

            .loading-text {
                margin-top: 1rem;
                font-size: 1.1rem;
                font-weight: 500;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        if (!document.getElementById('loadingStyles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'loadingStyles';
            styleSheet.textContent = loadingStyles;
            document.head.appendChild(styleSheet);
        }
    }

    /**
     * Show Loading Overlay
     */
    showLoading(message = 'Loading...') {
        this.hideLoading(); // Remove any existing loading overlay

        const overlay = document.createElement('div');
        overlay.id = 'globalLoadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.loadingStates.add('global');
    }

    /**
     * Hide Loading Overlay
     */
    hideLoading() {
        const overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) {
            overlay.remove();
            this.loadingStates.delete('global');
        }
    }

    /**
     * Setup Global Keyboard Shortcuts
     */
    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showSearchModal();
            }

            // Escape to close modals/notifications
            if (e.key === 'Escape') {
                // Close all notifications
                const notifications = document.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    this.hideNotification(notification.id);
                });

                // Close loading overlay
                this.hideLoading();
            }

            // Ctrl/Cmd + / for help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showHelpModal();
            }
        });
    }

    /**
     * Show Search Modal
     */
    showSearchModal() {
        const searchContent = `
            <div style="margin-bottom: 1rem;">
                <input type="text" id="globalSearch" placeholder="Search pages, features, or documentation..."
                       style="width: 100%; padding: 0.75rem; border: 1px solid var(--theme-border-color); border-radius: 6px; font-size: 1rem;">
            </div>
            <div id="searchResults" style="max-height: 300px; overflow-y: auto;">
                <div style="text-align: center; color: var(--theme-text-secondary); padding: 2rem;">
                    Start typing to search...
                </div>
            </div>
        `;

        this.showModal('search', '🔍 Quick Search', searchContent);

        // Focus search input
        setTimeout(() => {
            document.getElementById('globalSearch').focus();
        }, 100);

        // Add search functionality
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    }

    /**
     * Perform Search
     */
    performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');

        if (!query.trim()) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: var(--theme-text-secondary); padding: 2rem;">
                    Start typing to search...
                </div>
            `;
            return;
        }

        // Mock search results (replace with actual search logic)
        const searchResults = [
            { title: 'Dashboard', url: '/dashboard', description: 'Main system overview and metrics' },
            { title: 'Health Monitor', url: '/api/health/page', description: 'System health and status monitoring' },
            { title: 'Capture Layer', url: '/api/capture/status/page', description: 'File interception and monitoring' },
            { title: 'API Documentation', url: '/api/docs', description: 'Complete API reference' },
            { title: 'Enhanced Docs', url: '/api/docs/enhanced', description: 'Enhanced API documentation with examples' }
        ].filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        if (searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: var(--theme-text-secondary); padding: 2rem;">
                    No results found for "${query}"
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = searchResults.map(result => `
            <div onclick="window.location.href='${result.url}'; interactiveComponents.hideModal('search');"
                 style="padding: 0.75rem; border-bottom: 1px solid var(--theme-border-color); cursor: pointer; transition: background 0.2s ease;"
                 onmouseover="this.style.background='var(--theme-bg-secondary)'"
                 onmouseout="this.style.background='transparent'">
                <div style="font-weight: 600; color: var(--theme-text-primary); margin-bottom: 0.25rem;">
                    ${result.title}
                </div>
                <div style="font-size: 0.9rem; color: var(--theme-text-secondary);">
                    ${result.description}
                </div>
            </div>
        `).join('');
    }

    /**
     * Show Help Modal
     */
    showHelpModal() {
        const helpContent = `
            <div style="line-height: 1.6;">
                <h4 style="margin-top: 0; color: var(--theme-accent-primary);">Keyboard Shortcuts</h4>
                <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Quick Search</span>
                        <kbd style="background: var(--theme-bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + K</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Help</span>
                        <kbd style="background: var(--theme-bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + /</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Close Modal/Notifications</span>
                        <kbd style="background: var(--theme-bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Escape</kbd>
                    </div>
                </div>

                <h4 style="color: var(--theme-accent-primary);">Navigation</h4>
                <div style="margin-bottom: 1.5rem;">
                    <p>Use the navigation bar at the top to quickly switch between different sections of SBARDS.</p>
                    <p>Click the theme toggle button to switch between light and dark modes.</p>
                </div>

                <h4 style="color: var(--theme-accent-primary);">Features</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li>Real-time system monitoring</li>
                    <li>File capture and analysis</li>
                    <li>Interactive API documentation</li>
                    <li>Health status monitoring</li>
                    <li>Dark/Light theme support</li>
                </ul>
            </div>
        `;

        this.showModal('help', '❓ Help & Shortcuts', helpContent);
    }

    /**
     * Initialize Modal System
     */
    initModals() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modalContainer')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'modalContainer';
            modalContainer.className = 'modal-container';
            document.body.appendChild(modalContainer);
        }

        // Add modal styles
        this.addModalStyles();
    }

    /**
     * Show Modal with enhanced functionality
     */
    showModal(id, title, content, options = {}) {
        const container = document.getElementById('modalContainer');

        // Remove existing modal with same ID
        this.hideModal(id);

        const modalHTML = `
            <div class="modal-overlay" onclick="interactiveComponents.hideModal('${id}')">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="interactiveComponents.hideModal('${id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.id = `modal-${id}`;
        modalElement.innerHTML = modalHTML;
        container.appendChild(modalElement);

        // Animate in
        setTimeout(() => {
            const overlay = modalElement.querySelector('.modal-overlay');
            const modal = modalElement.querySelector('.modal');
            overlay.classList.add('active');
            modal.classList.add('active');
        }, 10);

        // Store modal reference
        this.modals.set(id, modalElement);

        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(id);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modalElement;
    }

    /**
     * Hide Modal
     */
    hideModal(id) {
        const modalElement = document.getElementById(`modal-${id}`);
        if (modalElement) {
            const overlay = modalElement.querySelector('.modal-overlay');
            const modal = modalElement.querySelector('.modal');

            overlay.classList.remove('active');
            modal.classList.remove('active');

            setTimeout(() => {
                if (modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
                this.modals.delete(id);
            }, 300);
        }
    }

    /**
     * Add Modal CSS Styles
     */
    addModalStyles() {
        const styles = `
            .modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                pointer-events: none;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: all;
            }

            .modal-overlay.active {
                opacity: 1;
            }

            .modal {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: var(--theme-bg-card);
                border-radius: 12px;
                box-shadow: var(--shadow-xl);
                border: 1px solid var(--theme-border-color);
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transition: transform 0.3s ease;
                pointer-events: all;
            }

            .modal.active {
                transform: translate(-50%, -50%) scale(1);
            }

            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--theme-border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--theme-bg-secondary);
            }

            .modal-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--theme-text-primary);
                margin: 0;
            }

            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--theme-text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .modal-close:hover {
                background: var(--theme-bg-primary);
                color: var(--theme-text-primary);
            }

            .modal-body {
                padding: 1.5rem;
                max-height: 60vh;
                overflow-y: auto;
            }

            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid var(--theme-border-color);
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                background: var(--theme-bg-secondary);
            }

            .drag-drop-zone {
                border: 2px dashed var(--theme-border-color);
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
                background: var(--theme-bg-secondary);
            }

            .drag-drop-zone:hover,
            .drag-drop-zone.drag-over {
                border-color: var(--theme-accent-primary);
                background: var(--theme-accent-primary-alpha);
                transform: translateY(-2px);
            }

            .drag-drop-zone.uploading {
                border-color: var(--theme-success);
                background: var(--theme-success-alpha);
            }

            .drag-drop-icon {
                font-size: 3rem;
                color: var(--theme-text-secondary);
                margin-bottom: 1rem;
            }

            .drag-drop-text {
                color: var(--theme-text-primary);
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
            }

            .drag-drop-subtext {
                color: var(--theme-text-secondary);
                font-size: 0.9rem;
            }

            .upload-progress {
                margin-top: 1rem;
                background: var(--theme-bg-primary);
                border-radius: 6px;
                overflow: hidden;
                height: 8px;
            }

            .upload-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--theme-accent-primary), var(--theme-success));
                transition: width 0.3s ease;
                width: 0%;
            }

            .data-table {
                width: 100%;
                border-collapse: collapse;
                background: var(--theme-bg-card);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: var(--shadow-sm);
            }

            .data-table th,
            .data-table td {
                padding: 0.75rem 1rem;
                text-align: left;
                border-bottom: 1px solid var(--theme-border-color);
            }

            .data-table th {
                background: var(--theme-bg-secondary);
                font-weight: 600;
                color: var(--theme-text-primary);
                cursor: pointer;
                user-select: none;
                position: relative;
            }

            .data-table th:hover {
                background: var(--theme-bg-primary);
            }

            .data-table th.sortable::after {
                content: '↕️';
                position: absolute;
                right: 0.5rem;
                opacity: 0.5;
            }

            .data-table th.sort-asc::after {
                content: '↑';
                opacity: 1;
            }

            .data-table th.sort-desc::after {
                content: '↓';
                opacity: 1;
            }

            .data-table tr:hover {
                background: var(--theme-bg-secondary);
            }

            .filter-container {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
                align-items: center;
            }

            .filter-input {
                padding: 0.5rem 0.75rem;
                border: 1px solid var(--theme-border-color);
                border-radius: 6px;
                background: var(--theme-bg-card);
                color: var(--theme-text-primary);
                font-size: 0.9rem;
            }

            .filter-input:focus {
                outline: none;
                border-color: var(--theme-accent-primary);
                box-shadow: 0 0 0 2px var(--theme-accent-primary-alpha);
            }

            .tooltip {
                position: absolute;
                background: var(--theme-bg-primary);
                color: var(--theme-text-primary);
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.8rem;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--theme-border-color);
                z-index: 10001;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                max-width: 200px;
                word-wrap: break-word;
            }

            .tooltip.active {
                opacity: 1;
            }

            .context-menu {
                position: absolute;
                background: var(--theme-bg-card);
                border: 1px solid var(--theme-border-color);
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 10002;
                min-width: 150px;
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.2s ease;
                pointer-events: none;
            }

            .context-menu.active {
                opacity: 1;
                transform: scale(1);
                pointer-events: all;
            }

            .context-menu-item {
                padding: 0.75rem 1rem;
                cursor: pointer;
                color: var(--theme-text-primary);
                border-bottom: 1px solid var(--theme-border-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: background 0.2s ease;
            }

            .context-menu-item:last-child {
                border-bottom: none;
            }

            .context-menu-item:hover {
                background: var(--theme-bg-secondary);
            }

            .context-menu-item.danger:hover {
                background: var(--theme-error-alpha);
                color: var(--theme-error);
            }
        `;

        // Add styles to document
        if (!document.getElementById('interactiveComponentsStyles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'interactiveComponentsStyles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    /**
     * Show Modal
     */
    showModal(id, title, content, options = {}) {
        const container = document.getElementById('modalContainer');

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="modalOverlay_${id}">
                <div class="modal" id="modal_${id}">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="interactiveComponents.hideModal('${id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                </div>
            </div>
        `;

        container.innerHTML = modalHTML;
        container.style.pointerEvents = 'all';

        // Animate in
        setTimeout(() => {
            document.getElementById(`modalOverlay_${id}`).classList.add('active');
            document.getElementById(`modal_${id}`).classList.add('active');
        }, 10);

        // Store modal reference
        this.modals.set(id, {
            element: document.getElementById(`modal_${id}`),
            overlay: document.getElementById(`modalOverlay_${id}`)
        });

        // Close on overlay click
        document.getElementById(`modalOverlay_${id}`).addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal(id);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(id);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /**
     * Hide Modal
     */
    hideModal(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.overlay.classList.remove('active');
            modal.element.classList.remove('active');

            setTimeout(() => {
                document.getElementById('modalContainer').innerHTML = '';
                document.getElementById('modalContainer').style.pointerEvents = 'none';
                this.modals.delete(id);
            }, 300);
        }
    }

    /**
     * Initialize Drag and Drop
     */
    initDragDrop() {
        // Will be implemented when needed
        console.log('🎯 Drag & Drop system ready');
    }

    /**
     * Create Drag & Drop Zone
     */
    createDragDropZone(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const zone = document.createElement('div');
        zone.className = 'drag-drop-zone';
        zone.innerHTML = `
            <div class="drag-drop-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <div class="drag-drop-text">
                ${options.text || 'Drag & drop files here'}
            </div>
            <div class="drag-drop-subtext">
                ${options.subtext || 'or click to browse'}
            </div>
            <div class="upload-progress" style="display: none;">
                <div class="upload-progress-bar"></div>
            </div>
        `;

        // File input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = options.multiple || false;
        fileInput.accept = options.accept || '*/*';
        fileInput.style.display = 'none';

        container.appendChild(zone);
        container.appendChild(fileInput);

        // Event handlers
        zone.addEventListener('click', () => fileInput.click());

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            this.handleFileUpload(e.dataTransfer.files, zone, options);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files, zone, options);
        });

        this.dragDropZones.set(containerId, { zone, fileInput, options });
    }

    /**
     * Handle File Upload
     */
    async handleFileUpload(files, zone, options) {
        if (files.length === 0) return;

        zone.classList.add('uploading');
        const progressContainer = zone.querySelector('.upload-progress');
        const progressBar = zone.querySelector('.upload-progress-bar');

        progressContainer.style.display = 'block';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progress = ((i + 1) / files.length) * 100;

            progressBar.style.width = `${progress}%`;

            try {
                if (options.onUpload) {
                    await options.onUpload(file);
                } else {
                    // Default upload to /api/upload
                    await this.uploadFile(file);
                }
            } catch (error) {
                console.error('Upload failed:', error);
                if (options.onError) {
                    options.onError(error, file);
                }
            }
        }

        setTimeout(() => {
            zone.classList.remove('uploading');
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
        }, 1000);
    }

    /**
     * Upload File to API
     */
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Initialize Data Tables
     */
    initDataTables() {
        console.log('🎯 Data tables system ready');
    }

    /**
     * Initialize Filters
     */
    initFilters() {
        console.log('🎯 Filters system ready');
    }

    /**
     * Initialize Tooltips
     */
    initTooltips() {
        // Create tooltip element
        if (!document.getElementById('globalTooltip')) {
            const tooltip = document.createElement('div');
            tooltip.id = 'globalTooltip';
            tooltip.className = 'tooltip';
            document.body.appendChild(tooltip);
        }

        // Add tooltip functionality to elements with data-tooltip
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.showTooltip(element, element.getAttribute('data-tooltip'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.hideTooltip();
            }
        });
    }

    /**
     * Show Tooltip
     */
    showTooltip(element, text) {
        const tooltip = document.getElementById('globalTooltip');
        tooltip.textContent = text;
        tooltip.classList.add('active');

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    }

    /**
     * Hide Tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('globalTooltip');
        tooltip.classList.remove('active');
    }

    /**
     * Initialize Context Menus
     */
    initContextMenus() {
        // Create context menu container
        if (!document.getElementById('globalContextMenu')) {
            const contextMenu = document.createElement('div');
            contextMenu.id = 'globalContextMenu';
            contextMenu.className = 'context-menu';
            document.body.appendChild(contextMenu);
        }

        // Hide context menu on click outside
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        console.log('🎯 Context menus system ready');
    }

    /**
     * Show Context Menu
     */
    showContextMenu(x, y, items) {
        const contextMenu = document.getElementById('globalContextMenu');

        const itemsHTML = items.map(item => `
            <div class="context-menu-item ${item.danger ? 'danger' : ''}"
                 onclick="${item.action}; interactiveComponents.hideContextMenu();">
                ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                ${item.label}
            </div>
        `).join('');

        contextMenu.innerHTML = itemsHTML;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('active');
    }

    /**
     * Hide Context Menu
     */
    hideContextMenu() {
        const contextMenu = document.getElementById('globalContextMenu');
        contextMenu.classList.remove('active');
    }
}

// Global instance
const interactiveComponents = new InteractiveComponents();
