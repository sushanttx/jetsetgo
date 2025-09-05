import React, { useMemo, useCallback } from "react";
import airlinesData from "../../../data/airlines.json";

// Reusable checkbox
const FilterCheckbox = React.memo(({ id, label, checked, onChange }) => (
  <div className="row y-gap-10 items-center justify-between">
    <div className="col-auto">
      <div className="form-checkbox d-flex items-center">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <div className="form-checkbox__mark">
          <div className="form-checkbox__icon icon-check" />
        </div>
        <label htmlFor={id} className="text-15 ml-10">
          {label}
        </label>
      </div>
    </div>
  </div>
));

const Sidebar = ({ allFlights = [], filters = {}, onFilterChange }) => {
  const {
    stops: selectedStops = [],
    airlines: selectedAirlines = [],
    price: selectedPrice = { min: 0, max: 0 },
    departureTimes: selectedDepartureTimes = [],
    arrivalTimes: selectedArrivalTimes = [],
    cabinClass: selectedCabinClass = [],
    preferredAirlines: selectedPreferredAirlines = [],
  } = filters;

  // Get search preferences from window (set during page load)
  const searchPreferences = {
    cabinClass: [],
    preferredAirlines: [],
    departureTimes: [],
    arrivalTimes: [],
    ...(window.__searchPreferences || {})
  };

  // Show search preferences as checked initially, but allow user to override
  // Once user makes any selection, their choice takes precedence
  const displayCabinClass = selectedCabinClass.length > 0 ? selectedCabinClass : (searchPreferences.cabinClass || []);
  const displayDepartureTimes = selectedDepartureTimes.length > 0 ? selectedDepartureTimes : (searchPreferences.departureTimes || []);
  const displayArrivalTimes = selectedArrivalTimes.length > 0 ? selectedArrivalTimes : (searchPreferences.arrivalTimes || []);
  
  // Check if directFlights was selected in search form
  const searchForm = JSON.parse(localStorage.getItem("flightSearchForm") || "{}");
  const directFlightsSelected = searchForm.directFlights;
  
  // Check if this is a round-trip search (has returnDate)
  const isRoundTrip = searchForm.returnDate && searchForm.returnDate !== "";
  
  // Show Nonstop as checked if direct flights was selected, but allow user to override
  // If user has made any stops selection, use that; otherwise show search preference
  const displayStops = selectedStops.length > 0 ? selectedStops : (directFlightsSelected ? [0] : []);
  
  // Get preferred airlines from search form and convert codes to names
  const preferredAirlinesFromSearch = [];
  if (searchForm.airline1) {
    const airlineFromCode = airlinesData.airlines.find(a => 
      a.code.toLowerCase() === searchForm.airline1.toLowerCase()
    );
    if (airlineFromCode) {
      preferredAirlinesFromSearch.push(airlineFromCode.name);
    } else {
      preferredAirlinesFromSearch.push(searchForm.airline1);
    }
  }
  if (searchForm.airline2) {
    const airlineFromCode = airlinesData.airlines.find(a => 
      a.code.toLowerCase() === searchForm.airline2.toLowerCase()
    );
    if (airlineFromCode) {
      preferredAirlinesFromSearch.push(airlineFromCode.name);
    } else {
      preferredAirlinesFromSearch.push(searchForm.airline2);
    }
  }
  
  // Show preferred airlines as checked if user hasn't made any airline selection
  const displayAirlines = selectedAirlines.length > 0 ? selectedAirlines : preferredAirlinesFromSearch;
  
  // Debug logging - moved after all display variables are defined
  console.log('Sidebar Debug:', {
    selectedCabinClass,
    selectedDepartureTimes,
    selectedArrivalTimes,
    selectedStops,
    selectedAirlines,
    searchPreferences,
    displayCabinClass,
    displayDepartureTimes,
    displayArrivalTimes,
    displayStops,
    displayAirlines,
    isRoundTrip
  });

  // Build filter options once unless flights change
  const filterOptions = useMemo(() => {
    const stops = [...new Set(allFlights.map(f => f.stops))].sort((a, b) => a - b);
    const airlines = [...new Set(allFlights.map(f => f.airline))].sort();
    const prices = allFlights.map(f => f.price);
    
    // Get unique cabin classes from flights
    const cabinClasses = [...new Set(allFlights.map(f => {
      const flightCabinClass = f.flightList?.[0]?.cabinClass || 'E';
      const cabinMapping = {
        'E': 'Economy/Coach',
        'B': 'Business Class', 
        'F': 'First Class',
        'P': 'Premium'
      };
      return cabinMapping[flightCabinClass] || 'Economy/Coach';
    }))].sort();
    
    if (!Array.isArray(allFlights) || allFlights.length === 0) {
      return { stops: [], airlines: [], cabinClasses: [], priceRange: { min: 0, max: 0 } };
    }

    return {
      stops,
      airlines,
      cabinClasses,
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 0,
      },
    };
  }, [allFlights]);

  const departureTimeRanges = useMemo(
    () => [
      { label: "Early Morning (00:00 - 05:59)", value: "0-6" },
      { label: "Morning (06:00 - 11:59)", value: "6-12" },
      { label: "Afternoon (12:00 - 17:59)", value: "12-18" },
      { label: "Evening (18:00 - 23:59)", value: "18-24" },
    ],
    []
  );

  const arrivalTimeRanges = useMemo(
    () => [
      { label: "Early Morning (00:00 - 05:59)", value: "0-6" },
      { label: "Morning (06:00 - 11:59)", value: "6-12" },
      { label: "Afternoon (12:00 - 17:59)", value: "12-18" },
      { label: "Evening (18:00 - 23:59)", value: "18-24" },
    ],
    []
  );


  return (
    <>
      {/* Stops */}
      <div className="sidebar__item -no-border">
        <h5 className="text-18 fw-500 mb-10">Stops</h5>
        <div className="sidebar-checkbox">
          {filterOptions.stops.length > 0 ? (
            filterOptions.stops.map((stop) => (
              <FilterCheckbox
                key={stop}
                id={`stop-${stop}`}
                label={stop === 0 ? "Nonstop" : `${stop} Stop${stop > 1 ? "s" : ""}`}
                checked={displayStops.includes(stop)}
                onChange={() => onFilterChange("stops", stop)}
              />
            ))
          ) : (
            <div className="text-light-1 text-13">No stop options yet</div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="sidebar__item pb-30">
        <h5 className="text-18 fw-500 mb-10">Price</h5>
        <div className="row x-gap-10 y-gap-30">
          <div className="col-6">
            <label>Min</label>
            <input
              type="number"
              className="mt-5"
              value={selectedPrice.min || filterOptions.priceRange.min}
              onChange={(e) =>
                onFilterChange("price", {
                  ...selectedPrice,
                  min: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="col-6">
            <label>Max</label>
            <input
              type="number"
              className="mt-5"
              value={selectedPrice.max || filterOptions.priceRange.max}
              onChange={(e) =>
                onFilterChange("price", {
                  ...selectedPrice,
                  max: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Airlines */}
      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Airlines</h5>
        <div className="sidebar-checkbox">
          {filterOptions.airlines.length > 0 ? (
            filterOptions.airlines.map((airline) => (
              <FilterCheckbox
                key={airline}
                id={`airline-${airline}`}
                label={airline}
                checked={displayAirlines.includes(airline)}
                onChange={() => onFilterChange("airlines", airline)}
              />
            ))
          ) : (
            <div className="text-light-1 text-13">No airline options yet</div>
          )}
        </div>
      </div>

      {/* Departure Times */}
      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Departing Time</h5>
        <div className="sidebar-checkbox">
          {departureTimeRanges.map((range) => (
            <FilterCheckbox
              key={range.value}
              id={`dep-${range.value}`}
              label={range.label}
              checked={displayDepartureTimes.includes(range.value)}
              onChange={(() => onFilterChange("departureTimes", range.value))
              }
            />
          ))}
        </div>
      </div>

      {/* Arrival Times - Only show for round-trip searches */}
      {isRoundTrip && (
        <div className="sidebar__item">
          <h5 className="text-18 fw-500 mb-10">Arriving Time</h5>
          <div className="sidebar-checkbox">
            {arrivalTimeRanges.map((range) => (
              <FilterCheckbox
                key={range.value}
                id={`arr-${range.value}`}
                label={range.label}
                checked={displayArrivalTimes.includes(range.value)}
                onChange={() => onFilterChange("arrivalTimes", range.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cabin Class */}
      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Cabin Class</h5>
        <div className="sidebar-checkbox">
          {filterOptions.cabinClasses.length > 0 ? (
            filterOptions.cabinClasses.map((cabinClass) => (
              <FilterCheckbox
                key={cabinClass}
                id={`cabin-${cabinClass}`}
                label={cabinClass}
                checked={displayCabinClass.includes(cabinClass)}
                onChange={() => onFilterChange("cabinClass", cabinClass)}
              />
            ))
          ) : (
            <div className="text-light-1 text-13">No cabin class options yet</div>
          )}
        </div>
      </div>

    </>
  );
};

export default React.memo(Sidebar);
