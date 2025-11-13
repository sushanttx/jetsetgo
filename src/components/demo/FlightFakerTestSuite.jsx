import React, { useState } from 'react';
import flightSearchFaker from '../../services/flightSearchFaker';
import routeSpecificFaker from '../../services/routeSpecificFaker';

const FlightFakerTestSuite = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setTestResults(prev => [...prev, {
        testName,
        success: true,
        duration,
        resultCount: result.FlightItinerary?.length || 0,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setTestResults(prev => [...prev, {
        testName,
        success: false,
        duration,
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Basic BOM-DEL One Way',
      function: () => flightSearchFaker.generateBOMToDELSearch('2025-10-15')
    },
    {
      name: 'BOM-DEL Round Trip',
      function: () => flightSearchFaker.generateBOMToDELSearch('2025-10-15', '2025-10-20')
    },
    {
      name: 'Route Specific BOM-DEL',
      function: () => routeSpecificFaker.generateBOMToDELSearch('2025-10-15')
    },
    {
      name: 'Route Specific BOM-DEL Round Trip',
      function: () => routeSpecificFaker.generateBOMToDELSearch('2025-10-15', '2025-10-20')
    },
    {
      name: 'Random Route Search',
      function: () => flightSearchFaker.generateRandomRouteSearch('2025-10-15')
    },
    {
      name: 'Indian Domestic BOM-BLR',
      function: () => routeSpecificFaker.generateIndianDomesticSearch('BOM', 'BLR', '2025-10-15')
    },
    {
      name: 'Indian Domestic DEL-CCU',
      function: () => routeSpecificFaker.generateIndianDomesticSearch('DEL', 'CCU', '2025-10-15')
    },
    {
      name: 'Custom Route BOM-HYD',
      function: () => flightSearchFaker.generateFlightSearchResponse('BOM', 'HYD', '2025-10-15')
    }
  ];

  const runAllTests = async () => {
    setTestResults([]);
    for (const test of tests) {
      await runTest(test.name, test.function);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const runSingleTest = async (test) => {
    await runTest(test.name, test.function);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getSuccessRate = () => {
    if (testResults.length === 0) return 0;
    const successful = testResults.filter(r => r.success).length;
    return Math.round((successful / testResults.length) * 100);
  };

  const getAverageDuration = () => {
    if (testResults.length === 0) return 0;
    const total = testResults.reduce((sum, r) => sum + r.duration, 0);
    return Math.round(total / testResults.length);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Flight Faker Test Suite</h2>
          
          {/* Test Controls */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Test Controls</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <button 
                    className="btn btn-primary me-2" 
                    onClick={runAllTests}
                    disabled={loading}
                  >
                    {loading ? 'Running Tests...' : 'Run All Tests'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={clearResults}
                    disabled={loading}
                  >
                    Clear Results
                  </button>
                </div>
                <div className="col-md-6 text-end">
                  {testResults.length > 0 && (
                    <div>
                      <span className="badge bg-success me-2">
                        Success Rate: {getSuccessRate()}%
                      </span>
                      <span className="badge bg-info">
                        Avg Duration: {getAverageDuration()}ms
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Individual Tests */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Individual Tests</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {tests.map((test, index) => (
                  <div key={index} className="col-md-6 mb-2">
                    <button 
                      className="btn btn-outline-primary w-100" 
                      onClick={() => runSingleTest(test)}
                      disabled={loading}
                    >
                      {test.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h5>Test Results ({testResults.length} tests)</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Results Count</th>
                        <th>Timestamp</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((result, index) => (
                        <tr key={index}>
                          <td>{result.testName}</td>
                          <td>
                            {result.success ? (
                              <span className="badge bg-success">Success</span>
                            ) : (
                              <span className="badge bg-danger">Failed</span>
                            )}
                          </td>
                          <td>{result.duration}ms</td>
                          <td>{result.resultCount || 'N/A'}</td>
                          <td>{new Date(result.timestamp).toLocaleTimeString()}</td>
                          <td>
                            {result.error ? (
                              <small className="text-danger">{result.error}</small>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sample Output */}
          {testResults.length > 0 && testResults[testResults.length - 1]?.success && (
            <div className="card mt-4">
              <div className="card-header">
                <h5>Sample Output (Latest Successful Test)</h5>
              </div>
              <div className="card-body">
                <pre className="bg-light p-3" style={{maxHeight: '300px', overflow: 'auto'}}>
                  {JSON.stringify(testResults[testResults.length - 1], null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightFakerTestSuite;

