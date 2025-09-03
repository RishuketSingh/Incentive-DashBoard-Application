export class DataManager {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
    }

    async fetchChartData() {
        try {
            // Simulate API call with realistic data
            await this.delay(500); // Simulate network delay
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentData = Array.from({length: 6}, () => Math.floor(Math.random() * 1000) + 500);
            const previousData = Array.from({length: 6}, () => Math.floor(Math.random() * 1000) + 400);
            
            return {
                labels: months.slice(0, 6),
                datasets: [
                    {
                        label: 'Current Period',
                        data: currentData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Previous Period',
                        data: previousData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2
                    }
                ]
            };
        } catch (error) {
            console.error('Error fetching chart data:', error);
            return this.getFallbackData();
        }
    }

    async fetchPieChartData() {
        try {
            await this.delay(300);
            
            const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
            const data = Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 20);
            const backgroundColors = [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ];

            return {
                labels: categories,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 2
                }]
            };
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
            return this.getFallbackPieData();
        }
    }

    async fetchStatsData() {
        try {
            await this.delay(200);
            
            return {
                totalUsers: Math.floor(Math.random() * 10000) + 5000,
                revenue: Math.floor(Math.random() * 1000000) + 500000,
                conversionRate: (Math.random() * 10 + 5).toFixed(2),
                activeUsers: Math.floor(Math.random() * 5000) + 1000
            };
        } catch (error) {
            console.error('Error fetching stats data:', error);
            return {
                totalUsers: 12500,
                revenue: 750000,
                conversionRate: '7.50',
                activeUsers: 3500
            };
        }
    }

    async fetchExternalData(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching external data:', error);
            throw error;
        }
    }

    getFallbackData() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Current Period',
                    data: [1200, 1900, 1500, 2100, 1800, 2500],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }
            ]
        };
    }

    getFallbackPieData() {
        return {
            labels: ['Category A', 'Category B', 'Category C'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ]
            }]
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Local storage operations
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    clearLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}