// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

// Generic API call function
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || data.error || 'An error occurred',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        throw new ApiError(
            'Network error. Please check your connection and try again.',
            0,
            null
        );
    }
}

// Auth API calls
export const authAPI = {
    // Register/Login with wallet
    async registerWithWallet(walletAddress, username = null) {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                username
            })
        });
    },

    // Login with wallet
    async loginWithWallet(walletAddress) {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                walletAddress
            })
        });
    },

    // Get current user profile
    async getProfile() {
        return apiCall('/auth/me');
    },

    // Update user profile
    async updateProfile(profileData) {
        return apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    // Get user statistics
    async getUserStats() {
        return apiCall('/auth/stats');
    }
};

// Complaints API calls
export const complaintsAPI = {
    // Submit new complaint
    async submitComplaint(complaintData, evidenceFiles = []) {
        const formData = new FormData();

        // Add complaint data
        Object.keys(complaintData).forEach(key => {
            formData.append(key, complaintData[key]);
        });

        // Add evidence files
        evidenceFiles.forEach(file => {
            formData.append('evidence', file);
        });

        const token = localStorage.getItem('authToken');

        return fetch(`${API_BASE_URL}/complaints`, {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            },
            body: formData
        }).then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(
                    data.message || data.error || 'Failed to submit complaint',
                    response.status,
                    data
                );
            }
            return data;
        });
    },

    // Get user's complaints
    async getMyComplaints(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/complaints${queryString ? `?${queryString}` : ''}`);
    },

    // Get single complaint
    async getComplaint(id) {
        return apiCall(`/complaints/${id}`);
    },

    // Update complaint
    async updateComplaint(id, updateData) {
        return apiCall(`/complaints/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    },

    // Delete/withdraw complaint
    async deleteComplaint(id) {
        return apiCall(`/complaints/${id}`, {
            method: 'DELETE'
        });
    },

    // Get public statistics
    async getPublicStats() {
        return apiCall('/complaints/public/stats');
    },

    // Get leaderboard
    async getLeaderboard() {
        return apiCall('/complaints/public/leaderboard');
    }
};

// Utility functions
export const storage = {
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    },

    getAuthToken() {
        return localStorage.getItem('authToken');
    },

    removeAuthToken() {
        localStorage.removeItem('authToken');
    },

    setUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    },

    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    },

    removeUserData() {
        localStorage.removeItem('userData');
    },

    clearAll() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('walletAddress'); // Legacy support
    }
};

export { ApiError };