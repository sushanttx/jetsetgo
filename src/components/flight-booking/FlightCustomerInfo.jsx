import { Link } from "react-router-dom";
import FlightBookingDetails from "./FlightBookingDetails";
import { useState } from "react";
import "../../../public/sass/components/FlightCustomerInfo.scss";
import DatePicker from "react-multi-date-picker";

const emptyPassenger = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  state: "",
  zip: "",
  specialRequests: "",
  gender: "",
  dateOfBirth: "",
  passportNumber: "",
  nationality: "",
  seatPreference: "",
  mobileNumber: "",
  alternateNumber: ""
};

const FlightCustomerInfo = ({ flight, searchData, personalDetails, setPersonalDetails, passengers, setPassengers, currentPassenger, setCurrentPassenger, onNextStep }) => {
  const [datePickerFocused, setDatePickerFocused] = useState(false);
  const [datePickerFocusedArr, setDatePickerFocusedArr] = useState([]); // for mapped passengers
  const [genderSelectFocused, setGenderSelectFocused] = useState(false);
  const [seatSelectFocused, setSeatSelectFocused] = useState(false);
  const [genderSelectFocusedArr, setGenderSelectFocusedArr] = useState([]);
  const [seatSelectFocusedArr, setSeatSelectFocusedArr] = useState([]);

  const totalPassengersAllowed = 
  (parseInt(searchData?.adult) || 0) + 
  (parseInt(searchData?.child) || 0) + 
  (parseInt(searchData?.seatInfant) || 0);

  // Calculate passenger type and number for display
  const getPassengerTypeAndNumber = (passengerIndex) => {
    const adultCount = parseInt(searchData?.adult) || 0;
    const childCount = parseInt(searchData?.child) || 0;
    const infantCount = parseInt(searchData?.seatInfant) || 0;
    
    if (passengerIndex < adultCount) {
      return `Adult Passenger ${passengerIndex + 1}`;
    } else if (passengerIndex < adultCount + childCount) {
      return `Child Passenger ${passengerIndex - adultCount + 1}`;
    } else {
      return `Infant Passenger ${passengerIndex - adultCount - childCount + 1}`;
    }
  };

  // Get passenger type (adult, child, infant) based on index
  const getPassengerType = (passengerIndex) => {
    const adultCount = parseInt(searchData?.adult) || 0;
    const childCount = parseInt(searchData?.child) || 0;
    
    if (passengerIndex < adultCount) {
      return 'adult';
    } else if (passengerIndex < adultCount + childCount) {
      return 'child';
    } else {
      return 'infant';
    }
  };

  // Calculate date restrictions based on passenger type
  const getDateRestrictions = (passengerType) => {
    const today = new Date();
    
    switch (passengerType) {
      case 'adult':
        // 12 years and above
        const adultMaxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
        return {
          maxDate: adultMaxDate,
          defaultDate: adultMaxDate
        };
      case 'child':
        // 2 years to 11 years old (from 2nd birthday up to day before 12th birthday)
        const childMinDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate() + 1);
        const childMaxDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
        return {
          minDate: childMinDate,
          maxDate: childMaxDate,
          defaultDate: childMaxDate
        };
      case 'infant':
        // 0 to 1 year (under 2 years old)
        const infantMinDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate() + 1);
        const infantMaxDate = today;
        return {
          minDate: infantMinDate,
          maxDate: infantMaxDate,
          defaultDate: infantMaxDate
        };
      default:
        return {
          maxDate: today,
          defaultDate: today
        };
    }
  };

  // Get default date for passenger type
  const getDefaultDateForPassenger = (passengerType) => {
    const restrictions = getDateRestrictions(passengerType);
    return restrictions.defaultDate;
  };

  // Handle date picker open for current passenger
  const handleDatePickerOpen = () => {
    setDatePickerFocused(true);
    // If no date is set, set the default date based on passenger type
    if (!currentPassenger.dateOfBirth) {
      const passengerType = getPassengerType(passengers.length);
      const defaultDate = getDefaultDateForPassenger(passengerType);
      const formattedDate = defaultDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      handleChange({ target: { name: "dateOfBirth", value: formattedDate } });
    }
  };

  // Handle date picker open for existing passengers
  const handleDatePickerOpenForPassenger = (idx) => {
    setDatePickerFocusedArr(arr => { const copy = [...arr]; copy[idx] = true; return copy; });
    // If no date is set, set the default date based on passenger type
    if (!passengers[idx].dateOfBirth) {
      const passengerType = getPassengerType(idx);
      const defaultDate = getDefaultDateForPassenger(passengerType);
      const formattedDate = defaultDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      handleChange({ target: { name: "dateOfBirth", value: formattedDate } }, idx);
    }
  };

  // Check if all passengers are complete
  const areAllPassengersComplete = () => {
    if (passengers.length !== totalPassengersAllowed) {
      return false;
    }
    
    return passengers.every(passenger => {
      const requiredFields = ['fullName', 'email', 'gender', 'dateOfBirth', 'nationality', 'mobileNumber', 'address1', 'state', 'zip', 'seatPreference'];
      return requiredFields.every(field => passenger[field] && passenger[field].trim() !== '');
    });
  };


  const handleChange = (e, idx = null) => {
    const { name, value } = e.target;
    if (idx === null) {
      setCurrentPassenger((prev) => ({ ...prev, [name]: value }));
    } else {
      setPassengers((prev) => prev.map((p, i) => i === idx ? { ...p, [name]: value } : p));
    }
  };

  const handleAddPassenger = () => {
    // Only add if at least one field is filled
    if (passengers.length >= totalPassengersAllowed) {
      alert(`You can only add a maximum of ${totalPassengersAllowed} passengers.`);
      return;
    }
    const hasData = Object.values(currentPassenger).some((v) => v && v.trim() !== "");
    if (!hasData) return;
    setPassengers((prev) => [...prev, currentPassenger]);
    setCurrentPassenger(emptyPassenger);
  };

  return (
    <>
      <div className="col-xl-7 col-lg-8 mt-30">
        {/* <div className="py-15 px-20 rounded-4 text-15 bg-blue-1-05">
          Sign in to book with your saved details or{" "}
          <Link to="/signup" className="text-blue-1 fw-500">
            register
          </Link>{" "}
          to manage your bookings on the go!
        </div> */}
        {/* End register notify */}

        <div className="row y-gap-20 items-center justify-between mt-40 md:mt-24">
          <div className="col-auto">
            <h2 className="text-22 fw-500">
              Passenger Details
            </h2>
            {totalPassengersAllowed > 0 && (
              <div className="text-16 text-light-1 mt-4">
                Please add details for all <b>{totalPassengersAllowed}</b> passengers: 
                <b> {parseInt(searchData?.adult) || 0} Adult(s)</b>
                {(parseInt(searchData?.child) || 0) > 0 && <span>, <b>{parseInt(searchData?.child) || 0} Child(ren)</b></span>}
                {(parseInt(searchData?.seatInfant) || 0) > 0 && <span>, <b>{parseInt(searchData?.seatInfant) || 0} Infant(s)</b></span>}.
                <br />You have added <b>{passengers.length}</b> so far.
                {passengers.length === totalPassengersAllowed && (
                  <div className="text-14 mt-2">
                    ✅ All passengers added! Please proceed.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="col-auto d-flex items-center" style={{ gap: '16px' }}>
            <button
              className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
              style={{ marginTop: 0 }}
              onClick={handleAddPassenger}
              type="button"
              disabled={passengers.length >= totalPassengersAllowed}
            >
              Add Passenger
            </button>
            {areAllPassengersComplete() && (
              <button
                className="button h-60 px-30 fw-600"
                style={{ 
                  marginTop: 0,
                  background: 'transparent',
                  border: '2px solid #3b82f6',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#3b82f6';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#3b82f6';
                }}
                onClick={() => {
                  console.log('Next button clicked - all passengers complete');
                  if (onNextStep) {
                    onNextStep();
                  }
                }}
                type="button"
              >
                Next Step
              </button>
            )}
          </div>
          
        </div>

        {/* Current (new) passenger form */}
        {/* This section also remains exactly the same */}
        {passengers.length< totalPassengersAllowed && (
          <div className="row x-gap-20 y-gap-20 pt-20 border-top-light mt-30">
            <h3 className="text-18 fw-500">Enter Details for {getPassengerTypeAndNumber(passengers.length)}</h3>
            <div className="row x-gap-20 y-gap-20 pt-20">
              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="fullName" 
                    value={currentPassenger.fullName} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Full Name<span style={{ color: "red" }}>*</span></label>
                </div>
              </div>
              {/* End col-12 */}


              <div className="col-md-6">
                <div className={`form-input${genderSelectFocused || Boolean(currentPassenger.gender) ? " active" : ""}`}>
                  <label className="gender-label">Gender<span style={{ color: "red" }}>*</span></label>
                  <select
                    name="gender"
                    value={currentPassenger.gender}
                    onChange={handleChange}
                    required
                    className="gender-select"
                    onFocus={() => setGenderSelectFocused(true)}
                    onBlur={() => setGenderSelectFocused(false)}
                  >
                    <option value="" disabled hidden></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>


              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className={`form-input date-picker-field${datePickerFocused || currentPassenger.dateOfBirth ? " active" : ""}`}>
                  <DatePicker
                    value={currentPassenger.dateOfBirth || ""}
                    onChange={date => handleChange({ target: { name: "dateOfBirth", value: date ? date.format("YYYY-MM-DD") : "" } })}
                    format="YYYY-MM-DD"
                    placeholder=" "
                    inputClass="custom_input-picker"
                    containerClassName="custom_container-picker date-input bg-white text-dark-1 rounded-8"
                    style={{ width: "100%" }}
                    onOpen={handleDatePickerOpen}
                    onClose={() => setDatePickerFocused(false)}
                    {...getDateRestrictions(getPassengerType(passengers.length))}
                    disableDayPicker={false}
                  />
                  <label className="lh-1 text-16 text-light-1">Date of Birth<span style={{ color: "red" }}>*</span></label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="email" 
                    value={currentPassenger.email} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Email<span style={{ color: "red" }}>*</span></label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="nationality" 
                    value={currentPassenger.nationality} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Nationality<span style={{ color: "red" }}>*</span></label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="mobileNumber" 
                    value={currentPassenger.mobileNumber} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Mobile Number<span style={{ color: "red" }}>*</span></label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="alternateNumber" 
                    value={currentPassenger.alternateNumber} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Alternate Number (Optional)</label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="passportNumber" 
                    value={currentPassenger.passportNumber} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Passport Number (if required)</label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className={`form-input${seatSelectFocused || Boolean(currentPassenger.seatPreference) ? " active" : ""}`}>
                  <label className="seat-label">Seat Preference<span style={{ color: "red" }}>*</span></label>
                  <select
                    name="seatPreference"
                    value={currentPassenger.seatPreference}
                    onChange={handleChange}
                    className="gender-select"
                    onFocus={() => setSeatSelectFocused(true)}
                    onBlur={() => setSeatSelectFocused(false)}
                    required
                  >
                    <option value="" disabled hidden></option>
                    <option value="window">Window</option>
                    <option value="aisle">Aisle</option>
                    <option value="middle">Middle</option>
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="address1" 
                    value={currentPassenger.address1} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Address line 1<span style={{ color: "red" }}>*</span>
                  </label>
                </div>
              </div>
              {/* End col-12 */}

              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="address2" 
                    value={currentPassenger.address2} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Address line 2
                  </label>
                </div>
              </div>
              {/* End col-12 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="state" 
                    value={currentPassenger.state} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">
                    State/Province/Region<span style={{ color: "red" }}>*</span>
                  </label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="zip" 
                    value={currentPassenger.zip} 
                    onChange={handleChange} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">
                    ZIP code/Postal code<span style={{ color: "red" }}>*</span>
                  </label>
                </div>
              </div>
              {/* End col-md-6 */}

              <div className="col-12">
                <div className="form-input ">
                  <textarea 
                    name="specialRequests" 
                    value={currentPassenger.specialRequests} 
                    onChange={handleChange} 
                    rows={6} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Special Requests
                  </label>
                </div>
              </div>
              {/* End col-12 */}

              <div className="col-auto">
                <button
                  className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
                  style={{ marginTop: 0 }}
                  onClick={handleAddPassenger}
                  type="button"
                  disabled={passengers.length >= totalPassengersAllowed}
                >
                  Add Passenger
                </button>
              </div>
              <div className="col-12">
                <div className="row y-gap-20 items-center justify-between">
                  <div className="col-auto">
                    <div className="text-14 text-light-1">
                      By proceeding with this booking, I agree to GoTrip Terms of
                      Use and Privacy Policy.
                    </div>
                  </div>
                  {/* End col-12 */}
                </div>
              </div>
              {/* End col-12 */}
            </div>
            {/* End .row */}
            </div>
        )}

        {/* Render added passengers */}
        {passengers.map((passenger, idx) => {
          const requiredFields = ['fullName', 'email', 'gender', 'dateOfBirth', 'nationality', 'mobileNumber', 'address1', 'state', 'zip', 'seatPreference'];
          const missingFields = requiredFields.filter(field => !passenger[field] || passenger[field].trim() === '');
          const isComplete = missingFields.length === 0;
          
          return (
          <div key={idx} className="mt-40">
            <div className="text-18 fw-600 mb-10">
              {getPassengerTypeAndNumber(idx)}
              {isComplete ? (
                <span className="text-14 text-green-1 ml-10">✅ Complete</span>
              ) : (
                <span className="text-14 text-orange-1 ml-10">
                  ⚠️ Missing: {missingFields.join(', ')}
                </span>
              )}
            </div>
            <div className="row x-gap-20 y-gap-20">
              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="fullName" 
                    value={passenger.fullName} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Full Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`form-input${genderSelectFocusedArr[idx] || Boolean(passenger.gender) ? " active" : ""}`}> 
                  <select 
                    name="gender" 
                    value={passenger.gender} 
                    onChange={e => handleChange(e, idx)} 
                    required
                    className="gender-select"
                    onFocus={() => setGenderSelectFocusedArr(arr => { const copy = [...arr]; copy[idx] = true; return copy; })}
                    onBlur={() => setGenderSelectFocusedArr(arr => { const copy = [...arr]; copy[idx] = false; return copy; })}
                  >
                    <option value="" disabled hidden></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <label className="lh-1 text-16 text-light-1">Gender</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`form-input date-picker-field${datePickerFocusedArr[idx] || passenger.dateOfBirth ? " active" : ""}`}>
                  <DatePicker
                    value={passenger.dateOfBirth || ""}
                    onChange={date => handleChange({ target: { name: "dateOfBirth", value: date ? date.format("YYYY-MM-DD") : "" } }, idx)}
                    format="YYYY-MM-DD"
                    placeholder=" "
                    inputClass="custom_input-picker"
                    containerClassName="custom_container-picker date-input bg-white text-dark-1 rounded-8"
                    style={{ width: "100%" }}
                    onOpen={() => handleDatePickerOpenForPassenger(idx)}
                    onClose={() => setDatePickerFocusedArr(arr => { const copy = [...arr]; copy[idx] = false; return copy; })}
                    {...getDateRestrictions(getPassengerType(idx))}
                    disableDayPicker={false}
                  />
                  <label className="lh-1 text-16 text-light-1">Date of Birth</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="email" 
                    value={passenger.email} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Email</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="nationality" 
                    value={passenger.nationality} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Nationality</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="mobileNumber" 
                    value={passenger.mobileNumber} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Mobile Number</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="alternateNumber" 
                    value={passenger.alternateNumber} 
                    onChange={e => handleChange(e, idx)} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Alternate Number (Optional)</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="passportNumber" 
                    value={passenger.passportNumber} 
                    onChange={e => handleChange(e, idx)} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Passport Number (if required)</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`form-input${seatSelectFocusedArr[idx] || Boolean(passenger.seatPreference) ? " active" : ""}`}> 
                  <select 
                    name="seatPreference" 
                    value={passenger.seatPreference} 
                    onChange={e => handleChange(e, idx)}
                    className="gender-select"
                    onFocus={() => setSeatSelectFocusedArr(arr => { const copy = [...arr]; copy[idx] = true; return copy; })}
                    onBlur={() => setSeatSelectFocusedArr(arr => { const copy = [...arr]; copy[idx] = false; return copy; })}
                  >
                    <option value="" disabled hidden></option>
                    <option value="window">Window</option>
                    <option value="aisle">Aisle</option>
                    <option value="middle">Middle</option>
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                  <label className="lh-1 text-16 text-light-1">Seat Preference</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="address1" 
                    value={passenger.address1} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Address line 1</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="address2" 
                    value={passenger.address2} 
                    onChange={e => handleChange(e, idx)} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Address line 2</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="state" 
                    value={passenger.state} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">State/Province/Region</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input 
                    type="text" 
                    name="zip" 
                    value={passenger.zip} 
                    onChange={e => handleChange(e, idx)} 
                    required 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">ZIP code/Postal code</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input ">
                  <textarea 
                    name="specialRequests" 
                    value={passenger.specialRequests} 
                    onChange={e => handleChange(e, idx)} 
                    rows={6} 
                    placeholder=" "
                  />
                  <label className="lh-1 text-16 text-light-1">Special Requests</label>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      {/* End .col-xl-7 */}

      <div className="col-xl-5 col-lg-4 mt-30">
        <div className="booking-sidebar">
          <FlightBookingDetails flight={flight} searchData={searchData} passengers={passengers} />
        </div>
      </div>
      {/* End .col-xl-5 */}
    </>
  );
};

export default FlightCustomerInfo; 