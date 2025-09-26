// src/services/ProfileService.js
import { getToken } from './Auth.js';

class ProfileService {
  constructor() {
    this.baseURL = 'http://localhost:7001/api/profile';
  }

  // Get authorization headers
  getHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get user profile data
  async getProfile() {
    try {
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update user profile (only editable fields)
  async updateProfile(profileData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user statistics
  async getStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

// Create singleton instance
const profileService = new ProfileService();

export default profileService;
