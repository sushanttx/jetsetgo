import React, { useState } from "react";
import "../../../public/sass/components/contactForm.scss";

const ContactFormMultiCity = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission logic here
    console.log(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row two-columns">
        <div className="form-input">
          <input type="text" id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-input">
          <input type="text" id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row two-columns">
        <div className="form-input">
          <input type="email" id="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="phone-input-group">
          <div className="select-wrapper">
            <select className="country-code" name="countryCode" value={form.countryCode} onChange={handleChange}>
              <option value="+1">+1 (US)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (IN)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+86">+86 (CN)</option>
              <option value="+81">+81 (JP)</option>
              <option value="+49">+49 (DE)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+39">+39 (IT)</option>
              <option value="+34">+34 (ES)</option>
            </select>
          </div>
          <div className="form-input">
            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
          </div>
        </div>
      </div>
      <div className="form-row one-column">
        <div className="form-textarea">
          <textarea id="message" name="message" placeholder="Message" value={form.message} onChange={handleChange} required rows="4"></textarea>
        </div>
        <p>Please provide complete names of all passengers as on the passport if any passenger travelling under 12 years please provide Date of Birth.</p>
      </div>
      <div className="form-row">
        <button type="submit" className="submit-button">
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactFormMultiCity; 