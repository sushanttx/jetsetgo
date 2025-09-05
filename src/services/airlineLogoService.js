// src/services/airlineLogoService.js
// Handles airline logo fetching with caching functionality

const AIRLINE_LOGO_BASE_URL = "https://images.trippro.com/AirlineImages/AirLine/GDS/images/70X70";
const CACHE_KEY_PREFIX = "airline_logo_";
const CACHE_EXPIRY_DAYS = 30; // Cache logos for 30 days

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

// Main function to get airline logo URL
export const getAirlineLogoUrl = async (flightLogoName, fallbackImage = null) => {
  console.log('🚀 getAirlineLogoUrl called with:', { flightLogoName, fallbackImage });
  
  // If no logo name provided, return fallback
  if (!flightLogoName || flightLogoName.trim() === '') {
    console.log('❌ No logo name provided, returning fallback');
    return fallbackImage || getFallbackImage();
  }

  // Clean the logo name (remove any extra spaces, convert to proper format)
  const cleanLogoName = flightLogoName.trim();
  console.log('🧹 Cleaned logo name:', cleanLogoName);
  
  // Check cache first
  const cachedUrl = getFromCache(cleanLogoName);
  if (cachedUrl) {
    console.log('💾 Found in cache:', cachedUrl);
    return cachedUrl;
  }

  // Construct the API URL
  const apiUrl = `${AIRLINE_LOGO_BASE_URL}/${cleanLogoName}`;
  console.log('🌐 API URL:', apiUrl);
  
  try {
    // Test if the image exists by making a HEAD request
    console.log('🔄 Making HEAD request to:', apiUrl);
    const response = await fetch(apiUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log('📡 Response status:', response.status, response.ok);
    
    if (response.ok) {
      // Image exists, save to cache and return URL
      console.log('✅ Image found, saving to cache');
      saveToCache(cleanLogoName, apiUrl);
      return apiUrl;
    } else if (response.status === 404) {
      // 404 - Image doesn't exist, try alternative strategies
      console.log('❌ 404 - Image not found, trying alternative strategies');
      
      // Strategy 1: Try with different extensions
      const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
      for (const ext of extensions) {
        const testUrl = `${AIRLINE_LOGO_BASE_URL}/${cleanLogoName.replace(/\.[^/.]+$/, '')}${ext}`;
        console.log('🔄 Trying extension:', ext, testUrl);
        try {
          const testResponse = await fetch(testUrl, { 
            method: 'HEAD',
            mode: 'cors'
          });
          if (testResponse.ok) {
            console.log('✅ Found with extension:', ext);
            saveToCache(cleanLogoName, testUrl);
            return testUrl;
          }
        } catch (testError) {
          console.log('❌ Extension failed:', ext, testError);
          // Continue to next extension
          continue;
        }
      }
      
      // Strategy 2: Try with airline code extraction (e.g., "VIRGINATLANTIC.gif" -> "VS")
      const airlineCode = extractAirlineCode(cleanLogoName);
      if (airlineCode && airlineCode !== cleanLogoName) {
        console.log('🔄 Trying airline code:', airlineCode);
        const codeUrl = `${AIRLINE_LOGO_BASE_URL}/${airlineCode}.png`;
        try {
          const codeResponse = await fetch(codeUrl, { 
            method: 'HEAD',
            mode: 'cors'
          });
          if (codeResponse.ok) {
            console.log('✅ Found with airline code:', airlineCode);
            saveToCache(cleanLogoName, codeUrl);
            return codeUrl;
          }
        } catch (codeError) {
          console.log('❌ Airline code failed:', airlineCode, codeError);
        }
      }
      
      // Strategy 3: Try common variations
      const variations = [
        cleanLogoName.toLowerCase(),
        cleanLogoName.toUpperCase(),
        cleanLogoName.replace(/[^a-zA-Z0-9]/g, ''),
        cleanLogoName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      ];
      
      for (const variation of variations) {
        if (variation !== cleanLogoName) {
          const variationUrl = `${AIRLINE_LOGO_BASE_URL}/${variation}.png`;
          console.log('🔄 Trying variation:', variation, variationUrl);
          try {
            const variationResponse = await fetch(variationUrl, { 
              method: 'HEAD',
              mode: 'cors'
            });
            if (variationResponse.ok) {
              console.log('✅ Found with variation:', variation);
              saveToCache(cleanLogoName, variationUrl);
              return variationUrl;
            }
          } catch (variationError) {
            console.log('❌ Variation failed:', variation, variationError);
          }
        }
      }
      
      // If no image found with any strategy, save null to cache to avoid repeated requests
      console.log('❌ No image found with any strategy, using fallback');
      saveToCache(cleanLogoName, null);
      return fallbackImage || getFallbackImage();
    } else {
      // Other HTTP errors
      console.log('❌ HTTP error:', response.status, 'using fallback');
      saveToCache(cleanLogoName, null);
      return fallbackImage || getFallbackImage();
    }
  } catch (error) {
    console.warn(`❌ Failed to fetch airline logo for ${cleanLogoName}:`, error);
    // Save null to cache to avoid repeated failed requests
    saveToCache(cleanLogoName, null);
    return fallbackImage || getFallbackImage();
  }
};

// Function to preload multiple airline logos
export const preloadAirlineLogos = async (logoNames) => {
  if (!Array.isArray(logoNames) || logoNames.length === 0) {
    return;
  }

  const preloadPromises = logoNames.map(async (logoName) => {
    try {
      await getAirlineLogoUrl(logoName);
    } catch (error) {
      console.warn(`Failed to preload logo for ${logoName}:`, error);
    }
  });

  await Promise.allSettled(preloadPromises);
};

// Function to preload common airline logos
export const preloadCommonAirlineLogos = async () => {
  const commonLogos = [
    'AirIndia_logo.gif',
    'IndiGo_logo.png',
    'SpiceJet_logo.png',
    'Vistara_logo.png',
    'GoAir_logo.png',
    'AirAsia_logo.png',
    'Emirates_logo.png',
    'Qatar_logo.png',
    'Singapore_logo.png',
    'Lufthansa_logo.png',
    'British_logo.png',
    'American_logo.png',
    'Delta_logo.png',
    'United_logo.png'
  ];

  await preloadAirlineLogos(commonLogos);
};

// Function to test TripPro API with common airline codes
export const testTripProApi = async () => {
  const testCodes = [
    'VS', 'SK', 'AI', '6E', 'SG', 'UK', 'G8', 'AK', 
    'EK', 'QR', 'SQ', 'LH', 'BA', 'AA', 'DL', 'UA',
    'VIRGINATLANTIC.gif', 'skandinavian.gif', 'AirIndia_logo.gif'
  ];
  
  console.log('🧪 Testing TripPro API with common codes...');
  
  for (const code of testCodes) {
    const testUrl = `${AIRLINE_LOGO_BASE_URL}/${code}`;
    try {
      const response = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
      console.log(`${response.ok ? '✅' : '❌'} ${code}: ${response.status} - ${testUrl}`);
    } catch (error) {
      console.log(`❌ ${code}: Error - ${error.message}`);
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
  preloadAirlineLogos,
  preloadCommonAirlineLogos,
  testTripProApi,
  clearAirlineLogoCache,
  getCacheStats,
  cleanExpiredCache,
  useAirlineLogo
};
