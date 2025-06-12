import { useState } from "react";
import "../../../../public/sass/components/guestSearch.scss";

const GuestSearch = () => {
  const [flights, setFlights] = useState([
    { from: "", to: "", date: "", time: "Anytime" },
    { from: "", to: "", date: "", time: "Anytime" },
  ]);
  const [form, setForm] = useState({
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

  const handleFlightChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFlights = [...flights];
    updatedFlights[index][name] = value;
    setFlights(updatedFlights);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFlight = () => {
    setFlights([...flights, { from: "", to: "", date: "", time: "Anytime" }]);
  };

  const removeFlight = () => {
    if (flights.length > 2) {
      setFlights(flights.slice(0, -1));
    }
  };

  return (
    <div className="search-menu-guests">
      <div className="form-container">
        <form className="flight-form">
          {flights.map((flight, index) => (
            <div key={index} className="form-row multi-city-flight-leg-main">
              <input type="text" name="from" placeholder="From" value={flight.from} onChange={(e) => handleFlightChange(index, e)} />
              <input type="text" name="to" placeholder="To" value={flight.to} onChange={(e) => handleFlightChange(index, e)} />
              <input
                type="text"
                name="date"
                placeholder="DD/MM/YYYY"
                value={flight.date}
                onChange={(e) => handleFlightChange(index, e)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = flight.date ? "date" : "text")}
              />
              <select name="time" value={flight.time} onChange={(e) => handleFlightChange(index, e)}>
                <option>Anytime</option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </div>
          ))}

          <div className="form-row multi-city-action-buttons-row">
            <button type="button" className="multi-city-add-button pill" onClick={addFlight}>Add</button>
            <div className="multi-city-action-separator">/</div>
            <button type="button" className="multi-city-remove-button pill" onClick={removeFlight}>Remove</button>
            <div className="multi-city-action-divider" />
          </div>

          <div className="form-row multi-city-passenger-main-row">
            <select name="adult" value={form.adult} onChange={handleFormChange}>
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
            </select>
            <select name="child" value={form.child} onChange={handleFormChange}>
              <option value="0">0 Child</option>
              <option value="1">1 Child</option>
              <option value="2">2 Children</option>
            </select>
            <div className="multi-city-infant-group">
              <select name="lapInfant" value={form.lapInfant} onChange={handleFormChange}>
                <option value="0">0 Lap Infant</option>
                <option value="1">1 Lap Infant</option>
              </select>
              <select name="seatInfant" value={form.seatInfant} onChange={handleFormChange}>
                <option value="0">0 Seat Infant</option>
                <option value="1">1 Seat Infant</option>
              </select>
            </div>
            <select name="cabinClass" value={form.cabinClass} onChange={handleFormChange}>
              <option>All Class Cabin</option>
              <option>Economy</option>
              <option>Business</option>
            </select>
          </div>

          <div className="form-row multi-city-checkbox-airline-main-row">
            <div className="multi-city-checkbox-grid">
              <label className="multi-city-checkbox-item">
                <input type="checkbox" name="flexibleDates" checked={form.flexibleDates} onChange={handleFormChange} /> Flexible dates
              </label>
              <label className="multi-city-checkbox-item">
                <input type="checkbox" name="noPenalties" checked={form.noPenalties} onChange={handleFormChange} /> Fares with no penalties
              </label>
              <label className="multi-city-checkbox-item">
                <input type="checkbox" name="directFlights" checked={form.directFlights} onChange={handleFormChange} /> Direct flights
              </label>
              <label className="multi-city-checkbox-item">
                <input type="checkbox" name="nearbyAirports" checked={form.nearbyAirports} onChange={handleFormChange} /> Nearby airports
              </label>
            </div>
            <input type="text" name="airline1" placeholder="Preferred Airline 1" value={form.airline1} onChange={handleFormChange} />
            <input type="text" name="airline2" placeholder="Preferred Airline 2" value={form.airline2} onChange={handleFormChange} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestSearch;