import React, { useState, useEffect } from 'react';

// Shared AirlineLogo component for consistent logo display across all pages
const AirlineLogo = ({ 
  className = "size-40", 
  alt = "flight icon", 
  fallbackImage = null, 
  validatingCarrierCode = null, 
  airlineLogoUrl = null, 
  logoMap = null, 
  logoLoading = false 
}) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // PRIORITY 1: Use airlineLogoUrl if provided (direct integration)
    if (airlineLogoUrl) {
      setLogoUrl(airlineLogoUrl);
      setLoading(false);
      setError(false);
      return;
    }

    // PRIORITY 2: Use local airline logo from public/img/airlines folder
    if (validatingCarrierCode) {
      const localLogoUrl = `/img/airlines/${validatingCarrierCode}.png`;
      setLogoUrl(localLogoUrl);
      setLoading(false);
      setError(false);
      return;
    }

    // FALLBACK: Use fallback image
    setLogoUrl(fallbackImage || '/img/flights/default-flight.png');
    setLoading(false);
    setError(false);
  }, [airlineLogoUrl, validatingCarrierCode, fallbackImage]);

  const handleImageError = (e) => {
    if (!error) {
      setError(true);
      setLogoUrl(fallbackImage || '/img/flights/default-flight.png');
    }
  };

  return (
    <div className={`${className} flex-shrink-0`}>
      {loading ? (
        <div className={`${className} bg-light-2 rounded-4 flex items-center justify-center`}>
          <div className="text-12 text-light-1">Loading...</div>
        </div>
      ) : logoUrl ? (
        <img
          src={logoUrl}
          alt={alt}
          className={`${className} object-cover rounded-4`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${className} bg-light-2 rounded-4 flex items-center justify-center`}>
          <div className="text-12 text-light-1">No Logo</div>
        </div>
      )}
    </div>
  );
};

export default AirlineLogo;


