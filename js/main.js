
import { DataManager } from './dataManager.js';
import { ChartManager } from './chartManager.js';
import { DragDropManager } from './dragDrop.js';
import { HeaderManager } from './components/header.js';
import { WidgetManager } from './components/card.js';

class DashboardApp {
    constructor() {
        this.dataManager = new DataManager();
        this.chartManager = new ChartManager();
        this.dragDropManager = new DragDropManager();
        this.headerManager = new HeaderManager();
        this.widgetManager = new WidgetManager();
        
        this.widgets = [];
        this.init();
    }

    async init() {
        try {
            // Initialize all components
            await this.initializeApp();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load saved dashboard state
            this.loadDashboardState();
            
            // Hide loading indicator
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to load dashboard. Please refresh the page.');
        }
    }

    async initializeApp() {
        // Initialize service worker for PWA functionality
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./js/serviceWorker.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed: ', err));
        }

        // Initialize components
        this.headerManager.init();
        this.dragDropManager.init(this.widgetManager);
    }

    setupEventListeners() {
        // Add widget button
        document.getElementById('add-widget').addEventListener('click', () => {
            this.addRandomWidget();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for widget changes
        document.addEventListener('widgetChanged', () => {
            this.saveDashboardState();
        });

        // Listen for widget removal
        document.addEventListener('widgetRemoved', (e) => {
            this.removeWidget(e.detail.widgetId);
        });
    }

    async addRandomWidget() {
        const widgetTypes = ['bar', 'line', 'pie', 'doughnut', 'stats'];
        const randomType = widgetTypes[Math.floor(Math.random() * widgetTypes.length)];
        
        const widgetId = Date.now().toString();
        const widgetData = await this.generateWidgetData(randomType);
        
        const widget = {
            id: widgetId,
            type: randomType,
            title: this.getWidgetTitle(randomType),
            data: widgetData,
            position: this.widgets.length
        };

        this.widgets.push(widget);
        this.widgetManager.createWidget(widget);
        this.saveDashboardState();
    }

    async generateWidgetData(type) {
        switch (type) {
            case 'bar':
            case 'line':
                return await this.dataManager.fetchChartData();
            case 'pie':
            case 'doughnut':
                return await this.dataManager.fetchPieChartData();
            case 'stats':
                return await this.dataManager.fetchStatsData();
            default:
                return await this.dataManager.fetchChartData();
        }
    }

    getWidgetTitle(type) {
        const titles = {
            bar: 'Sales Performance',
            line: 'Revenue Trend',
            pie: 'Market Share',
            doughnut: 'Task Distribution',
            stats: 'Key Metrics'
        };
        return titles[type] || 'Analytics Widget';
    }

    removeWidget(widgetId) {
        this.widgets = this.widgets.filter(widget => widget.id !== widgetId);
        this.saveDashboardState();
    }

    saveDashboardState() {
        const dashboardState = {
            widgets: this.widgets,
            theme: document.documentElement.getAttribute('data-theme') || 'light',
            layout: this.widgets.map(widget => widget.id)
        };
        
        localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
    }

    loadDashboardState() {
        const savedState = localStorage.getItem('dashboardState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.widgets = state.widgets || [];
                
                // Apply saved theme
                if (state.theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.getElementById('theme-toggle').textContent = '☀️';
                }
                
                // Render saved widgets
                this.renderSavedWidgets();
                
            } catch (error) {
                console.error('Error loading saved state:', error);
                this.addDefaultWidgets();
            }
        } else {
            this.addDefaultWidgets();
        }
    }

    async renderSavedWidgets() {
        for (const widget of this.widgets) {
            this.widgetManager.createWidget(widget);
        }
    }

    async addDefaultWidgets() {
        // Add some default widgets if no saved state
        const defaultWidgets = [
            {
                id: '1',
                type: 'bar',
                title: 'Monthly Revenue',
                data: await this.dataManager.fetchChartData(),
                position: 0
            },
            {
                id: '2',
                type: 'line',
                title: 'User Growth',
                data: await this.dataManager.fetchChartData(),
                position: 1
            },
            {
                id: '3',
                type: 'stats',
                title: 'Performance Metrics',
                data: await this.dataManager.fetchStatsData(),
                position: 2
            }
        ];

        this.widgets = defaultWidgets;
        this.renderSavedWidgets();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        this.saveDashboardState();
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger-color);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 1000;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});

// Export for testing purposes
window.DashboardApp = DashboardApp;