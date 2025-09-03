import { ChartManager } from '../chartManager.js';

export class WidgetManager {
    constructor() {
        this.chartManager = new ChartManager();
        this.widgetCount = 0;
    }

    createWidget(widgetData) {
        const template = document.getElementById('widget-template');
        if (!template) {
            console.error('Widget template not found');
            return null;
        }

        const clone = template.content.cloneNode(true);
        const widgetElement = clone.querySelector('.widget');
        
        // Set widget ID
        widgetElement.id = `widget-${widgetData.id}`;
        // Set widget type as data attribute for drag-drop functionality
        widgetElement.setAttribute('data-widget-type', widgetData.type);
        // Set widget title
        const titleElement = widgetElement.querySelector('.widget-title');
        if (titleElement) {
            titleElement.textContent = widgetData.title;
        }

        // Set up close button
        const closeButton = widgetElement.querySelector('.widget-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.removeWidget(widgetData.id);
            });
        }

        // Add widget content based on type
        this.addWidgetContent(widgetElement, widgetData);

        // Add to DOM
        const widgetsContainer = document.getElementById('widgets-container');
        if (widgetsContainer) {
            widgetsContainer.appendChild(widgetElement);
        }

        this.widgetCount++;
        return widgetElement;
    }

    addWidgetContent(widgetElement, widgetData) {
        const contentElement = widgetElement.querySelector('.widget-content');
        if (!contentElement) return;

        switch (widgetData.type) {
            case 'bar':
            case 'line':
            case 'pie':
            case 'doughnut':
                this.addChartWidget(contentElement, widgetData);
                break;
            case 'stats':
                this.addStatsWidget(contentElement, widgetData);
                break;
            default:
                this.addChartWidget(contentElement, widgetData);
        }
    }

    addChartWidget(contentElement, widgetData) {
        const canvasId = `chart-${widgetData.id}-${Date.now()}`;
        
        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.className = 'chart-container';
        contentElement.appendChild(canvas);

        // Create chart after a small delay to ensure DOM is updated
        setTimeout(() => {
            this.chartManager.createChart(
                canvasId,
                widgetData.type,
                widgetData.data,
                this.getChartOptions(widgetData.type)
            );
        }, 100);
    }

    addStatsWidget(contentElement, widgetData) {
        const stats = widgetData.data;
        
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalUsers.toLocaleString()}</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$${stats.revenue.toLocaleString()}</div>
                    <div class="stat-label">Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.conversionRate}%</div>
                    <div class="stat-label">Conversion Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.activeUsers.toLocaleString()}</div>
                    <div class="stat-label">Active Users</div>
                </div>
            </div>
        `;
        
        contentElement.innerHTML = statsHTML;
    }

    getChartOptions(type) {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkTheme ? '#f1f5f9' : '#1e293b';
        const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: isDarkTheme ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            }
        };

        if (type === 'bar' || type === 'line') {
            baseOptions.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            };
        }

        return baseOptions;
    }

    removeWidget(widgetId) {
        const widgetElement = document.getElementById(`widget-${widgetId}`);
        if (widgetElement) {
            // Destroy chart if it exists
            const canvas = widgetElement.querySelector('canvas');
            if (canvas) {
                this.chartManager.destroyChart(canvas.id);
            }
            
            // Remove widget from DOM
            widgetElement.remove();
            
            // Dispatch event to notify about widget removal
            this.dispatchWidgetRemovedEvent(widgetId);
            
            this.widgetCount--;
        }
    }

    dispatchWidgetRemovedEvent(widgetId) {
        const event = new CustomEvent('widgetRemoved', {
            detail: {
                widgetId: widgetId,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    updateWidgetPosition(widgetId, newPosition) {
        // This would update the widget's position in the data model
        console.log(`Widget ${widgetId} moved to position ${newPosition}`);
        // In a real implementation, you would update your data store here
    }

    // Method to handle theme changes for all widgets
    updateWidgetsTheme() {
        // Update charts theme
        this.chartManager.updateChartsTheme();
        
        // If you had other theme-dependent elements in widgets, update them here
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            // Update any theme-specific styles if needed
        });
    }

    // NEW METHOD: Update widget data
    updateWidgetData(widgetId, newData) {
        const widgetElement = document.getElementById(`widget-${widgetId}`);
        if (!widgetElement) return;

        const contentElement = widgetElement.querySelector('.widget-content');
        if (!contentElement) return;

        // Destroy existing chart if it exists
        const canvas = contentElement.querySelector('canvas');
        if (canvas) {
            this.chartManager.destroyChart(canvas.id);
            contentElement.innerHTML = ''; // Clear content
        }

        // Recreate widget content with new data
        const widgetData = { 
            id: widgetId, 
            type: this.getWidgetTypeFromElement(widgetElement), 
            data: newData 
        };
        this.addWidgetContent(widgetElement, widgetData);
    }

    // NEW METHOD: Get widget type from element
    getWidgetTypeFromElement(widgetElement) {
        // Extract widget type from data attribute
        const dataType = widgetElement.getAttribute('data-widget-type');
        if (dataType) return dataType;

        // Fallback: check content for chart canvas or stats grid
        const contentElement = widgetElement.querySelector('.widget-content');
        if (contentElement) {
            if (contentElement.querySelector('canvas')) {
                return 'bar'; // Default to bar if chart exists
            }
            if (contentElement.querySelector('.stats-grid')) {
                return 'stats';
            }
        }
        
        // Final fallback
        return 'bar';
    }
}