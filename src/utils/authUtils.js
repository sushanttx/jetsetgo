// src/utils/authUtils.js
// Utility functions for handling authentication and redirects

import { store } from '../store/store';

/**
 * Handle 403 Forbidden errors by clearing auth state and redirecting to login
 * @param {Response} response - The failed HTTP response
 * @param {string} currentPath - Current path to redirect back to after login
 */
export const handle403Error = (response, currentPath = null) => {
  if (response.status === 403) {
    console.log('403 Forbidden - Token expired or invalid, redirecting to login');
    
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear Redux auth state
    store.dispatch({ type: 'auth/logoutUser' });
    
    // Store current path for redirect after login
    if (currentPath) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    // Redirect to login page
    window.location.href = '/login';
    
    return true; // Indicates 403 was handled
  }
  return false; // Not a 403 error
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.warn('Could not parse token payload:', error);
    return true; // Treat invalid tokens as expired
  }
};

/**
 * Get redirect path after login from sessionStorage
 * @returns {string|null} - Path to redirect to, or null if none
 */
export const getRedirectAfterLogin = () => {
  const redirectPath = sessionStorage.getItem('redirectAfterLogin');
  if (redirectPath) {
    sessionStorage.removeItem('redirectAfterLogin');
    return redirectPath;
  }
  return null;
};

/**
 * Store post-login action (wishlist or booking)
 * @param {string} action - 'wishlist' or 'booking'
 * @param {string} flightId - Flight ID for the action
 * @param {object} flightData - Flight data for wishlist (optional)
 */
export const storePostLoginAction = (action, flightId, flightData = null) => {
  const actionData = {
    action,
    flightId,
    flightData,
    timestamp: Date.now()
  };
  sessionStorage.setItem('postLoginAction', JSON.stringify(actionData));
  console.log('Stored post-login action:', actionData);
};

/**
 * Get and clear post-login action from sessionStorage
 * @returns {object|null} - Action data or null if none
 */
export const getPostLoginAction = () => {
  const actionData = sessionStorage.getItem('postLoginAction');
  if (actionData) {
    try {
      const parsed = JSON.parse(actionData);
      // Check if action is not too old (5 minutes)
      if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
        sessionStorage.removeItem('postLoginAction');
        console.log('Retrieved post-login action:', parsed);
        return parsed;
      } else {
        sessionStorage.removeItem('postLoginAction');
        console.log('Post-login action expired');
      }
    } catch (error) {
      console.error('Error parsing post-login action:', error);
      sessionStorage.removeItem('postLoginAction');
    }
  }
  return null;
};
