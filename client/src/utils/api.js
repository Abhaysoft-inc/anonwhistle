// Dummy mode - no server calls at all

// Frontend-only Auth API calls
export const authAPI = {
    // Register/Login with wallet - Frontend only
    async registerWithWallet(walletAddress, username = null) {
        // Simulate API delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userData = {
            id: Date.now().toString(),
            walletAddress,
            username: username || `user_${walletAddress.slice(-6)}`,
            registrationDate: new Date().toISOString(),
            isNewUser: true
        };

        // Store user data in localStorage
        localStorage.setItem('authToken', `token_${Date.now()}`);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('walletAddress', walletAddress);

        return {
            success: true,
            data: { user: userData },
            isNewUser: true,
            message: 'Registration successful'
        };
    },

    // Login with wallet - Frontend only
    async loginWithWallet(walletAddress) {
        // Simulate API delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if user exists in localStorage
        const existingUserData = localStorage.getItem('userData');
        if (existingUserData) {
            const userData = JSON.parse(existingUserData);
            if (userData.walletAddress === walletAddress) {
                // Update login info
                userData.lastLogin = new Date().toISOString();
                userData.loginCount = (userData.loginCount || 0) + 1;

                localStorage.setItem('authToken', `token_${Date.now()}`);
                localStorage.setItem('userData', JSON.stringify(userData));

                return {
                    success: true,
                    data: { user: userData },
                    isNewUser: false,
                    message: 'Login successful'
                };
            }
        }

        // Auto-register if user doesn't exist
        return this.registerWithWallet(walletAddress);
    },

    // Get current user profile - Frontend only
    async getProfile() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const userData = localStorage.getItem('userData');
        if (!userData) {
            throw new Error('No user data found');
        }

        return {
            success: true,
            data: { user: JSON.parse(userData) }
        };
    },

    // Update user profile - Frontend only
    async updateProfile(profileData) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const userData = localStorage.getItem('userData');
        if (!userData) {
            throw new Error('No user data found');
        }

        const user = JSON.parse(userData);
        const updatedUser = { ...user, ...profileData };

        localStorage.setItem('userData', JSON.stringify(updatedUser));

        return {
            success: true,
            data: { user: updatedUser },
            message: 'Profile updated successfully'
        };
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

// No exports needed for dummy mode