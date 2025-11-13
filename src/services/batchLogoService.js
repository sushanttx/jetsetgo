// Batch Airline Logo Service
// Efficiently fetches multiple airline logos in a single API call

import { useState, useEffect } from 'react';

const BATCH_LOGO_API_URL = 'http://127.0.0.1:3000/api/logos/batch';

/**
 * Get logos for multiple airlines at once
 * @param {string[]} airlineCodes - Array of airline IATA codes
 * @param {string} size - Logo size (default: '70X70')
 * @param {string} format - Logo format (default: 'png')
 * @returns {Promise<Object>} Logo map with airline codes as keys and URLs as values
 */
export const getBatchAirlineLogos = async (airlineCodes, size = '70X70', format = 'png') => {
  if (!Array.isArray(airlineCodes) || airlineCodes.length === 0) {
    return {};
  }

  // Remove duplicates and filter out invalid codes
  const uniqueCodes = [...new Set(airlineCodes.filter(code => code && code.trim()))];
  
  if (uniqueCodes.length === 0) {
    return {};
  }

  try {
    const response = await fetch(BATCH_LOGO_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        airlineCodes: uniqueCodes,
        size: size,
        format: format
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.logos) {
      // Convert relative URLs to absolute URLs
      const logoMap = {};
      Object.entries(data.data.logos).forEach(([code, url]) => {
        if (url) {
          // Convert relative URL to absolute URL
          logoMap[code] = url.startsWith('http') ? url : `http://127.0.0.1:3000${url}`;
        }
      });
      
      return logoMap;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error getting batch logos:', error);
    return {};
  }
};

/**
 * Hook for using batch logo service in React components
 * @param {Array} flights - Array of flight objects
 * @returns {Object} Logo map and loading state
 */
export const useBatchAirlineLogos = (flights) => {
  const [logoMap, setLogoMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flights || flights.length === 0) {
      setLogoMap({});
      return;
    }

    const airlineCodes = flights
      .map(f => f.validatingCarrierCode)
      .filter(Boolean);

    if (airlineCodes.length === 0) {
      setLogoMap({});
      return;
    }

    setLoading(true);
    setError(null);

    getBatchAirlineLogos(airlineCodes)
      .then(logoMap => {
        setLogoMap(logoMap);
        setLoading(false);
      })
      .catch(err => {
        console.error('Batch logo hook error:', err);
        setError(err);
        setLoading(false);
      });
  }, [flights]);

  return { logoMap, loading, error };
};

/**
 * Get a single logo URL from the logo map
 * @param {Object} logoMap - Logo map from batch service
 * @param {string} airlineCode - Airline IATA code
 * @param {string} fallbackUrl - Fallback URL if logo not found (optional)
 * @returns {string|null} Logo URL or null if not found
 */
export const getLogoFromMap = (logoMap, airlineCode, fallbackUrl = null) => {
  if (!logoMap || !airlineCode) {
    return fallbackUrl;
  }
  
  return logoMap[airlineCode] || fallbackUrl;
};

