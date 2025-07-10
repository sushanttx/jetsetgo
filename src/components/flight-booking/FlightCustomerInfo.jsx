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

const FlightCustomerInfo = ({ flight, formData, segment, personalDetails, setPersonalDetails, passengers, setPassengers, currentPassenger, setCurrentPassenger }) => {
  const [datePickerFocused, setDatePickerFocused] = useState(false);
  const [datePickerFocusedArr, setDatePickerFocusedArr] = useState([]); // for mapped passengers
  const [genderSelectFocused, setGenderSelectFocused] = useState(false);
  const [seatSelectFocused, setSeatSelectFocused] = useState(false);
  const [genderSelectFocusedArr, setGenderSelectFocusedArr] = useState([]);
  const [seatSelectFocusedArr, setSeatSelectFocusedArr] = useState([]);

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
    const hasData = Object.values(currentPassenger).some((v) => v && v.trim() !== "");
    if (!hasData) return;
    setPassengers((prev) => [currentPassenger, ...prev]);
    setCurrentPassenger(emptyPassenger);
  };

  return (
    <>
      <div className="col-xl-7 col-lg-8 mt-30">
        <div className="py-15 px-20 rounded-4 text-15 bg-blue-1-05">
          Sign in to book with your saved details or{" "}
          <Link to="/signup" className="text-blue-1 fw-500">
            register
          </Link>{" "}
          to manage your bookings on the go!
        </div>
        {/* End register notify */}

        <div className="row y-gap-20 items-center justify-between mt-40 md:mt-24">
          <div className="col-auto">
            <h2 className="text-22 fw-500">
              Passenger Details
            </h2>
            <div className="text-16 text-light-1 mt-4">Let us know who you are</div>
          </div>
          <div className="col-auto">
            <button
              className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
              style={{ marginTop: 0 }}
              onClick={handleAddPassenger}
              type="button"
            >
              Add Passenger
            </button>
          </div>
        </div>

        {/* Current (new) passenger form */}
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
              <label className="lh-1 text-16 text-light-1">Full Name</label>
            </div>
          </div>
          {/* End col-12 */}

          <div className="col-md-6">
            <div className={`form-input${genderSelectFocused || Boolean(currentPassenger.gender) ? " active" : ""}`}> 
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
              <label className="lh-1 text-16 text-light-1">Gender</label>
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
                onOpen={() => setDatePickerFocused(true)}
                onClose={() => setDatePickerFocused(false)}
              />
              <label className="lh-1 text-16 text-light-1">Date of Birth</label>
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
              <label className="lh-1 text-16 text-light-1">Email</label>
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
              <label className="lh-1 text-16 text-light-1">Nationality</label>
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
              <label className="lh-1 text-16 text-light-1">Mobile Number</label>
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
              <select 
                name="seatPreference" 
                value={currentPassenger.seatPreference} 
                onChange={handleChange}
                className="gender-select"
                onFocus={() => setSeatSelectFocused(true)}
                onBlur={() => setSeatSelectFocused(false)}
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
                Address line 1
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
                State/Province/Region
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
                ZIP code/Postal code
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

        {/* Render added passengers */}
        {passengers.map((passenger, idx) => (
          <div key={idx} className="mt-40">
            <div className="text-18 fw-600 mb-10">Passenger number {passengers.length - idx}</div>
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
                    onOpen={() => setDatePickerFocusedArr(arr => { const copy = [...arr]; copy[idx] = true; return copy; })}
                    onClose={() => setDatePickerFocusedArr(arr => { const copy = [...arr]; copy[idx] = false; return copy; })}
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
        ))}
      </div>
      {/* End .col-xl-7 */}

      <div className="col-xl-5 col-lg-4 mt-30">
        <div className="booking-sidebar">
          <FlightBookingDetails flight={flight} formData={formData} segment={segment} />
        </div>
      </div>
      {/*  */}
    </>
  );
};

export default FlightCustomerInfo; 