import { useState, useEffect } from "react";
import Pagination from "../../common/Pagination";
import Properties from "./Properties";
import { fetchWishlist, removeFromWishlist } from "../../../../../services/wishlistService";
import { isTokenExpired, handle403Error } from "../../../../../utils/authUtils";
import { useBatchAirlineLogos } from "../../../../../services/batchLogoService";
import AirlineLogo from "../../../../common/AirlineLogo";

const WishlistTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 1 flight per page for testing
  
  // Batch logo service for wishlist items
  const { logoMap, loading: logoLoading, error: logoError } = useBatchAirlineLogos(wishlistData);

  const handleTabClick = (index) => {
    setActiveTab(index);
    setCurrentPage(1); // Reset to first page when changing tab
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch wishlist data on component mount
  useEffect(() => {
    console.log('WishlistTable: Component mounted, checking auth...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('WishlistTable: No token found, setting error');
      setError('Please log in to view your wishlist');
      setLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('WishlistTable: Token is expired, redirecting to login');
      handle403Error({ status: 403 }, window.location.pathname);
      return;
    }
    
    console.log('WishlistTable: Token found, fetching wishlist...');
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    try {
      console.log('WishlistTable: Starting to fetch wishlist data...');
      setLoading(true);
      setError("");
      
      const data = await fetchWishlist();
      console.log('WishlistTable: Received data:', data);
      
      // Handle the actual API response structure: { success: true, wishlist: [...], totalItems: 5 }
      if (data && data.success && data.wishlist && Array.isArray(data.wishlist)) {
        console.log('WishlistTable: Found wishlist array, length:', data.wishlist.length);
        setWishlistData(data.wishlist);
      } else if (Array.isArray(data)) {
        console.log('WishlistTable: Data is direct array, length:', data.length);
        setWishlistData(data);
      } else {
        console.warn('WishlistTable: Data is not in expected format:', data);
        setWishlistData([]);
      }
    } catch (err) {
      console.error('WishlistTable: Error fetching wishlist:', err);
      setError(err.message || 'Failed to fetch wishlist');
      setWishlistData([]);
    } finally {
      setLoading(false);
      console.log('WishlistTable: Loading finished, data length:', wishlistData.length);
    }
  };

  const handleRemoveFromWishlist = async (itineraryId) => {
    try {
      const result = await removeFromWishlist(itineraryId);
      if (result.success) {
        // Remove item from local state
        setWishlistData(prev => prev.filter(item => item.itineraryId !== itineraryId));
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const tabItems = [
    "One Way Flights",
    "Round Trip Flights",
    "Multi-City Flights",
    // "Hotel",
    // "Tour",
    // "Activity",
    // "Holiday Rental",
    // "Cars",
    // "Cruiser",
  ];

  const renderWishlistContent = () => {
    if (loading) {
      return (
        <div className="col-12 text-center py-40">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-12 text-center py-40">
          <div className="text-red-1">{error}</div>
          <button 
            className="button -dark-1 mt-20" 
            onClick={fetchWishlistData}
          >
            Retry
          </button>
        </div>
      );
    }

    if (wishlistData.length === 0) {
      return (
        <div className="col-12 text-center py-40">
          <h3>No wishlist items found</h3>
          <p className="text-light-1">Start adding flights to your wishlist to see them here.</p>
        </div>
      );
    }

    // Filter flights by trip type
    const oneWayFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'ONEWAY' || 
      (!item.itineraryData?.flightListReturn || item.itineraryData.flightListReturn.length === 0)
    );
    
    const roundTripFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'ROUNDTRIP' || 
      (item.itineraryData?.flightListReturn && item.itineraryData.flightListReturn.length > 0)
    );
    
    const multiCityFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'MULTICITY' || 
      (item.itineraryData?.flightListOutbound && item.itineraryData.flightListOutbound.length > 2)
    );

    // Get current tab's flights and apply pagination
    let currentTabFlights = [];
    if (activeTab === 0) {
      currentTabFlights = oneWayFlights;
    } else if (activeTab === 1) {
      currentTabFlights = roundTripFlights;
    } else if (activeTab === 2) {
      currentTabFlights = multiCityFlights;
    }

    // Calculate pagination
    const totalItems = currentTabFlights.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFlights = currentTabFlights.slice(startIndex, endIndex);

    // Reset to first page if current page is beyond total pages
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }

    console.log('Pagination Debug:', {
      activeTab,
      totalWishlistItems: wishlistData.length,
      oneWayCount: oneWayFlights.length,
      roundTripCount: roundTripFlights.length,
      multiCityCount: multiCityFlights.length,
      currentTabTotal: totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
      startIndex,
      endIndex,
      paginatedFlightsLength: paginatedFlights.length
    });

    // Render content based on active tab
    if (activeTab === 0) {
      // One Way Flights
      return renderFlightList(paginatedFlights, "One Way Flights", totalItems);
    } else if (activeTab === 1) {
      // Round Trip Flights
      return renderFlightList(paginatedFlights, "Round Trip Flights", totalItems);
    } else if (activeTab === 2) {
      // Multi-City Flights
      return renderFlightList(paginatedFlights, "Multi-City Flights", totalItems);
    }

    // For other tabs, show the original Properties component
    return <Properties />;
  };

  // Calculate current tab's total items for pagination
  const getCurrentTabTotalItems = () => {
    if (loading || error || wishlistData.length === 0) return 0;
    
    const oneWayFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'ONEWAY' || 
      (!item.itineraryData?.flightListReturn || item.itineraryData.flightListReturn.length === 0)
    );
    
    const roundTripFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'ROUNDTRIP' || 
      (item.itineraryData?.flightListReturn && item.itineraryData.flightListReturn.length > 0)
    );
    
    const multiCityFlights = wishlistData.filter(item => 
      item.itineraryData?.tripType === 'MULTICITY' || 
      (item.itineraryData?.flightListOutbound && item.itineraryData.flightListOutbound.length > 2)
    );

    if (activeTab === 0) return oneWayFlights.length;
    if (activeTab === 1) return roundTripFlights.length;
    if (activeTab === 2) return multiCityFlights.length;
    
    return 0;
  };

  const renderFlightList = (flights, title, totalItems) => {
    if (flights.length === 0) {
      return (
        <div className="col-12 text-center py-40">
          <h3>No {title} found</h3>
          <p className="text-light-1">Start adding {title.toLowerCase()} to your wishlist to see them here.</p>
        </div>
      );
    }

    return (
      <div className="row y-gap-20">
        <div className="col-12">
          <h3 className="text-20 fw-500 mb-20">{title} ({totalItems})</h3>
        </div>
        {flights.map((item) => (
          <div className="col-12" key={item.itineraryId}>
            <div className="row x-gap-20 y-gap-30">
              <div className="col-md-auto">
                <div className="cardImage ratio ratio-1:1 w-200 md:w-1/1 rounded-4">
                  <div className="cardImage__content">
                    <AirlineLogo 
                      className="rounded-4 col-12"
                      alt="Flight"
                      fallbackImage={item.itineraryData?.avatar}
                      validatingCarrierCode={item.itineraryData?.validatingCarrierCode}
                      airlineLogoUrl={item.itineraryData?.airlineLogo}
                      logoMap={logoMap}
                      logoLoading={logoLoading}
                    />
                  </div>
                  <div className="cardImage__wishlist">
                    <button 
                      className="button -red-1 size-30 rounded-full shadow-2"
                      onClick={() => handleRemoveFromWishlist(item.itineraryId)}
                      title="Remove from wishlist"
                    >
                      <i className="icon-heart text-12" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md">
              <h3 className="text-18 lh-14 fw-500">
                {item.itineraryData?.flightListOutbound?.[0]?.departureAirport || 'N/A'} → {item.itineraryData?.flightListOutbound?.[0]?.arrivalAirport || 'N/A'}
                
                {item.itineraryData?.flightListReturn?.length > 0 && (
                  <> &nbsp;•&nbsp; 
                    {item.itineraryData?.flightListReturn?.[0]?.departureAirport || 'N/A'} → {item.itineraryData?.flightListReturn?.[0]?.arrivalAirport || 'N/A'}
                  </>
                )}
              </h3>

                
                <div className="d-flex x-gap-5 items-center pt-10">
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                </div>

                <div className="row x-gap-10 y-gap-10 items-center pt-20">
                  <div className="col-auto">
                    <p className="text-14">
                      {item.itineraryData?.airline} • {item.itineraryData?.totalDurationFormatted || item.itineraryData?.duration}
                    </p>
                  </div>
                  <div className="col-auto">
                    <div className="size-3 rounded-full bg-light-1" />
                  </div>
                  <div className="col-auto">
                    <p className="text-14">{item.itineraryData?.stops || 0} stop{item.itineraryData?.stops !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="row x-gap-10 y-gap-10 pt-20">
                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      {item.itineraryData?.flightListOutbound?.[0]?.cabinClass || 'Economy'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                      {item.itineraryData?.baggageInfo || '0P'}
                    </div>
                  </div>
                </div>

                {/* Show dates */}
                <div className="pt-15 text-12 text-light-1">
                  <div>Outbound: {item.itineraryData?.outboundDateFormatted || 'N/A'}</div>
                  {item.itineraryData?.returnDateFormatted && (
                    <div>Return: {item.itineraryData?.returnDateFormatted}</div>
                  )}
                </div>

                {/* Show user notes if any */}
                {item.userNotes && (
                  <div className="pt-15">
                    <div className="text-14 text-light-1">
                      <i className="icon-note text-12 mr-5"></i>
                      {item.userNotes}
                    </div>
                  </div>
                )}

                <div className="pt-15 text-12 text-light-1">
                  Added: {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="col-md-auto text-right md:text-left">
                <div className="d-flex flex-column justify-between h-full">
                  <div className="pt-24">
                    <div className="fw-500">Price</div>
                    <span className="fw-500 text-blue-1">
                      US${item.itineraryData?.price ? Math.ceil(item.itineraryData.price) : 'N/A'}
                    </span>
                  </div>
                  <div className="pt-20">
                    <button className="button -dark-1 px-30 h-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? "is-tab-el-active" : ""
                }`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {renderWishlistContent()}
            </div>
          </div>
        </div>
             <Pagination 
         totalItems={getCurrentTabTotalItems()} 
         itemsPerPage={itemsPerPage} 
         currentPage={currentPage} 
         onPageChange={handlePageChange} 
         showInfo={true}
       />
    </>
  );
};

export default WishlistTable;
