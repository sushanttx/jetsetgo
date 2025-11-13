// src/services/airlineLogoService.js
// Handles airline logo fetching with caching functionality
// UPDATED: Only uses ValidatingCarrierCode with .png extension

// Backend proxy endpoint for airline logos
const AIRLINE_LOGO_BASE_URL = "/api/airline-logos";
const CACHE_KEY_PREFIX = "airline_logo_";
const CACHE_EXPIRY_DAYS = 30; // Cache logos for 30 days

// Configuration flags
let ENABLE_EXTERNAL_API = true;

// Helper function to get cache key
const getCacheKey = (logoName) => `${CACHE_KEY_PREFIX}${logoName}`;

// Helper function to check if cache is expired
const isCacheExpired = (cachedData) => {
  if (!cachedData || !cachedData.timestamp) return true;
  const now = Date.now();
  const cacheAge = now - cachedData.timestamp;
  const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  return cacheAge > expiryTime;
};

// Helper function to save to cache
const saveToCache = (logoName, imageUrl) => {
  try {
    const cacheData = {
      imageUrl,
      timestamp: Date.now()
    };
    localStorage.setItem(getCacheKey(logoName), JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save airline logo to cache:', error);
  }
};

// Helper function to get from cache
const getFromCache = (logoName) => {
  try {
    const cachedData = localStorage.getItem(getCacheKey(logoName));
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (!isCacheExpired(parsed)) {
        return parsed.imageUrl;
      } else {
        // Remove expired cache
        localStorage.removeItem(getCacheKey(logoName));
      }
    }
  } catch (error) {
    console.warn('Failed to read airline logo from cache:', error);
  }
  return null;
};

// Helper function to get fallback image
const getFallbackImage = (logoName) => {
  // Try different fallback strategies
  const fallbacks = [
    '/img/flights/default-flight.png',
    '/img/flights/airline-default.png',
    '/img/flights/plane.svg'
  ];
  return fallbacks[0]; // Return the first fallback
};

// Helper function to extract airline code from logo name
const extractAirlineCode = (logoName) => {
  // Common airline code mappings
  const airlineMappings = {
    'VIRGINATLANTIC': 'VS',
    'SKANDINAVIAN': 'SK',
    'AIRINDIA': 'AI',
    'INDIGO': '6E',
    'SPICEJET': 'SG',
    'VISTARA': 'UK',
    'GOAIR': 'G8',
    'AIRASIA': 'AK',
    'EMIRATES': 'EK',
    'QATAR': 'QR',
    'SINGAPORE': 'SQ',
    'LUFTHANSA': 'LH',
    'BRITISH': 'BA',
    'AMERICAN': 'AA',
    'DELTA': 'DL',
    'UNITED': 'UA',
    'JETBLUE': 'B6',
    'SOUTHWEST': 'WN',
    'ALASKA': 'AS',
    'FRONTIER': 'F9',
    'SPIRIT': 'NK'
  };
  
  // Remove file extension and convert to uppercase
  const nameWithoutExt = logoName.replace(/\.[^/.]+$/, '').toUpperCase();
  
  // Check if we have a direct mapping
  if (airlineMappings[nameWithoutExt]) {
    return airlineMappings[nameWithoutExt];
  }
  
  // Try to extract common patterns
  if (nameWithoutExt.includes('VIRGIN')) return 'VS';
  if (nameWithoutExt.includes('SCANDINAVIAN') || nameWithoutExt.includes('SAS')) return 'SK';
  if (nameWithoutExt.includes('AIRINDIA')) return 'AI';
  if (nameWithoutExt.includes('INDIGO')) return '6E';
  if (nameWithoutExt.includes('SPICEJET')) return 'SG';
  if (nameWithoutExt.includes('VISTARA')) return 'UK';
  if (nameWithoutExt.includes('GOAIR')) return 'G8';
  if (nameWithoutExt.includes('AIRASIA')) return 'AK';
  if (nameWithoutExt.includes('EMIRATES')) return 'EK';
  if (nameWithoutExt.includes('QATAR')) return 'QR';
  if (nameWithoutExt.includes('SINGAPORE')) return 'SQ';
  if (nameWithoutExt.includes('LUFTHANSA')) return 'LH';
  if (nameWithoutExt.includes('BRITISH')) return 'BA';
  if (nameWithoutExt.includes('AMERICAN')) return 'AA';
  if (nameWithoutExt.includes('DELTA')) return 'DL';
  if (nameWithoutExt.includes('UNITED')) return 'UA';
  
  // If no mapping found, return null
  return null;
};

// Function to enable/disable external API calls
export const setExternalApiEnabled = (enabled) => {
  ENABLE_EXTERNAL_API = enabled;
  console.log(`🔧 External API ${enabled ? 'enabled' : 'disabled'}`);
};

// DEPRECATED: This function is no longer used
// The backend now automatically provides airline logos in the flight data
// Use item.airlineLogo directly from the API response instead
export const getAirlineLogoUrl = async (flightLogoName, fallbackImage = null, validatingCarrierCode = null) => {
  console.warn('⚠️ DEPRECATED: getAirlineLogoUrl is no longer used. Backend now provides logos automatically.');
  console.warn('💡 Use item.airlineLogo from the API response instead.');
  return fallbackImage || getFallbackImage();
};

// Function to preload multiple airline logos using ValidatingCarrierCode
export const preloadAirlineLogos = async (validatingCarrierCodes) => {
  if (!Array.isArray(validatingCarrierCodes) || validatingCarrierCodes.length === 0) {
    return;
  }

  const preloadPromises = validatingCarrierCodes.map(async (carrierCode) => {
    try {
      await getAirlineLogoUrl(null, null, carrierCode);
    } catch (error) {
      console.warn(`Failed to preload logo for ${carrierCode}:`, error);
    }
  });

  await Promise.allSettled(preloadPromises);
};

// Function to preload common airline logos using ValidatingCarrierCode
export const preloadCommonAirlineLogos = async () => {
  const commonCarrierCodes = [
    'AI',   // Air India
    '6E',   // IndiGo
    'SG',   // SpiceJet
    'UK',   // Vistara
    'G8',   // GoAir
    'AK',   // AirAsia
    'EK',   // Emirates
    'QR',   // Qatar
    'SQ',   // Singapore
    'LH',   // Lufthansa
    'BA',   // British Airways
    'AA',   // American Airlines
    'DL',   // Delta
    'UA',   // United
    'EI',   // Aer Lingus
    'SU',   // Aeroflot
    'AM',   // Aeromexico
    'AC',   // Air Canada
    'AF',   // Air France
    'NZ',   // Air New Zealand
    'AS'    // Alaska Airlines
  ];

  await preloadAirlineLogos(commonCarrierCodes);
};

// Function to test TripPro API with ValidatingCarrierCode
export const testTripProApi = async () => {
  const testCodes = [
    'EI', 'SU', 'AM', 'AC', 'AF', 'AI', 'NZ', 'AS',
    'VS', 'SK', '6E', 'SG', 'UK', 'G8', 'AK', 
    'EK', 'QR', 'SQ', 'LH', 'BA', 'AA', 'DL', 'UA'
  ];
  
  console.log('🧪 Testing TripPro API with ValidatingCarrierCode...');
  
  for (const code of testCodes) {
    const testUrl = `${AIRLINE_LOGO_BASE_URL}/${code}.png`;
    try {
      const response = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
      console.log(`${response.ok ? '✅' : '❌'} ${code}: ${response.status} - ${testUrl}`);
    } catch (error) {
      console.log(`❌ ${code}: Error - ${error.message}`);
    }
  }
};

// Function to test the new ValidatingCarrierCode functionality
export const testValidatingCarrierCode = async () => {
  console.log('🧪 Testing ValidatingCarrierCode functionality...');
  
  const testCases = [
    'EI', 'SU', 'AM', 'AC', 'AF', 'AI', 'NZ', 'AS',
    'BA', 'AA', 'EK', 'LH', 'QR', 'SQ', 'DL', 'UA'
  ];
  
  for (const carrierCode of testCases) {
    console.log(`\n🔄 Testing carrier code: ${carrierCode}`);
    try {
      const url = await getAirlineLogoUrl(null, null, carrierCode);
      console.log(`✅ Result: ${url}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
};

// Function to clear cache (useful for debugging or cache management)
export const clearAirlineLogoCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Airline logo cache cleared');
  } catch (error) {
    console.error('Failed to clear airline logo cache:', error);
  }
};

// Function to get cache statistics
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const logoKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    let validEntries = 0;
    let expiredEntries = 0;
    
    logoKeys.forEach(key => {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (isCacheExpired(parsed)) {
            expiredEntries++;
          } else {
            validEntries++;
          }
        } catch (error) {
          expiredEntries++;
        }
      }
    });
    
    return {
      totalEntries: logoKeys.length,
      validEntries,
      expiredEntries
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return { totalEntries: 0, validEntries: 0, expiredEntries: 0 };
  }
};

// Function to clean expired cache entries
export const cleanExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const logoKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    let cleanedCount = 0;
    
    logoKeys.forEach(key => {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (isCacheExpired(parsed)) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });
    
    console.log(`Cleaned ${cleanedCount} expired airline logo cache entries`);
    return cleanedCount;
  } catch (error) {
    console.error('Failed to clean expired cache:', error);
    return 0;
  }
};

// React hook for using airline logos in components
export const useAirlineLogo = (flightLogoName, fallbackImage = null) => {
  const [logoUrl, setLogoUrl] = React.useState(fallbackImage || getFallbackImage());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    
    const fetchLogo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = await getAirlineLogoUrl(flightLogoName, fallbackImage);
        
        if (isMounted) {
          setLogoUrl(url);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLogoUrl(fallbackImage || getFallbackImage());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogo();

    return () => {
      isMounted = false;
    };
  }, [flightLogoName, fallbackImage]);

  return { logoUrl, loading, error };
};

// Default export for easy importing
export default {
  getAirlineLogoUrl,
  setExternalApiEnabled,
  preloadAirlineLogos,
  preloadCommonAirlineLogos,
  testTripProApi,
  testValidatingCarrierCode,
  clearAirlineLogoCache,
  getCacheStats,
  cleanExpiredCache,
  useAirlineLogo
};
