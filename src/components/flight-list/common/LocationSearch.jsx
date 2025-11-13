import { useState, useEffect } from "react";
import airportsData from "../../../data/airports.json";

const SearchBar = ({ label = "Location", placeholder = "Where are you going?", onLocationSelect }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter airports based on search value
  useEffect(() => {
    if (searchValue.length > 0) {
      const filtered = airportsData.airports.filter(airport => 
        airport.code.toLowerCase().includes(searchValue.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchValue.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 10); // Limit to 10 results
      setFilteredAirports(filtered);
      setShowDropdown(true);
    } else {
      setFilteredAirports([]);
      setShowDropdown(false);
    }
  }, [searchValue]);

  const handleOptionClick = (airport) => {
    setSearchValue(`${airport.city} (${airport.code})`);
    setSelectedItem(airport);
    setShowDropdown(false);
    if (onLocationSelect) {
      onLocationSelect(airport);
    }
  };

  return (
    <>
      <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          <h4 className="text-15 fw-500 ls-2 lh-16">{label}</h4>
          <div className="text-15 text-light-1 ls-2 lh-16">
            <input
              autoComplete="off"
              type="search"
              placeholder={placeholder}
              className="js-search js-dd-focus"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
          </div>
        </div>
        {/* End location Field */}

        {showDropdown && filteredAirports.length > 0 && (
          <div className="shadow-2 dropdown-menu min-width-400">
            <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4">
              <ul className="y-gap-5 js-results">
                {filteredAirports.map((airport) => (
                  <li
                    className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${
                      selectedItem && selectedItem.code === airport.code ? "active" : ""
                    }`}
                    key={airport.code}
                    role="button"
                    onClick={() => handleOptionClick(airport)}
                  >
                    <div className="d-flex">
                      <div className="icon-location-2 text-light-1 text-20 pt-4" />
                      <div className="ml-10">
                        <div className="text-15 lh-12 fw-500 js-search-option-target">
                          {airport.city} ({airport.code})
                        </div>
                        <div className="text-14 lh-12 text-light-1 mt-5">
                          {airport.name}, {airport.country}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
