import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import "../../../../public/sass/components/dateSearch.scss";
import { searchFlights } from "../../../services/api";
import { useAutocomplete, filterAirports, filterAirlines, mapCabinClassToCode } from "../../../utils/searchHelpers";

const DateSearch = () => {
  const [form, setForm] = useState({
    from: "", to: "", departureDate: "", returnDate: "", departureTime: "Anytime", returnTime: "Anytime", adult: 1, child: 0, lapInfant: 0, seatInfant: 0, cabinClass: "All Class Cabin", airline1: "", airline2: "", flexibleDates: false, directFlights: false, noPenalties: false, nearbyAirports: false, tripType: "ROUNDTRIP",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIcon, setLoadingIcon] = useState(0);

  // Loading animation effect - cycle through different messages
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingIcon(prev => (prev + 1) % 7); // Cycle through 7 messages
      }, 2000); // Change every 2 seconds for better readability
    } else {
      setLoadingIcon(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  // Array of loading messages
  const loadingMessages = [
    "✈️ Searching the skies for the best flights...",
    "🌍 Checking routes worldwide...",
    "🛫 Preparing your boarding pass...",
    "⏳ Almost ready for takeoff...",
    "🧳 Loading your trip details...",
    "🔍 Scanning airlines for the best fares...",
    "🛬 Landing results shortly..."
  ];

  const { setInput: setFromInput, ...fromLogic } = useAutocomplete(filterAirports, (airport) => {
    setForm((prev) => ({ ...prev, from: airport.code }));
    setFromInput(`${airport.code} - ${airport.city}, ${airport.country}`);
  });

  const { setInput: setToInput, ...toLogic } = useAutocomplete(filterAirports, (airport) => {
    setForm((prev) => ({ ...prev, to: airport.code }));
    setToInput(`${airport.code} - ${airport.city}, ${airport.country}`);
  });

  const { setInput: setAirline1Input, ...airline1Logic } = useAutocomplete(filterAirlines, (airline) => {
    setForm((prev) => ({ ...prev, airline1: airline.code }));
    setAirline1Input(`${airline.code} - ${airline.name}`);
  });

  const { setInput: setAirline2Input, ...airline2Logic } = useAutocomplete(filterAirlines, (airline) => {
    setForm((prev) => ({ ...prev, airline2: airline.code }));
    setAirline2Input(`${airline.code} - ${airline.name}`);
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const clearInput = (fieldName) => {
    // Clear the form state
    setForm(prev => ({ ...prev, [fieldName]: ''}));
    
    // Clear the input display and hide dropdown based on field
    if (fieldName === 'from') {
      setFromInput('');
      fromLogic.setShowDropdown(false);
    } else if (fieldName === 'to') {
      setToInput('');
      toLogic.setShowDropdown(false);
    } else if (fieldName === 'airline1') {
      setAirline1Input('');
      airline1Logic.setShowDropdown(false);
    } else if (fieldName === 'airline2') {
      setAirline2Input('');
      airline2Logic.setShowDropdown(false);
    }
  };
  
  const handleSubmit = async () => {
    setError("");
    const validationErrors = [];
    if (!form.from) validationErrors.push("From");
    if (!form.to) validationErrors.push("To");
    if (!form.departureDate) validationErrors.push("Departure Date");
    if (!form.returnDate) validationErrors.push("Return Date");
    
    // Validate that return date is not prior to departure date
    if (form.departureDate && form.returnDate) {
      const departureDate = new Date(form.departureDate);
      const returnDate = new Date(form.returnDate);
      
      if (returnDate < departureDate) {
        setError("Return date cannot be prior to departure date");
        return;
      }
    }
    
    if (validationErrors.length > 0) {
      setError(`${validationErrors.join(", ")} are required.`);
      return;
    }
    console.log("DateSearch: submit initiated with form state:", form);
    setLoading(true);
    try {
      // No API calls - using faker directly
      const cabinClassCode = mapCabinClassToCode(form.cabinClass);

      // Align payload with LocationSearch, adding returnDate for round trip
      const payload = {
        from: form.from,
        to: form.to,
        date: form.departureDate,
        returnDate: form.returnDate,
        cabinClass: cabinClassCode,
        ip: "127.0.0.1",
        adult: form.adult,
        child: form.child,
        lapInfant: form.lapInfant,
        seatInfant: form.seatInfant,
      };

      console.log("DateSearch: payload being sent:", payload);
      try {
        localStorage.setItem("lastDateSearchPayload", JSON.stringify(payload));
      } catch (_) {}
      // Expose in window for quick inspection if console is cleared on navigation
      if (typeof window !== "undefined") {
        window.__lastDateSearchPayload = payload;
      }

      const response = await searchFlights(payload);
      localStorage.setItem("flightSearchResults", JSON.stringify(response));
      localStorage.setItem("flightSearchForm", JSON.stringify(form));
      navigate("/flight");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-menu-loc">
      <style>
        {`
          .date-picker-input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
            padding: 0;
            margin: 0;
          }
          
          /* DatePicker - Lowest z-index among dropdowns */
          .rmdp-container {
            font-family: inherit;
            z-index: 1000 !important;
            position: relative;
          }
          
          .rmdp-calendar {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000 !important;
            position: relative;
          }
          
          .rmdp-day.rmdp-selected {
            background-color: #007bff;
            color: white;
          }
          
          .rmdp-day.rmdp-today {
            background-color: #e3f2fd;
            color: #007bff;
          }
          
          .rmdp-day.rmdp-disabled {
            color: #ccc;
            background-color: #f5f5f5;
          }
          
          .rmdp-header {
            background-color: #f8f9fa;
            border-bottom: 1px solid #ddd;
          }
          
          .rmdp-arrow {
            border-color: #007bff;
          }
          
          .rmdp-arrow:hover {
            background-color: #e3f2fd;
          }
          
          /* Ensure calendar appears above tabs but below dropdowns */
          .rmdp-panel {
            z-index: 1000 !important;
            position: relative;
          }
          
          .rmdp-wrapper {
            z-index: 1000 !important;
            position: relative;
          }
          
          /* Force consistent z-index for all DatePicker elements */
          .rmdp-container,
          .rmdp-calendar,
          .rmdp-panel,
          .rmdp-wrapper,
          .rmdp-popup {
            z-index: 1000 !important;
            position: relative;
          }
          
          /* Smooth loading text transitions */
          .loading-text {
            transition: all 0.5s ease-in-out;
            opacity: 1;
            transform: translateY(0);
          }
          
          .loading-text.fade {
            opacity: 0;
            transform: translateY(-10px);
          }
          
          /* Loading text container for smooth rotation */
          .loading-text-container {
            perspective: 1000px;
            transform-style: preserve-3d;
            min-height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Keyframe animations for smooth text rotation */
          @keyframes textRotateIn {
            0% {
              opacity: 0;
              transform: translateY(20px) rotateX(90deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotateX(0deg);
            }
          }
          
          @keyframes textRotateOut {
            0% {
              opacity: 1;
              transform: translateY(0) rotateX(0deg);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px) rotateX(-90deg);
            }
          }
          
          /* Apply animations to loading text */
          .loading-text {
            animation: textRotateIn 0.6s ease-out;
            transform-style: preserve-3d;
            backface-visibility: hidden;
          }
          
          /* Base dropdown styles */
          .dropdown-list {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            max-height: 200px;
            overflow-y: auto;
          }
          
          .dropdown-wrapper {
            position: relative;
          }
          
          .dropdown-item {
            position: relative;
          }
          
          /* From/To dropdowns - Highest priority */
          .column-one .dropdown-wrapper:first-child,
          .column-two .dropdown-wrapper:first-child {
            z-index: 10003 !important;
            position: relative;
          }
          
          .column-one .dropdown-wrapper:first-child .dropdown-list,
          .column-two .dropdown-wrapper:first-child .dropdown-list {
            z-index: 10003 !important;
            position: absolute !important;
          }
          
          .column-one .dropdown-wrapper:first-child .dropdown-item,
          .column-two .dropdown-wrapper:first-child .dropdown-item {
            z-index: 10003 !important;
            position: relative;
          }
          
          /* Airline dropdowns - Medium priority */
          .column-one .dropdown-wrapper:last-child,
          .column-two .dropdown-wrapper:last-child {
            z-index: 10002 !important;
            position: relative;
          }
          
          .column-one .dropdown-wrapper:last-child .dropdown-list,
          .column-two .dropdown-wrapper:last-child .dropdown-list {
            z-index: 10002 !important;
            position: absolute !important;
          }
          
          .column-one .dropdown-wrapper:last-child .dropdown-item,
          .column-two .dropdown-wrapper:last-child .dropdown-item {
            z-index: 10002 !important;
            position: relative;
          }
          
          /* Dynamic button width overrides */
          .submit-button {
            width: auto !important;
            min-width: 200px !important;
            max-width: none !important;
            flex-shrink: 0 !important;
            overflow: visible !important;
          }
          
          .submit-button.loading {
            width: auto !important;
            min-width: 300px !important;
          }
          
          /* Override parent container constraints */
          .form-row {
            overflow: visible !important;
          }
          
          .form-row .submit-button {
            flex: 0 0 auto !important;
            width: auto !important;
            max-width: none !important;
          }
        `}
      </style>
      <div className="form-container">
        <form className="flight-form">
          {error && <div style={{ color: 'red', marginBottom: 8, width: '100%', textAlign: 'center' }}>{error}</div>}
          <div className="form-main-columns">
            <div className="column-one">
              <div className="dropdown-wrapper" ref={fromLogic.dropdownRef} style={{ position: 'relative' }}>
                <input 
                type="text" 
                name="from" 
                placeholder="From - Enter City or Airport" 
                value={fromLogic.input} 
                onChange={fromLogic.handleInputChange} 
                onFocus={() => { fromLogic.handleInputChange({ target: { value: fromLogic.input } }); fromLogic.setShowDropdown(true); }} 
                onKeyDown={fromLogic.handleKeyDown} 
                autoComplete="off"/>
                {fromLogic.input && (
                  <button 
                    type="button" 
                    aria-label="Clear from input" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearInput('from');
                    }} 
                    className="clear-button"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#666',
                      zIndex: 10,
                      padding: '4px',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#666';
                    }}
                  >
                    ×
                  </button>
                )}
                {fromLogic.showDropdown && fromLogic.suggestions.length > 0 && (
                   <ul className="dropdown-list">
                    {fromLogic.suggestions.map((airport, index) => (
                      <li key={`from-${airport.code}-${index}`} 
                      className={`dropdown-item ${index === fromLogic.focusedIndex ? "focused" : ""}`} 
                      onClick={() => fromLogic.handleSelectSuggestion(airport)}>
                        <div className="airport-code">{airport.code}</div><div className="airport-details"><div className="airport-name">{airport.name}</div><div className="airport-location">{airport.city}, {airport.country}</div></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="column-row-group">
                <DatePicker
                  value={form.departureDate}
                  onChange={(date) => setForm(prev => ({ ...prev, departureDate: date }))}
                  minDate={new Date()}
                  format="DD/MM/YYYY"
                  placeholder="Departure Date"
                  className="date-picker-input"
                  inputClass="date-picker-input"
                  containerClassName="date-picker-container"
                  portal={true}
                  zIndex={1000}
                />
                <div className="select-wrapper">
                  <select name="departureTime" value={form.departureTime} onChange={handleChange}><option>Anytime</option>
                  <option>Early Morning</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  </select>
                </div>
              </div>
              <div className="dropdown-wrapper" ref={airline1Logic.dropdownRef} style={{ position: 'relative' }}>
                <input type="text" name="airline1" placeholder="Preferred Airline 1" value={airline1Logic.input} onChange={airline1Logic.handleInputChange} onFocus={() => { airline1Logic.handleInputChange({ target: { value: airline1Logic.input } }); airline1Logic.setShowDropdown(true); }} onKeyDown={airline1Logic.handleKeyDown} autoComplete="off" />
                {airline1Logic.input && (
                  <button 
                    type="button" 
                    aria-label="Clear airline 1 input" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearInput('airline1');
                    }} 
                    className="clear-button"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#666',
                      zIndex: 10,
                      padding: '4px',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#666';
                    }}
                  >
                    ×
                  </button>
                )}
                {airline1Logic.showDropdown && airline1Logic.suggestions.length > 0 && (
                   <ul className="dropdown-list">
                    {airline1Logic.suggestions.map((airline, index) => (
                      <li key={`airline1-${airline.code}-${index}`} className={`dropdown-item ${index === airline1Logic.focusedIndex ? "focused" : ""}`} onClick={() => airline1Logic.handleSelectSuggestion(airline)}>
                        <div className="airport-code">{airline.code}</div><div className="airport-details"><div className="airport-name">{airline.name}</div><div className="airport-location">{airline.country}</div></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="column-two">
              <div className="dropdown-wrapper" ref={toLogic.dropdownRef} style={{ position: 'relative' }}>
                <input type="text" name="to" placeholder="To - Enter City or Airport" value={toLogic.input} onChange={toLogic.handleInputChange} onFocus={() => { toLogic.handleInputChange({ target: { value: toLogic.input } }); toLogic.setShowDropdown(true); }} onKeyDown={toLogic.handleKeyDown} autoComplete="off" />
                {toLogic.input && (
                  <button 
                    type="button" 
                    aria-label="Clear to input" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearInput('to');
                    }} 
                    className="clear-button"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#666',
                      zIndex: 10,
                      padding: '4px',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#666';
                    }}
                  >
                    ×
                  </button>
                )}
                {toLogic.showDropdown && toLogic.suggestions.length > 0 && (
                  <ul className="dropdown-list">
                    {toLogic.suggestions.map((airport, index) => (
                      <li key={`to-${airport.code}-${index}`} className={`dropdown-item ${index === toLogic.focusedIndex ? "focused" : ""}`} onClick={() => toLogic.handleSelectSuggestion(airport)}>
                        <div className="airport-code">{airport.code}</div><div className="airport-details"><div className="airport-name">{airport.name}</div><div className="airport-location">{airport.city}, {airport.country}</div></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="column-row-group">
                <DatePicker
                  value={form.returnDate}
                  onChange={(date) => setForm(prev => ({ ...prev, returnDate: date }))}
                  minDate={form.departureDate ? new Date(form.departureDate) : new Date()}
                  format="DD/MM/YYYY"
                  placeholder="Return Date"
                  className="date-picker-input"
                  inputClass="date-picker-input"
                  containerClassName="date-picker-container"
                  portal={true}
                  zIndex={1000}
                />
                <div className="select-wrapper">
                  <select name="returnTime" value={form.returnTime} onChange={handleChange}>
                    <option>Anytime</option>
                    <option>Early Morning</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    </select>
                </div>
              </div>
              <div className="dropdown-wrapper" ref={airline2Logic.dropdownRef} style={{ position: 'relative' }}>
                <input type="text" name="airline2" placeholder="Preferred Airline 2" value={airline2Logic.input} onChange={airline2Logic.handleInputChange} onFocus={() => { airline2Logic.handleInputChange({ target: { value: airline2Logic.input } }); airline2Logic.setShowDropdown(true); }} onKeyDown={airline2Logic.handleKeyDown} autoComplete="off" />
                {airline2Logic.input && (
                  <button 
                    type="button" 
                    aria-label="Clear airline 2 input" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearInput('airline2');
                    }} 
                    className="clear-button"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#666',
                      zIndex: 10,
                      padding: '4px',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f0f0';
                      e.target.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#666';
                    }}
                  >
                    ×
                  </button>
                )}
                {airline2Logic.showDropdown && airline2Logic.suggestions.length > 0 && (
                  <ul className="dropdown-list">
                    {airline2Logic.suggestions.map((airline, index) => (
                      <li key={`airline2-${airline.code}-${index}`} className={`dropdown-item ${index === airline2Logic.focusedIndex ? "focused" : ""}`} onClick={() => airline2Logic.handleSelectSuggestion(airline)}>
                        <div className="airport-code">{airline.code}</div><div className="airport-details"><div className="airport-name">{airline.name}</div><div className="airport-location">{airline.country}</div></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="column-three">
              <div className="column-row-group">
                <div className="select-wrapper"><select name="adult" value={form.adult} onChange={handleChange}>
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="5">5 Adults</option>
                  <option value="6">6 Adults</option>
                  <option value="7">7 Adults</option>
                  <option value="8">8 Adults</option>
                  </select></div>
                <div className="select-wrapper"><select name="child" value={form.child} onChange={handleChange}><option value="0">0 Child</option>
                <option value="1">1 Child</option>
                <option value="2">2 Children</option>
                <option value="3">3 Children</option>
                <option value="4">4 Children</option>
                <option value="5">5 Children</option>
                <option value="6">6 Children</option>
                <option value="7">7 Children</option>
                </select></div>
              </div>
              <div className="select-wrapper"><select name="cabinClass" value={form.cabinClass} onChange={handleChange}><option>All Class Cabin</option>
              <option>Economy/Coach</option>
              <option>Business Class</option>
              <option>First Class</option>
              <option>Premium</option>
              </select></div>
              <div className="column-row-group">
                <div className="select-wrapper"><select name="lapInfant" value={form.lapInfant} onChange={handleChange}>
                  <option value="0">0 Lap Infant</option>
                  <option value="1">1 Lap Infant</option>
                  <option value="2">2 Lap Infant</option>
                  <option value="3">3 Lap Infant</option>
                  <option value="4">4 Lap Infant</option>
                  </select></div>
                <div className="select-wrapper"><select name="seatInfant" value={form.seatInfant} onChange={handleChange}><option value="0">0 Seat Infant</option>
                <option value="1">1 Seat Infant</option>
                <option value="2">2 Seat Infant</option>
                <option value="3">3 Seat Infant</option>
                <option value="4">4 Seat Infant</option>
                </select></div>
              </div>
            </div>
          </div>
          <div className="checkbox-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <label><input type="checkbox" name="flexibleDates" checked={form.flexibleDates} onChange={handleChange} /> Flexible dates</label>
            <label><input type="checkbox" name="noPenalties" checked={form.noPenalties} onChange={handleChange} /> Fares with no penalties</label>
            <label><input type="checkbox" name="directFlights" checked={form.directFlights} onChange={handleChange} /> Direct flights</label>
            <label><input type="checkbox" name="nearbyAirports" checked={form.nearbyAirports} onChange={handleChange} /> Nearby airports</label>
          </div>
          <div className="form-row">
            <div 
              className={`submit-button ${loading ? 'loading' : ''}`}
              onClick={!loading ? handleSubmit : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSubmit();
                }
              }}
              tabIndex={loading ? -1 : 0}
              role="button"
              aria-label="Search Flights"
              style={{ cursor: loading ? 'default' : 'pointer' }}
            >
              {loading ? (
                                  <>
                    <span 
                      key={loadingIcon} 
                      className="text-18 mr-10 loading-text" 
                      style={{ fontFamily: 'monospace', fontSize: '16px' }}
                    >
                      {loadingMessages[loadingIcon]}
                    </span>
                  </>
              ) : (
                "Search Flights"
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateSearch;