import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import TopHeaderFilter from "@/components/flight-list/flight-list-v1/TopHeaderFilter";
import FlightProperties from "@/components/flight-list/flight-list-v1/FlightProperties";
import Pagination from "@/components/flight-list/common/Pagination";
import Sidebar from "@/components/flight-list/flight-list-v1/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MetaComponent from "@/components/common/MetaComponent";
import { transformFlightData } from "@/utils/flight-helpers";
import airlinesData from "@/data/airlines.json";

const metadata = {
  title: "Flight || JetSetGo",
  description: "JetSetGo",
};

// NEW: Default structure for the search form
const defaultSearchForm = {
  from: "",
  to: "",
  date: new Date().toISOString(), // Use today's date as a fallback
  adult: 1,
  child: 0,
  lapInfant: 0,
  seatInfant: 0,
};

const formatTime = (dateTimeString) => new Date(dateTimeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

const formatDuration = (durationString) => durationString ? durationString.replace('H', 'h ').replace('M', 'm') : "";



const FlightListPage1 = () => {
  const navigate = useNavigate();
  // MODIFICATION: Initialize state with the default object instead of null
  const [searchForm, setSearchForm] = useState(defaultSearchForm);
  const [flightData, setFlightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price-asc");

  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    price: { min: 0, max: 10000 },
    departureTimes: [],
    arrivalTimes: [],
    cabinClass: [],
    preferredAirlines: [],
  });
  
  const [searchPreferences, setSearchPreferences] = useState({
    cabinClass: [],
    preferredAirlines: [],
    departureTimes: [],
    arrivalTimes: [],
  });  

  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  useEffect(() => {
    // Check if we have search results from faker
    const searchResults = localStorage.getItem("flightSearchResults");
    if (searchResults) {
      try {
        const results = JSON.parse(searchResults);
        const transformedData = transformFlightData(results);
        setFlightData(transformedData);

        if (transformedData.length > 0) {
          const prices = transformedData.map(f => f.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          // Set initial filters based on faker data
          const initialFilters = {
            stops: [],
            airlines: [],
            price: { min: minPrice, max: maxPrice },
            departureTimes: [],
            cabinClass: [],
            preferredAirlines: [],
          };
          
          setFilters(initialFilters);
        }
      } catch (error) {
        console.error("Error parsing flight data:", error);
        setFlightData([]);
      }
    } else {
      // If no search results, show message to search first
      console.log("No search results found. Please search for flights first.");
      setFlightData([]);
    }
    setLoading(false);
  }, []);


  const filteredFlights = useMemo(() => {
    return flightData.filter(flight => {
      // Stops Filter - User can manually filter by stops
      if (filters.stops && filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
        return false;
      }
      // Airlines Filter - User can manually filter by airlines
      if (filters.airlines && filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }
      // Price Filter - Always apply price filter
      if (filters.price && (flight.price < filters.price.min || flight.price > filters.price.max)) {
        return false;
      }
      // Departure Time Filter - User can manually filter by time
      if (filters.departureTimes && filters.departureTimes.length > 0) {
        const departureHour = new Date(flight.departureTimeFull).getHours();
        const departureMatch = filters.departureTimes.some(timeRange => {
          const [start, end] = timeRange.split('-').map(Number);
          return departureHour >= start && departureHour < end;
        });
        if (!departureMatch) return false;
      }
      // Arrival Time Filter - User can manually filter by return flight arrival time (round-trip only)
      if (filters.arrivalTimes && filters.arrivalTimes.length > 0) {
        // For round-trip flights, check the return flight arrival time
        const returnFlight = flight.flightListReturn?.[flight.flightListReturn.length - 1];
        if (returnFlight && returnFlight.ArrivalDateTime) {
          const arrivalHour = new Date(returnFlight.ArrivalDateTime).getHours();
          const arrivalMatch = filters.arrivalTimes.some(timeRange => {
            const [start, end] = timeRange.split('-').map(Number);
            return arrivalHour >= start && arrivalHour < end;
          });
          if (!arrivalMatch) return false;
        }
      }
      // Cabin Class Filter - Only apply if user manually selects it (not from search preferences)
      // This allows search preferences to be shown as checked but not restrictive
      if (filters.cabinClass && filters.cabinClass.length > 0) {
        const flightCabinClass = flight.flightList?.[0]?.cabinClass || 'Economy';
        const cabinClassMatch = filters.cabinClass.some(selectedCabin => {
          // Map cabin class codes to display names
          const cabinMapping = {
            'E': 'Economy/Coach',
            'B': 'Business Class', 
            'F': 'First Class',
            'P': 'Premium'
          };
          const mappedCabin = cabinMapping[flightCabinClass] || 'Economy/Coach';
          return mappedCabin === selectedCabin;
        });
        if (!cabinClassMatch) return false;
      }
      // Preferred Airlines Filter - Only apply if user manually selects it (not from search preferences)
      // This allows search preferences to be shown as checked but not restrictive
      if (filters.preferredAirlines && filters.preferredAirlines.length > 0) {
        const flightAirline = flight.airline;
        const airlineMatch = filters.preferredAirlines.some(preferredAirline => {
          // Check if the flight airline matches any of the preferred airlines
          // Handle both airline codes (AA) and names (American Airlines)
          if (!flightAirline) return false;
          
          const flightAirlineLower = flightAirline.toLowerCase();
          const preferredAirlineLower = preferredAirline.toLowerCase();
          
          // Direct match
          if (flightAirlineLower.includes(preferredAirlineLower)) return true;
          
          // Check if preferred airline is a code and matches airline name
          // Import airlines data to check codes
          const airlinesData = require('../../data/airlines.json');
          const airlineFromCode = airlinesData.airlines.find(a => 
            a.code.toLowerCase() === preferredAirlineLower
          );
          
          if (airlineFromCode && flightAirlineLower.includes(airlineFromCode.name.toLowerCase())) {
            return true;
          }
          
          return false;
        });
        if (!airlineMatch) return false;
      }
      return true;
    });
  }, [flightData, filters]);

  const sortedFlights = useMemo(() => {
    console.log(`--- Running Sort Function ---`);
    console.log(`Triggered by sort option: ${sortBy}`);
    console.log(`Filtered flights count: ${filteredFlights.length}`);
    
    if (filteredFlights.length === 0) {
      console.log('No flights to sort');
      return [];
    }
    
    const sorted = [...filteredFlights];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "duration-asc":
        sorted.sort((a, b) => (a.totalDurationInMinutes || 0) - (b.totalDurationInMinutes || 0));
        break;
      default:
        break;
    }
    console.log('First item BEFORE sort:', filteredFlights[0]?.price);
    console.log('First item AFTER sort:', sorted[0]?.price);
    console.log(`--------------------------`);
    return sorted;
  }, [filteredFlights, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        // Handle checkbox filters (stops, airlines, etc.)
        const newValues = prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value];
        return { ...prev, [filterType]: newValues };
      }
      // Handle other filters like price slider
      return { ...prev, [filterType]: value };
    });
  };


  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * flightsPerPage;
    return sortedFlights.slice(startIndex, startIndex + flightsPerPage);
  }, [sortedFlights, currentPage, flightsPerPage]);


  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>
      <Header11 />

      {/* Search Summary */}
      {/* Show single line for one-way, two lines for round-trip */}
      {searchForm?.from && (
        <section className="pt-20 pb-20 bg-blue-1">
          <div className="container">
            <div className="row y-gap-10 justify-between items-start">
              <div className="col-auto">
                <div className="text-white">
                  {/* Outbound */}
                  <h4 className="text-white mb-5">
                    {searchForm.from} → {searchForm.to}
                  </h4>
                  <div className="text-14 mb-10">
                    {(() => {
                      const d = searchForm.date || searchForm.departureDate;
                      const formatted = d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
                      return `${formatted} • ${searchForm.adult} Adult${searchForm.adult > 1 ? 's' : ''}`
                        + (searchForm.child > 0 ? `, ${searchForm.child} Child${searchForm.child > 1 ? 'ren' : ''}` : '')
                        + (searchForm.lapInfant > 0 ? `, ${searchForm.lapInfant} Lap Infant${searchForm.lapInfant > 1 ? 's' : ''}` : '')
                        + (searchForm.seatInfant > 0 ? `, ${searchForm.seatInfant} Seat Infant${searchForm.seatInfant > 1 ? 's' : ''}` : '');
                    })()}
                  </div>
                  {/* Return (only if present) */}
                </div>
              </div>
              <div className="col-auto">
                <div className="text-white">
                  {searchForm.returnDate && (
                    <>
                      <h4 className="text-white mb-5">
                        {searchForm.to} → {searchForm.from}
                      </h4>
                      <div className="text-14">
                        {new Date(searchForm.returnDate).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })} • {searchForm.adult} Adult{searchForm.adult > 1 ? 's' : ''}
                        {searchForm.child > 0 && `, ${searchForm.child} Child${searchForm.child > 1 ? 'ren' : ''}`}
                        {searchForm.lapInfant > 0 && `, ${searchForm.lapInfant} Lap Infant${searchForm.lapInfant > 1 ? 's' : ''}`}
                        {searchForm.seatInfant > 0 && `, ${searchForm.seatInfant} Seat Infant${searchForm.seatInfant > 1 ? 's' : ''}`}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-auto">
                <button 
                  className="button -outline-white text-white px-30 h-50"
                  onClick={() => navigate('/')}
                >
                  Modify Search
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="layout-pb-md bg-light-2">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-3">
              <aside className="sidebar py-20 px-20 xl:d-none bg-white">
                <div className="row y-gap-40">
                  <Sidebar 
                  allFlights={flightData}
                  filters={filters}
                  onFilterChange={handleFilterChange}/>
                </div>
              </aside>
              <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="listingSidebar"
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasLabel">
                    Filter Flights
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body">
                  <aside className="sidebar y-gap-40  xl:d-block">
                    <Sidebar 
                    allFlights={flightData}
                    filters={filters}
                    onFilterChange={handleFilterChange}/>
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-xl-9 ">
              <TopHeaderFilter
                flightCount={sortedFlights.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <div className="row">
                <FlightProperties
                  flights={paginatedFlights}
                  loading={loading}
                />
              </div>
              <Pagination 
                currentPage={currentPage}
                totalItems={sortedFlights.length}
                itemsPerPage={flightsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
};


export default FlightListPage1;