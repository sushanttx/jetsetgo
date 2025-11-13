import { useState } from "react";
import DateSearch from "../common/DateSearch";
import GuestSearch from "../common/GuestSearch";
import LocationSearch from "../common/LocationSearch";
import FilterSelect from "../flight-list-v1/FilterSelect";
import flightSearchFaker from "../../../services/flightSearchFaker";
import routeSpecificFaker from "../../../services/routeSpecificFaker";

const MainFilterSearchBox = ({ onSearchResults }) => {
  const [searchForm, setSearchForm] = useState({
    from: null,
    to: null,
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    tripType: 'oneway'
  });
  const [loading, setLoading] = useState(false);

  const handleFromSelect = (airport) => {
    setSearchForm(prev => ({ ...prev, from: airport }));
  };

  const handleToSelect = (airport) => {
    setSearchForm(prev => ({ ...prev, to: airport }));
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setSearchForm(prev => ({
        ...prev,
        departureDate: dates[0].format('YYYY-MM-DD'),
        returnDate: dates.length > 1 ? dates[1].format('YYYY-MM-DD') : null,
        tripType: dates.length > 1 ? 'roundtrip' : 'oneway'
      }));
    }
  };

  const handleGuestChange = (guests) => {
    setSearchForm(prev => ({
      ...prev,
      adults: guests.adults || 1,
      children: guests.children || 0,
      infants: guests.infants || 0
    }));
  };

  const handleSearch = () => {
    if (!searchForm.from || !searchForm.to) {
      alert('Please select departure and arrival locations');
      return;
    }

    setLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        let results;
        
        // Use route-specific faker for Indian domestic routes
        const isIndianRoute = ['BOM', 'DEL', 'BLR', 'CCU', 'HYD', 'MAA'].includes(searchForm.from.code) &&
                             ['BOM', 'DEL', 'BLR', 'CCU', 'HYD', 'MAA'].includes(searchForm.to.code);
        
        if (isIndianRoute) {
          results = routeSpecificFaker.generateIndianDomesticSearch(
            searchForm.from.code,
            searchForm.to.code,
            searchForm.departureDate,
            searchForm.tripType === 'roundtrip' ? searchForm.returnDate : null
          );
        } else {
          results = flightSearchFaker.generateFlightSearchResponse(
            searchForm.from.code,
            searchForm.to.code,
            searchForm.departureDate,
            searchForm.tripType === 'roundtrip' ? searchForm.returnDate : null
          );
        }

        // Store search form data for reference
        localStorage.setItem('flightSearchForm', JSON.stringify({
          from: searchForm.from,
          to: searchForm.to,
          departureDate: searchForm.departureDate,
          returnDate: searchForm.returnDate,
          tripType: searchForm.tripType,
          adults: searchForm.adults,
          children: searchForm.children,
          infants: searchForm.infants
        }));

        // Store results in localStorage for the flight list page
        localStorage.setItem('flightSearchResults', JSON.stringify(results));
        
        // Navigate to flight list page
        window.location.href = '/flight/flight-list-v1';
        
      } catch (error) {
        console.error('Search failed:', error);
        alert('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay to show loading state
  };

  return (
    <>
      <div className="row y-gap-20 items-center">
        <FilterSelect />
      </div>
      {/* End .row */}

      <div className="mainSearch -col-5 border-light rounded-4 pr-20 py-20 lg:px-20 lg:pt-5 lg:pb-20 mt-15">
        <div className="button-grid items-center">
          <LocationSearch 
            label="From"
            placeholder="Departure city"
            onLocationSelect={handleFromSelect}
          />
          {/* End Location Flying From */}

          <LocationSearch 
            label="To"
            placeholder="Arrival city"
            onLocationSelect={handleToSelect}
          />
          {/* End Location Flying To */}

          <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
            <div>
              <h4 className="text-15 fw-500 ls-2 lh-16">Depart</h4>
              <DateSearch onDateChange={handleDateChange} />
            </div>
          </div>
          {/* End Depart */}

          <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
            <div>
              <h4 className="text-15 fw-500 ls-2 lh-16">Return</h4>
              <DateSearch onDateChange={handleDateChange} />
            </div>
          </div>
          {/* End Return */}

          <GuestSearch onGuestChange={handleGuestChange} />
          {/* End guest */}

          <div className="button-item">
            <button 
              className="mainSearch__submit button -blue-1 py-15 px-35 h-60 col-12 rounded-4 bg-dark-3 text-white"
              onClick={handleSearch}
              disabled={loading}
            >
              <i className="icon-search text-20 mr-10" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {/* End search button_item */}
        </div>
      </div>
      {/* End .mainSearch */}
    </>
  );
};

export default MainFilterSearchBox;
