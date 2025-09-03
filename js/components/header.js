export class HeaderManager {
    constructor() {
        this.currentTheme = 'light';
    }

    init() {
        this.setupThemeToggle();
        this.setupAddWidgetButton();
        this.loadSavedTheme();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupAddWidgetButton() {
        const addWidgetBtn = document.getElementById('add-widget');
        if (addWidgetBtn) {
            addWidgetBtn.addEventListener('click', () => {
                this.addWidget();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update toggle button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }

        // Save theme preference
        this.saveTheme();
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    saveTheme() {
        localStorage.setItem('dashboardTheme', this.currentTheme);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('dashboardTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    addWidget() {
        // This will be handled by the main app
        const event = new CustomEvent('addWidgetRequest', {
            detail: {
                type: 'random',
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    updateHeaderTitle(title) {
        const headerTitle = document.querySelector('#dashboard-header h1');
        if (headerTitle && title) {
            headerTitle.textContent = title;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}