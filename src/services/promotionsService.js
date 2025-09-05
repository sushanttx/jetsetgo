// src/services/promotionsService.js
// Handles all promotions-related API calls

import { getApiUrl } from '../config/hosting';

const API_BASE_URL = getApiUrl('promotions');

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      throw new Error('Authentication token has expired. Please log in again.');
    }
  } catch (error) {
    console.warn('Could not parse token payload:', error);
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else if (response.status === 401) {
    throw new Error('Authentication failed. Please log in again.');
  } else if (response.status === 403) {
    throw new Error('Access denied. You do not have permission to perform this action.');
  } else if (response.status === 404) {
    throw new Error('Promotions data not found.');
  } else if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
};

// Update promotions opt-in status
export const updatePromotionsOptIn = async (promotions_opt_in) => {
  try {
    console.log('updatePromotionsOptIn: Starting with status:', promotions_opt_in);
    
    const response = await fetch(`${API_BASE_URL}/opt-in`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ promotions_opt_in })
    });

    console.log('updatePromotionsOptIn: Response status:', response.status);
    const result = await handleApiResponse(response);
    
    return { success: true, message: 'Promotions preference updated successfully', data: result };
  } catch (error) {
    console.error('updatePromotionsOptIn: Error:', error);
    throw error;
  }
};

// Get current promotions status
export const getPromotionsStatus = async () => {
  try {
    console.log('getPromotionsStatus: Starting fetch');
    
    const response = await fetch(`${API_BASE_URL}/status`, {
      headers: getAuthHeaders()
    });

    console.log('getPromotionsStatus: Response status:', response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('getPromotionsStatus: Error:', error);
    throw error;
  }
};

// Toggle promotions status
export const togglePromotionsStatus = async () => {
  try {
    console.log('togglePromotionsStatus: Starting toggle');
    
    const response = await fetch(`${API_BASE_URL}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    console.log('togglePromotionsStatus: Response status:', response.status);
    const result = await handleApiResponse(response);
    
    return { success: true, message: 'Promotions preference toggled successfully', data: result };
  } catch (error) {
    console.error('togglePromotionsStatus: Error:', error);
    throw error;
  }
};

// Get all opt-in users (Admin only)
export const getAllOptInUsers = async () => {
  try {
    console.log('getAllOptInUsers: Starting fetch');
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });

    console.log('getAllOptInUsers: Response status:', response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('getAllOptInUsers: Error:', error);
    throw error;
  }
};

export default {
  updatePromotionsOptIn,
  getPromotionsStatus,
  togglePromotionsStatus,
  getAllOptInUsers
};
