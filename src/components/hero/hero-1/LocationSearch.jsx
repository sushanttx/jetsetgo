import { useState } from "react";
import "../../../../public/sass/components/locationSearch.scss";

const LocationSearch = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "Anytime",
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
    <div className="search-menu-loc">
      <div className="form-container">
        <form className="flight-form">
          <div className="form-main-columns">
            <div className="column-one">
              <input type="text" name="from" placeholder="From" value={form.from} onChange={handleChange} />
              <div className="column-row-group">
                <input
                  type="text"
                  name="date"
                  placeholder="DD/MM/YYYY"
                  value={form.date}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = form.date ? "date" : "text")}
                />
                <div className="select-wrapper">
                  <select name="time" value={form.time} onChange={handleChange}>
                    <option>Anytime</option>
                    <option>Morning</option>
                    <option>Evening</option>
                  </select>
                </div>
              </div>
              <input type="text" name="airline1" placeholder="Preferred Airline 1" value={form.airline1} onChange={handleChange} />
            </div>

            <div className="column-two">
              <input type="text" name="to" placeholder="To" value={form.to} onChange={handleChange} />
              <div className="column-row-group">
                <div className="select-wrapper">
                  <select name="lapInfant" value={form.lapInfant} onChange={handleChange}>
                    <option value="0">0 Lap Infant</option>
                    <option value="1">1 Lap Infant</option>
                  </select>
                </div>
                <div className="select-wrapper">
                  <select name="seatInfant" value={form.seatInfant} onChange={handleChange}>
                    <option value="0">0 Seat Infant</option>
                    <option value="1">1 Seat Infant</option>
                  </select>
                </div>
              </div>
              <input type="text" name="airline2" placeholder="Preferred Airline 2" value={form.airline2} onChange={handleChange} />
            </div>

            <div className="column-three">
              <div className="column-row-group">
                <div className="select-wrapper">
                  <select name="adult" value={form.adult} onChange={handleChange}>
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                  </select>
                </div>
                <div className="select-wrapper">
                  <select name="child" value={form.child} onChange={handleChange}>
                    <option value="0">0 Child</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                  </select>
                </div>
              </div>
              <div className="select-wrapper">
                <select name="cabinClass" value={form.cabinClass} onChange={handleChange}>
                  <option>All Class Cabin</option>
                  <option>Economy</option>
                  <option>Business</option>
                </select>
              </div>
              <div className="checkbox-grid">
                <label>
                  <input type="checkbox" name="flexibleDates" checked={form.flexibleDates} onChange={handleChange} /> Flexible dates
                </label>
                <label>
                  <input type="checkbox" name="noPenalties" checked={form.noPenalties} onChange={handleChange} /> Fares with no penalties
                </label>
                <label>
                  <input type="checkbox" name="directFlights" checked={form.directFlights} onChange={handleChange} /> Direct flights
                </label>
                <label>
                  <input type="checkbox" name="nearbyAirports" checked={form.nearbyAirports} onChange={handleChange} /> Nearby airports
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationSearch;