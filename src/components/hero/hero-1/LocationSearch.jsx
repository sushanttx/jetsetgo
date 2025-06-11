
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
            <form className="flight-form">
              <div className="rowflight">
                <input type="text" placeholder="From" />
                <input type="text" placeholder="To" />
                <select>
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                </select>
                <select>
                  <option>0 Child</option>
                  <option>1 Child</option>
                  <option>2 Children</option>
                </select>
              </div>

              <div className="rowflight">
                <input type="date" placeholder="DD/MM/YYYY" />
                <select>
                  <option>Anytime</option>
                  <option>Morning</option>
                  <option>Evening</option>
                </select>
                <select>
                  <option>0 Lap Infant</option>
                  <option>1 Lap Infant</option>
                </select>
                <select>
                  <option>0 Seat Infant</option>
                  <option>1 Seat Infant</option>
                </select>
                <select>
                  <option>All Class Cabin</option>
                  <option>Economy</option>
                  <option>Business</option>
                </select>
              </div>

              <div className="rowflight">
                <input type="text" placeholder="Preferred Airline 1" />
                <input type="text" placeholder="Preferred Airline 2" />
                <div className="checkboxes">
                  <label>
                    <input type="checkbox" /> Flexible dates
                  </label>
                  <label>
                    <input type="checkbox" /> Direct flights
                  </label>
                  <label>
                    <input type="checkbox" /> Fares with no penalties
                  </label>
                  <label>
                    <input type="checkbox" /> Nearby airports
                  </label>
                </div>
              </div>

              <div className="rowflight">
                <button type="submit" className="search-btn">
                  Search Flights
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
