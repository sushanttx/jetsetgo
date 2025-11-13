import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// Removed backend wishlist service calls
import AirlineLogo from "../../common/AirlineLogo";
import LoginPromptModal from "../../common/LoginPromptModal";
import { storePostLoginAction } from "../../../utils/authUtils";

const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start) || isNaN(end)) return "N/A";
  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
};


const FlightProperties = ({ flights, loading }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(new Set());
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Mock wishlist functionality - no backend calls
  const handleFetchWishlist = () => {
    // Get wishlist from localStorage instead of backend
    const localWishlist = localStorage.getItem('userWishlist');
    if (localWishlist) {
      try {
        const wishlistData = JSON.parse(localWishlist);
        const wishlistIds = new Set(wishlistData.map(item => item.itineraryId || item.id));
        setWishlistItems(wishlistIds);
      } catch (error) {
        console.error('Error parsing local wishlist:', error);
        setWishlistItems(new Set());
      }
    }
  };

  const handleAddToWishlist = async (itineraryId, itineraryData) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the wishlist action for after login
      storePostLoginAction('wishlist', itineraryId, itineraryData);
      setShowLoginPrompt(true);
      return;
    }

    try {
      setWishlistLoading(prev => new Set(prev).add(itineraryId));

      // Mock wishlist functionality - use localStorage
      const localWishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
      const existingItem = localWishlist.find(item => item.itineraryId === itineraryId || item.id === itineraryId);
      
      if (!existingItem) {
        localWishlist.push({
          itineraryId: itineraryId,
          id: itineraryId,
          ...itineraryData,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem('userWishlist', JSON.stringify(localWishlist));
        setWishlistItems(prev => new Set(prev).add(itineraryId));
        console.log('Added to wishlist successfully');
      } else {
        console.log('Item already in wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itineraryId);
        return newSet;
      });
    }
  };

  const handleRemoveFromWishlist = async (itineraryId) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the wishlist action for after login
      storePostLoginAction('wishlist', itineraryId);
      setShowLoginPrompt(true);
      return;
    }

    try {
      setWishlistLoading(prev => new Set(prev).add(itineraryId));

      // Mock wishlist functionality - use localStorage
      const localWishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
      const updatedWishlist = localWishlist.filter(item => 
        item.itineraryId !== itineraryId && item.id !== itineraryId
      );
      localStorage.setItem('userWishlist', JSON.stringify(updatedWishlist));
      
      setWishlistItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itineraryId);
        return newSet;
      });
      console.log('Removed from wishlist successfully');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itineraryId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-40">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-40 mt-30 col-12">
        <h3>No flights found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <>
      {flights.map((item) => (
        <div className="js-accordion" key={item.id}>
          <div className="py-30 px-30 bg-white rounded-4 base-tr mt-30">
            <div className="row justify-between">
              {item.flightListReturn && item.flightListOutbound ? (
                <>
                  <div className="col-md-5">
                    <div className="text-16 fw-600 mb-10 text-center">Outbound {item.outboundDateFormatted && `• ${item.outboundDateFormatted}`}</div>
                    {item.flightListOutbound.map((segment, idx) => (
                  <div className={`row y-gap-10 items-center${idx > 0 ? ' pt-30' : ''}`} key={segment.id}>
                        <div className="col text-center">
                          <div className="row x-gap-20 items-end" style={{ flexWrap: 'nowrap' }}>
                            <div className="col-auto col-sm-auto">
                              <AirlineLogo 
                                className="size-40"
                                alt="flight icon"
                                fallbackImage={`${segment.avatarBase}.png`}
                                validatingCarrierCode={item.validatingCarrierCode}
                                airlineLogoUrl={item.airlineLogo}
                              />
                            </div>
                            <div className="col" style={{ minWidth: 0 }}>
                              <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.departureTime} </div>
                          <div className="text-15 lh-15 text-light-1">{segment.departureAirport}</div>
                        </div>
                        <div className="col text-center">
                          <div className="flightLine"><div /><div /></div>
                          <div className="text-15 lh-15 text-light-1 mt-10">{segment.duration}</div>
                        </div>
                            <div className="col text-center" style={{ minWidth: 0 }}>
                              <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.arrivalTime} </div>
                          <div className="text-15 lh-15 text-light-1">{segment.arrivalAirport}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                  <div className="col-md-5">
                    <div className="text-16 fw-600 mb-10 text-center">Return {item.returnDateFormatted && `• ${item.returnDateFormatted}`}</div>
                    {item.flightListReturn.map((segment, idx) => (
                      <div className={`row y-gap-10 items-center${idx > 0 ? ' pt-30' : ''}`} key={segment.id}>
                        <div className="col text-center">
                          <div className="row x-gap-20 items-end" style={{ flexWrap: 'nowrap' }}>
                            <div className="col-sm-auto">
                              <AirlineLogo 
                                className="size-40"
                                alt="flight icon"
                                fallbackImage={`${segment.avatarBase}.png`}
                                validatingCarrierCode={item.validatingCarrierCode}
                                airlineLogoUrl={item.airlineLogo}
                              />
                            </div>
                            <div className="col text-center" style={{ minWidth: 0 }}>
                              <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.departureTime} </div>
                              <div className="text-15 lh-15 text-light-1">{segment.departureAirport}</div>
                            </div>
                            <div className="col text-center">
                              <div className="flightLine"><div /><div /></div>
                              <div className="text-15 lh-15 text-light-1 mt-10">{segment.duration}</div>
                            </div>
                            <div className="col text-center" style={{ minWidth: 0 }}>
                              <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.arrivalTime} </div>
                              <div className="text-15 lh-15 text-light-1">{segment.arrivalAirport}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="col">
                  {item.flightList.map((segment, idx) => (
                    <div className={`row y-gap-10 items-center${idx > 0 ? ' pt-30' : ''}`} key={segment.id}>
                      <div className="col">
                        <div className="row x-gap-20 items-end" style={{ flexWrap: 'nowrap' }}>
                          <div className="col-sm-auto">
                            <AirlineLogo 
                              className="size-40"
                              alt="flight icon"
                              fallbackImage={`${segment.avatarBase}.png`}
                              validatingCarrierCode={item.validatingCarrierCode}
                              airlineLogoUrl={item.airlineLogo}
                            />
                          </div>
                          <div className="col" style={{ minWidth: 0 }}>
                            <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.departureTime} <span className="text-13 text-light-1">({segment.departureDateFormatted})</span></div>
                            <div className="text-15 lh-15 text-light-1">{segment.departureAirport}</div>
                          </div>
                          <div className="col text-center">
                            <div className="flightLine"><div /><div /></div>
                            <div className="text-15 lh-15 text-light-1 mt-10">{segment.duration}</div>
                          </div>
                          <div className="col" style={{ minWidth: 0 }}>
                            <div className="lh-15 fw-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{segment.arrivalTime} <span className="text-13 text-light-1">({segment.arrivalDateFormatted})</span></div>
                            <div className="text-15 lh-15 text-light-1">{segment.arrivalAirport}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-top-light h-full md:d-none"style={{ width: '100%', marginTop: 10 }} />
              <div className="col" style={{ width: '100%', marginTop: 10 }}> 
                <div className="d-flex justify-between items-center h-full w-100">
                    <div className="d-flex items-center">
                                              <button
                          type="button"
                          className="bg-transparent border-0 p-0 mr-10"
                          aria-label={wishlistItems.has(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                          title={wishlistItems.has(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                          onClick={() => {
                            if (wishlistItems.has(item.id)) {
                              handleRemoveFromWishlist(item.id);
                            } else {
                              handleAddToWishlist(item.id, item);
                            }
                          }}
                          disabled={wishlistLoading.has(item.id)}
                        >
                          {wishlistLoading.has(item.id) ? (
                            <i className="icon-spinner text-18"></i>
                          ) : (
                            <i className={`icon-heart text-18 ${wishlistItems.has(item.id) ? 'text-red-1' : ''}`}></i>
                          )}
                          <div className="text-12 lh-12 text-light-1 text-right">
                            {wishlistItems.has(item.id) ? "Remove" : "Add to wishlist"}
                          </div>
                        </button>
                    </div>
                    <div className="d-flex items-center">
                        {/* <i className="icon-luggage text-18 mr-5"></i> */}
                        <div className="text-15 lh-16 text-light-1">{item.OperatingAirlineName}</div>
                    </div>
                    <div className="d-flex items-center">
                        <i className="icon-luggage text-18 mr-5"></i>
                        <div className="text-15 lh-16 text-light-1">{item.baggageInfo}</div>
                    </div>
                    <div>
                      <div className="text-18 lh-16 fw-500">US${Math.ceil(item.price)}</div>
                      <div className="text-12 lh-12 text-light-1 text-right">(incl. taxes)</div>
                    </div>
                    <button className="button -dark-1 px-30 h-50 bg-blue-1 text-white" data-bs-toggle="collapse" data-bs-target={`#${item.selectId}`}>
                      View More <div className="icon-arrow-top-right ml-15" />
                    </button>

                </div>
              </div>
            </div>

            <div className="collapse" id={item.selectId}>
              <div className="mt-30 border-top-light" />
              {item.flightListReturn && item.flightListOutbound ? (
                <div className="row">
                  <div className="col-md-6">
                    <div className="border-light rounded-4">
                      {item.flightListOutbound.map((segment, idx) => (
                        <React.Fragment key={segment.id}>
                          <div className="py-20 px-30">
                            <div className="row justify-between items-center">
                              <div className="col-auto"><div className="fw-500 text-dark-1">Outbound • Leg {idx + 1}</div></div>
                              <div className="col-auto"><div className="text-14 text-light-1">{segment.duration}</div></div>
                            </div>
                          </div>
                          <div className="py-30 px-30 border-top-light">
                            <div className="row y-gap-10 justify-between">
                              <div className="col-auto">
                                <div className="relative z-0">
                                  <div className="border-line-2" />
                                  <div className="d-flex items-center">
                                    <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-white" /></div>
                                    <div className="row">
                                      <div className="col-auto"><div className="lh-14 fw-500">{segment.departureTime}</div></div>
                                      <div className="col-auto">
                                        <span>|</span><div className="lh-14 fw-500">{segment.departureAirport}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex items-center mt-15">
                                    <div className="w-28 d-flex justify-center mr-15"><img src="/img/flights/plane.svg" alt="plane" /></div>
                                    <div className="text-14 text-light-1">{segment.duration}</div>
                                  </div>
                                  <div className="d-flex items-center mt-15">
                                    <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-border" /></div>
                                    <div className="row">
                                      <div className="col-auto"><div className="lh-14 fw-500">{segment.arrivalTime}</div></div>
                                      <div className="col-auto">
                                      <span>| </span><div className="lh-14 fw-500">{segment.arrivalAirport}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-auto text-right md:text-left">
                                <div className="text-14 text-light-1">{segment.cabinClass === 'E' ? 'Economy' : segment.cabinClass}</div>
                                <div className="d-flex items-center mb-15">
                                  <div className="w-28 d-flex justify-center mr-15"><AirlineLogo 
                                      className="size-20"
                                      alt="flight icon"
                                      fallbackImage={segment.avatar}
                                      validatingCarrierCode={item.validatingCarrierCode}
                                      airlineLogoUrl={item.airlineLogo}
                                    /></div>
                                  <div className="text-14 text-light-1">{segment.airline} {segment.flightNumber}</div>
                                </div>
                                <div className="text-14 mt-15 md:mt-5">
                                  {segment.equipment}<br />
                                  {segment.OperatingAirlineName && `Operated by ${segment.OperatingAirlineName}`}<br />
                                  {segment.brandName && `Fare: ${segment.brandName}`}
                                </div>
                              </div>
                            </div>
                          </div>
                          {idx < item.flightListOutbound.length - 1 && (
                            <div className="py-20 px-30 border-top-light text-center">
                              <div className="text-15 text-light-1">
                                Layover in {segment.arrivalAirport}: {" "}
                                <span className="fw-500 text-dark-1">
                                  {item.flightListOutbound[idx + 1].LayoverTime ||
                                    calculateDuration(segment.ArrivalDateTime, item.flightListOutbound[idx + 1].DepartureDateTime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border-light rounded-4">
                      {item.flightListReturn.map((segment, idx) => (
                        <React.Fragment key={segment.id}>
                          <div className="py-20 px-30">
                            <div className="row justify-between items-center">
                              <div className="col-auto"><div className="fw-500 text-dark-1">Return • Leg {idx + 1}</div></div>
                              <div className="col-auto"><div className="text-14 text-light-1">{segment.duration}</div></div>
                            </div>
                          </div>
                          <div className="py-30 px-30 border-top-light">
                            <div className="row y-gap-10 justify-between">
                              <div className="col-auto">
                                <div className="relative z-0">
                                  <div className="border-line-2" />
                                  <div className="d-flex items-center">
                                    <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-white" /></div>
                                    <div className="row">
                                      <div className="col-auto"><div className="lh-14 fw-500">{segment.departureTime}</div></div>
                                      <div className="col-auto">
                                      <span>| </span><div className="lh-14 fw-500">{segment.departureAirport}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex items-center mt-15">
                                    <div className="w-28 d-flex justify-center mr-15"><img src="/img/flights/plane.svg" alt="plane" /></div>
                                    <div className="text-14 text-light-1">{segment.duration}</div>
                                  </div>
                                  <div className="d-flex items-center mt-15">
                                    <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-border" /></div>
                                    <div className="row">
                                      <div className="col-auto"><div className="lh-14 fw-500">{segment.arrivalTime}</div></div>
                                      <div className="col-auto">
                                      <span>| </span><div className="lh-14 fw-500">{segment.arrivalAirport}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-auto text-right md:text-left">
                                <div className="text-14 text-light-1">{segment.cabinClass === 'E' ? 'Economy' : segment.cabinClass}</div>
                                <div className="d-flex items-center mb-15">
                                  <div className="w-28 d-flex justify-center mr-15"><AirlineLogo 
                                      className="size-20"
                                      alt="flight icon"
                                      fallbackImage={segment.avatar}
                                      validatingCarrierCode={item.validatingCarrierCode}
                                      airlineLogoUrl={item.airlineLogo}
                                    /></div>
                                  <div className="text-14 text-light-1">{segment.airline} {segment.flightNumber}</div>
                                </div>
                                <div className="text-14 mt-15 md:mt-5">
                                  {segment.equipment}<br />
                                  {segment.OperatingAirlineName && `Operated by ${segment.OperatingAirlineName}`}<br />
                                  {segment.brandName && `Fare: ${segment.brandName}`}
                                </div>
                              </div>
                            </div>
                          </div>
                          {idx < item.flightListReturn.length - 1 && (
                            <div className="py-20 px-30 border-top-light text-center">
                              <div className="text-15 text-light-1">
                                Layover in {segment.arrivalAirport}: {" "}
                                <span className="fw-500 text-dark-1">
                                  {item.flightListReturn[idx + 1].LayoverTime ||
                                    calculateDuration(segment.ArrivalDateTime, item.flightListReturn[idx + 1].DepartureDateTime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
              <div className="border-light rounded-4">
                {item.flightList.map((segment, idx) => (
                  <React.Fragment key={segment.id}>
                    <div className="py-20 px-30">
                      <div className="row justify-between items-center">
                        <div className="col-auto"><div className="fw-500 text-dark-1">Depart • Leg {idx + 1}</div></div>
                        <div className="col-auto"><div className="text-14 text-light-1">{segment.duration}</div></div>
                      </div>
                    </div>
                    <div className="py-30 px-30 border-top-light">
                      <div className="row y-gap-10 justify-between">
                        <div className="col-auto">
                          <div className="relative z-0">
                            <div className="border-line-2" />
                            <div className="d-flex items-center">
                              <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-white" /></div>
                              <div className="row">
                                <div className="col-auto"><div className="lh-14 fw-500">{segment.departureTime}</div></div>
                                <div className="col-auto">
                                  <div className="lh-14 fw-500">
                                    <span>| </span>{segment.departureAirport}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex items-center mt-15">
                              <div className="w-28 d-flex justify-center mr-15"><img src="/img/flights/plane.svg" alt="plane" /></div>
                              <div className="text-14 text-light-1">{segment.duration}</div>
                            </div>
                            <div className="d-flex items-center mt-15">
                              <div className="w-28 d-flex justify-center mr-15"><div className="size-10 border-light rounded-full bg-border" /></div>
                              <div className="row">
                                <div className="col-auto"><div className="lh-14 fw-500">{segment.arrivalTime}</div></div>
                                <div className="col-auto">
                                  <div className="lh-14 fw-500">
                                    <span>| </span>{segment.arrivalAirport}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-auto text-right md:text-left">
                          <div className="text-14 text-light-1">{segment.cabinClass === 'E' ? 'Economy' : segment.cabinClass}</div>
                          <div className="d-flex items-center mb-15">
                            <div className="w-28 d-flex justify-center mr-15"><AirlineLogo 
                                      className="size-20"
                                      alt="flight icon"
                                      fallbackImage={segment.avatar}
                                      validatingCarrierCode={item.validatingCarrierCode}
                                      airlineLogoUrl={item.airlineLogo}
                                    /></div>
                            <div className="text-14 text-light-1">{segment.airline} {segment.flightNumber}</div>
                          </div>
                          <div className="text-14 mt-15 md:mt-5">
                            {segment.equipment}<br />
                            {segment.OperatingAirlineName && `Operated by ${segment.OperatingAirlineName}`}<br />
                            {segment.brandName && `Fare: ${segment.brandName}`}
                          </div>
                          
                          {/* Enhanced Flight Details */}
                          <div className="text-14 mt-15 md:mt-5 border-top-light pt-15">
                            {/* Terminal Information */}
                            {segment.departureTerminal && (
                              <div className="mb-5">
                                <span className="fw-500">Departure Terminal:</span> {segment.departureTerminal}
                              </div>
                            )}
                            {segment.arrivalTerminal && (
                              <div className="mb-5">
                                <span className="fw-500">Arrival Terminal:</span> {segment.arrivalTerminal}
                              </div>
                            )}
                            
                            {/* Booking Class & Fare Details */}
                            {segment.bookingClass && (
                              <div className="mb-5">
                                <span className="fw-500">Booking Class:</span> {segment.bookingClass}
                              </div>
                            )}
                            {segment.fareBasisCode && (
                              <div className="mb-5">
                                <span className="fw-500">Fare Basis:</span> {segment.fareBasisCode}
                              </div>
                            )}
                            
                            {/* Brand & Tier Information */}
                            {segment.brandId && (
                              <div className="mb-5">
                                <span className="fw-500">Brand ID:</span> {segment.brandId}
                              </div>
                            )}
                            {segment.brandTier && (
                              <div className="mb-5">
                                <span className="fw-500">Brand Tier:</span> {segment.brandTier}
                              </div>
                            )}
                            
                            {/* Flight Status & Characteristics */}
                            {segment.segmentStatus && (
                              <div className="mb-5">
                                <span className="fw-500">Status:</span> {segment.segmentStatus}
                              </div>
                            )}
                            {segment.redEyeFlight && (
                              <div className="mb-5">
                                <span className="fw-500 text-orange-1">Red-Eye Flight</span>
                              </div>
                            )}
                            {segment.selfTransfer && (
                              <div className="mb-5">
                                <span className="fw-500 text-red-1">Self-Transfer Required</span>
                              </div>
                            )}
                            
                            {/* Seat & Availability */}
                            {segment.noOfSeats !== null && segment.noOfSeats !== undefined && (
                              <div className="mb-5">
                                <span className="fw-500">Available Seats:</span> {segment.noOfSeats}
                              </div>
                            )}
                            
                            {/* Airline PNR */}
                            {segment.airlinePnr && (
                              <div className="mb-5">
                                <span className="fw-500">Airline PNR:</span> {segment.airlinePnr}
                              </div>
                            )}
                            
                            {/* Segment Reference */}
                            {segment.segmentReferenceKey && (
                              <div className="mb-5">
                                <span className="fw-500">Segment Ref:</span> {segment.segmentReferenceKey}
                              </div>
                            )}
                            
                            {/* Delimited Segment Reference */}
                            {segment.delimitedSegmentRef && (
                              <div className="mb-5">
                                <span className="fw-500">Delimited Ref:</span> {segment.delimitedSegmentRef}
                              </div>
                            )}
                            
                            {/* Additional Flight Information */}
                            {segment.connectingFlight && (
                              <div className="mb-5">
                                <span className="fw-500 text-blue-1">Connecting Flight</span>
                              </div>
                            )}
                            
                            {segment.longLayOverFlight && (
                              <div className="mb-5">
                                <span className="fw-500 text-orange-1">Long Layover Flight</span>
                              </div>
                            )}
                            
                            {/* Meal Information */}
                            {segment.segmentMeals && Object.keys(segment.segmentMeals).length > 0 && (
                              <div className="mb-5">
                                <span className="fw-500">Meals:</span> {Object.keys(segment.segmentMeals).join(', ')}
                              </div>
                            )}
                            
                            {/* Rich Content Amenities */}
                            {segment.richContentAmenities && Object.keys(segment.richContentAmenities).length > 0 && (
                              <div className="mb-5">
                                <span className="fw-500">Amenities:</span> {Object.keys(segment.richContentAmenities).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {idx < item.flightList.length - 1 && (
                      <div className="py-20 px-30 border-top-light text-center">
                        <div className="text-15 text-light-1">
                          Layover in {segment.arrivalAirport}: {" "}
                          <span className="fw-500 text-dark-1">
                            {item.flightList[idx + 1].LayoverTime ||
                              calculateDuration(segment.ArrivalDateTime, item.flightList[idx + 1].DepartureDateTime)}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              )}


              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button 
                  className="button -dark-1 px-30 h-50 bg-blue-1 text-white" 
                  onClick={() => {
                    // Check if user is authenticated
                    if (!isAuthenticated) {
                      // Store the booking action for after login
                      storePostLoginAction('booking', item.id);
                      setShowLoginPrompt(true);
                      return;
                    }
                    // Navigate to booking page if authenticated
                    navigate(`/flight/booking/${item.id}`);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Login Required"
        message="Please log in to book flights, add to wishlist, and access your account features."
      />
    </>
  );
};

export default FlightProperties;