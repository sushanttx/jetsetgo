import { getApiUrl } from '../config/hosting';
import { handle403Error, isTokenExpired } from '../utils/authUtils';

// Get promotions status
export const getPromotionsStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('Token is expired, redirecting to login');
      handle403Error({ status: 403 }, window.location.pathname);
      throw new Error('Authentication failed');
    }

    const response = await fetch(`${getApiUrl()}/api/promotions/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        handle403Error(response, window.location.pathname);
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching promotions status:', error);
    throw error;
  }
};

// Update promotions status
export const updatePromotionsStatus = async (isOptedIn) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('Token is expired, redirecting to login');
      handle403Error({ status: 403 }, window.location.pathname);
      throw new Error('Authentication failed');
    }

    const response = await fetch(`${getApiUrl()}/api/promotions/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isOptedIn: isOptedIn
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        handle403Error(response, window.location.pathname);
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating promotions status:', error);
    throw error;
  }
};