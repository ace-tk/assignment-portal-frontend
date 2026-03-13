import api from './api';

const authService = {
  /**
   * Login user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User data and token
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Helper to check if a user is authenticated based on token presence.
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
