import React, { useState } from "react";
import { Link } from "react-router-dom";
import MetaComponent from "../components/common/MetaComponent";
import "../../public/sass/components/contactForm.scss";
import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";

const Enquiry = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    departureCity: "",
    arrivalCity: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
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
    <>
     
      <MetaComponent
        meta={{
          title: "Flight Enquiry - Flight Booking",
          description: "Submit your flight enquiry and get the best deals",
        }}
      />

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <div className="text-center mb-50">
                <h1 className="text-30 fw-600">Enquiry</h1>
                <p className="text-15 text-light-1 mt-10">
                  Fill out the form below and we'll get back to you with the
                  best flight deals
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row two-columns">
                  <div className="form-input">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row one-column">
                  <div className="form-input">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row one-column">
                  <div className="phone-input-group">
                    <div className="select-wrapper">
                      <select
                        className="country-code"
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                      >
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
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

               

                <div className="form-row one-column">
                  <div className="form-textarea">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Additional Message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div className="form-row">
                  <button type="submit" className="submit-button">
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />


      <DefaultFooter />
    </>
  );
};

export default Enquiry;
