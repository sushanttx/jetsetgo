import React, { useState } from 'react';
import flightSearchFaker from '../../services/flightSearchFaker';
import routeSpecificFaker from '../../services/routeSpecificFaker';

const SimpleFakerTest = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFaker = async (type) => {
    setLoading(true);
    try {
      let searchResults;
      
      switch (type) {
        case 'bom-del-oneway':
          searchResults = routeSpecificFaker.generateBOMToDELSearch('2025-10-15');
          break;
        case 'bom-del-roundtrip':
          searchResults = routeSpecificFaker.generateBOMToDELSearch('2025-10-15', '2025-10-20');
          break;
        case 'bom-blr':
          searchResults = routeSpecificFaker.generateIndianDomesticSearch('BOM', 'BLR', '2025-10-15');
          break;
        case 'del-ccu':
          searchResults = routeSpecificFaker.generateIndianDomesticSearch('DEL', 'CCU', '2025-10-15');
          break;
        case 'random':
          searchResults = flightSearchFaker.generateRandomRouteSearch('2025-10-15');
          break;
        default:
          searchResults = flightSearchFaker.generateFlightSearchResponse('BOM', 'DEL', '2025-10-15');
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Faker test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Simple Faker Test</h2>
          
          {/* Test Buttons */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Test Different Scenarios</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => testFaker('bom-del-oneway')}
                    disabled={loading}
                  >
                    BOM-DEL One Way
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => testFaker('bom-del-roundtrip')}
                    disabled={loading}
                  >
                    BOM-DEL Round Trip
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-secondary w-100"
                    onClick={() => testFaker('bom-blr')}
                    disabled={loading}
                  >
                    BOM-BLR (Indian Route)
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-secondary w-100"
                    onClick={() => testFaker('del-ccu')}
                    disabled={loading}
                  >
                    DEL-CCU (Indian Route)
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-info w-100"
                    onClick={() => testFaker('random')}
                    disabled={loading}
                  >
                    Random Route
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-warning w-100"
                    onClick={() => testFaker('custom')}
                    disabled={loading}
                  >
                    Custom Route
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearResults}
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Generating flight data...</p>
            </div>
          )}

          {results && (
            <div className="card">
              <div className="card-header">
                <h5>Faker Results</h5>
                <small className="text-muted">
                  {results.SearchMetadata?.TotalResults || results.FlightItinerary?.length} flights generated
                </small>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Search Metadata</h6>
                    <ul className="list-unstyled">
                      <li><strong>Search ID:</strong> {results.SearchMetadata?.SearchId}</li>
                      <li><strong>Departure:</strong> {results.SearchMetadata?.DepartureCode}</li>
                      <li><strong>Arrival:</strong> {results.SearchMetadata?.ArrivalCode}</li>
                      <li><strong>Departure Date:</strong> {results.SearchMetadata?.DepartureDate}</li>
                      <li><strong>Return Date:</strong> {results.SearchMetadata?.ReturnDate || 'N/A'}</li>
                      <li><strong>Total Results:</strong> {results.SearchMetadata?.TotalResults}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Sample Flight</h6>
                    {results.FlightItinerary && results.FlightItinerary.length > 0 && (
                      <div className="border p-3 rounded">
                        <div className="d-flex justify-content-between">
                          <span><strong>{results.FlightItinerary[0].ValidatingCarrierName}</strong></span>
                          <span className="text-primary">
                            ₹{results.FlightItinerary[0].Pricing?.TotalFare || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            {results.FlightItinerary[0].Citypairs?.[0]?.Duration || 'N/A'} • 
                            {results.FlightItinerary[0].Citypairs?.[0]?.NoOfStops || 0} stops
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Raw JSON */}
                <div className="mt-4">
                  <h6>Raw JSON Output</h6>
                  <pre className="bg-light p-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleFakerTest;

