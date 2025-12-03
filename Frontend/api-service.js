// API Configuration and Helper Functions
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000
};

// API Service Object
const API = {
    // Helper to get auth headers
    getHeaders() {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Helper for API calls
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders()
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                // Return the full error data including validation errors
                return {
                    success: false,
                    message: data.message || 'Request failed',
                    errors: data.errors || []
                };
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication APIs
    auth: {
        async register(email, username, password) {
            const data = await API.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, username, password })
            });
            
            if (data.success && data.data.token) {
                localStorage.setItem('auth_token', data.data.token);
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_id', data.data.user._id);
            }
            
            return data;
        },

        async login(email, password) {
            const data = await API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (data.success && data.data.token) {
                localStorage.setItem('auth_token', data.data.token);
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_id', data.data.user._id);
            }
            
            return data;
        },

        async logout() {
            try {
                await API.request('/auth/logout', { method: 'POST' });
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_id');
                // Don't remove has_logged_in_before - keep it for welcome back message
            }
        },

        async getCurrentUser() {
            return await API.request('/auth/me', { method: 'GET' });
        },

        async updateProfile(data) {
            return await API.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        async changePassword(data) {
            return await API.request('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        isAuthenticated() {
            return !!localStorage.getItem('auth_token');
        },

        getCurrentUserEmail() {
            return localStorage.getItem('user_email');
        }
    },

    // Expense APIs
    expenses: {
        async getAll(filters = {}) {
            let queryString = '';
            if (Object.keys(filters).length > 0) {
                queryString = '?' + new URLSearchParams(filters).toString();
            }
            return await API.request(`/expenses${queryString}`, { method: 'GET' });
        },

        async create(expense) {
            return await API.request('/expenses', {
                method: 'POST',
                body: JSON.stringify(expense)
            });
        },

        async update(id, expense) {
            return await API.request(`/expenses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(expense)
            });
        },

        async delete(id) {
            return await API.request(`/expenses/${id}`, {
                method: 'DELETE'
            });
        },

        async getTotal(startDate, endDate) {
            let query = '';
            if (startDate) query += `startDate=${startDate}`;
            if (endDate) query += `${query ? '&' : ''}endDate=${endDate}`;
            return await API.request(`/expenses/total${query ? '?' + query : ''}`, { method: 'GET' });
        },

        async getByCategory(startDate, endDate) {
            let query = '';
            if (startDate) query += `startDate=${startDate}`;
            if (endDate) query += `${query ? '&' : ''}endDate=${endDate}`;
            return await API.request(`/expenses/by-category${query ? '?' + query : ''}`, { method: 'GET' });
        }
    },

    // Category APIs
    categories: {
        async getAll() {
            return await API.request('/categories', { method: 'GET' });
        },

        async create(category) {
            return await API.request('/categories', {
                method: 'POST',
                body: JSON.stringify(category)
            });
        },

        async update(id, category) {
            return await API.request(`/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(category)
            });
        },

        async delete(id) {
            return await API.request(`/categories/${id}`, {
                method: 'DELETE'
            });
        },

        async getStats() {
            return await API.request('/categories/stats', { method: 'GET' });
        }
    },

    // Report APIs
    reports: {
        async getDashboard() {
            return await API.request('/reports/dashboard', { method: 'GET' });
        },

        async getTrends(period = 'month', months = 6) {
            return await API.request(`/reports/trends?period=${period}&months=${months}`, { method: 'GET' });
        },

        async getWeekly(weekOffset = 0) {
            return await API.request(`/reports/weekly?weekOffset=${weekOffset}`, { method: 'GET' });
        },

        async getMonthly(year, month) {
            return await API.request(`/reports/monthly?year=${year}&month=${month}`, { method: 'GET' });
        },

        async getYearly(year) {
            return await API.request(`/reports/yearly?year=${year}`, { method: 'GET' });
        }
    },

    // Admin APIs
    admin: {
        async getStats() {
            return await API.request('/admin/stats', { method: 'GET' });
        },

        async getAllUsers() {
            return await API.request('/admin/users', { method: 'GET' });
        },

        async getUserById(userId) {
            return await API.request(`/admin/users/${userId}`, { method: 'GET' });
        },

        async createUser(data) {
            return await API.request('/admin/users', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        async updateUserRole(userId, role) {
            return await API.request(`/admin/users/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role })
            });
        },

        async deleteUser(userId) {
            return await API.request(`/admin/users/${userId}`, {
                method: 'DELETE'
            });
        },

        async getAllExpenses() {
            return await API.request('/admin/expenses', { method: 'GET' });
        }
    }
};

// Check authentication on protected pages
function requireAuth() {
    if (!API.auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize on page load
console.log('API Service loaded. Backend URL:', API_CONFIG.baseURL);
