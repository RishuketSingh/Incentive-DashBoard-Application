export class ChartManager {
    constructor() {
        this.charts = new Map();
    }

    createChart(canvasId, type, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const defaultOptions = this.getDefaultOptions(type);
        const mergedOptions = { ...defaultOptions, ...options };
        
        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: mergedOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    getDefaultOptions(type) {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {}
        };

        switch (type) {
            case 'bar':
                return {
                    ...commonOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                };
            case 'line':
                return {
                    ...commonOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                };
            case 'pie':
            case 'doughnut':
                return commonOptions;
            default:
                return commonOptions;
        }
    }

    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
            return true;
        }
        return false;
    }

    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
            return true;
        }
        return false;
    }

    resizeChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.resize();
            return true;
        }
        return false;
    }

    getChartInstance(canvasId) {
        return this.charts.get(canvasId);
    }

    // Helper method to generate unique canvas IDs
    generateCanvasId(widgetId) {
        return `chart-${widgetId}`;
    }

    // Method to handle theme changes
    updateChartsTheme() {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkTheme ? '#f1f5f9' : '#1e293b';
        const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.charts.forEach((chart) => {
            // Update chart options for theme
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = textColor;
                    chart.options.scales.x.grid.color = gridColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = textColor;
                    chart.options.scales.y.grid.color = gridColor;
                }
            }

            // Update legend and tooltip colors
            if (chart.options.plugins) {
                if (chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = textColor;
                }
                if (chart.options.plugins.tooltip) {
                    chart.options.plugins.tooltip.backgroundColor = isDarkTheme ? '#1e293b' : '#ffffff';
                    chart.options.plugins.tooltip.titleColor = textColor;
                    chart.options.plugins.tooltip.bodyColor = textColor;
                }
            }

            chart.update();
        });
    }
}