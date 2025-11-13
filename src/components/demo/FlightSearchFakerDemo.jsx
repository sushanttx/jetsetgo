import React, { useState } from 'react';
import flightSearchFaker from '../../services/flightSearchFaker';

const FlightSearchFakerDemo = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    departureCode: 'BOM',
    arrivalCode: 'DEL',
    departureDate: '2025-10-15',
    returnDate: '',
    isRoundTrip: false
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = flightSearchFaker.generateFlightSearchResponse(
        searchParams.departureCode,
        searchParams.arrivalCode,
        searchParams.departureDate,
        searchParams.isRoundTrip ? searchParams.returnDate : null
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSearch = async () => {
    setLoading(true);
    try {
      const results = flightSearchFaker.generateRandomRouteSearch(
        searchParams.departureDate,
        searchParams.isRoundTrip ? searchParams.returnDate : null
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Random search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Flight Search Faker Demo</h2>
          
          {/* Search Form */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Search Parameters</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Departure Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={searchParams.departureCode}
                    onChange={(e) => setSearchParams({...searchParams, departureCode: e.target.value.toUpperCase()})}
                    placeholder="e.g., BOM"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Arrival Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={searchParams.arrivalCode}
                    onChange={(e) => setSearchParams({...searchParams, arrivalCode: e.target.value.toUpperCase()})}
                    placeholder="e.g., DEL"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Departure Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={searchParams.departureDate}
                    onChange={(e) => setSearchParams({...searchParams, departureDate: e.target.value})}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                    disabled={!searchParams.isRoundTrip}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Trip Type</label>
                  <select
                    className="form-control"
                    value={searchParams.isRoundTrip ? 'round' : 'oneway'}
                    onChange={(e) => setSearchParams({...searchParams, isRoundTrip: e.target.value === 'round'})}
                  >
                    <option value="oneway">One Way</option>
                    <option value="round">Round Trip</option>
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <button 
                    className="btn btn-primary me-2" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : 'Search Flights'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleRandomSearch}
                    disabled={loading}
                  >
                    Random Route Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="card">
              <div className="card-header">
                <h5>Search Results ({searchResults.SearchMetadata.TotalResults} flights found)</h5>
                <small className="text-muted">
                  {searchResults.SearchMetadata.DepartureCode} → {searchResults.SearchMetadata.ArrivalCode} | 
                  Departure: {searchResults.SearchMetadata.DepartureDate}
                  {searchResults.SearchMetadata.ReturnDate && ` | Return: ${searchResults.SearchMetadata.ReturnDate}`}
                </small>
              </div>
              <div className="card-body">
                {searchResults.FlightItinerary.map((itinerary, index) => (
                  <div key={itinerary.ItineraryId} className="border rounded p-3 mb-3">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="mb-2">
                          {itinerary.ValidatingCarrierName} ({itinerary.ValidatingCarrierCode})
                        </h6>
                        {itinerary.Citypairs.map((citypair, cityIndex) => (
                          <div key={cityIndex} className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="fw-bold">
                                {citypair.FlightSegment[0].DepartureDisplayName} → {citypair.FlightSegment[citypair.FlightSegment.length - 1].DisplayName}
                              </span>
                              <span className="text-muted">
                                {citypair.Duration} {citypair.NoOfStops > 0 && `(${citypair.NoOfStops} stop${citypair.NoOfStops > 1 ? 's' : ''})`}
                              </span>
                            </div>
                            {citypair.FlightSegment.map((segment, segIndex) => (
                              <div key={segIndex} className="ms-3 text-sm">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    {segment.MarketingAirlineName} {segment.FlightNumber} | {segment.AirEquipmentType}
                                  </span>
                                  <span className="text-muted">
                                    {new Date(segment.DepartureDateTime).toLocaleTimeString()} - {new Date(segment.ArrivalDateTime).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="text-muted">
                                  {segment.DepartureLocationCode} → {segment.ArrivalLocationCode} | {segment.CabinClass}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="h4 text-primary">
                          {formatPrice(itinerary.Pricing.TotalFare)}
                        </div>
                        <div className="text-muted small">
                          Base: {formatPrice(itinerary.Pricing.BaseFare)}<br/>
                          Taxes: {formatPrice(itinerary.Pricing.Taxes)}<br/>
                          Fees: {formatPrice(itinerary.Pricing.Fees)}
                        </div>
                        <div className="mt-2">
                          <span className="badge bg-info">{itinerary.Pricing.FareType}</span>
                          <span className="badge bg-secondary ms-1">{itinerary.Pricing.FareRules.Baggage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON Output */}
          {searchResults && (
            <div className="card mt-4">
              <div className="card-header">
                <h5>Raw JSON Output</h5>
              </div>
              <div className="card-body">
                <pre className="bg-light p-3" style={{maxHeight: '400px', overflow: 'auto'}}>
                  {JSON.stringify(searchResults, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearchFakerDemo;

