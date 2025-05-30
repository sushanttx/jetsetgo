import { useState } from "react";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    adult: 1,
    child: 0,
    lapInfant: 0,
    seatInfant: 0,
    cabinClass: "All Class Cabin",
    airline1: "",
    airline2: "",
    flexibleDates: false,
    directFlights: false,
    noPenalties: false,
    nearbyAirports: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    <>
      <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
        <div data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-offset="0,22">
          <h4 className="text-15 fw-500 ls-2 lh-16">One Way</h4>
          <div className="text-15 text-light-1 ls-2 lh-16">
            <input autoComplete="off" type="search" placeholder="Where are you going?" className="js-search js-dd-focus" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </div>
        </div>
        {/* End location Field */}

        <div className="min-width-800 shadow-2 dropdown-menu w-full ">
          <div className="flight-search-container">
            <div className="flight-search-form">
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-column">
                  <div className="flex items-center space-x-2">
                    <label className="form-label">From</label>
                    <input type="text" placeholder="City or Airport" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Anytime</label>
                    <select className="form-input">
                      <option>Anytime</option>
                      <option>Morning (6AM-12PM)</option>
                      <option>Afternoon (12PM-6PM)</option>
                      <option>Evening (6PM-12AM)</option>
                      <option>Night (12AM-6AM)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Airline 1</label>
                    <input type="text" placeholder="Airline name" className="form-input" />
                  </div>
                </div>

                {/* Middle Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">1 Adult</label>
                    <select className="form-input">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <option key={num} value={num}>
                          {num} Adult{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">All Class Cabin</label>
                    <select className="form-input">
                      <option>All Class Cabin</option>
                      <option>Economy</option>
                      <option>Premium Economy</option>
                      <option>Business</option>
                      <option>First Class</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">0 Child</label>
                    <select className="form-input">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Child{num !== 1 ? "ren" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">To</label>
                    <input type="text" placeholder="City or Airport" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">0 Lap Infant</label>
                    <select className="form-input">
                      {[0, 1, 2].map((num) => (
                        <option key={num} value={num}>
                          {num} Lap Infant{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">0 Seat Infant</label>
                    <select className="form-input">
                      {[0, 1, 2].map((num) => (
                        <option key={num} value={num}>
                          {num} Seat Infant{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Airline 2</label>
                    <input type="text" placeholder="Airline name" className="form-input" />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="checkbox-container">
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Flexible dates</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Fares with no penalties</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Direct flights</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Nearby airports</span>
                </label>
              </div>

              {/* Search Button */}
              <button className="search-button">Search Flights</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
