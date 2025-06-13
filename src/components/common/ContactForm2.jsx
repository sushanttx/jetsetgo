import React from "react";

const ContactForm2 = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission logic here
  };

  return (
    <div className="search-menu-loc">
      <div className="form-container">
        <form className="flight-form" onSubmit={handleSubmit}>
          <div className="form-row1">
            <input type="text" id="name" required placeholder="Full Name" />
            <input type="email" id="email" required placeholder="Email" />
            <input type="text" id="subject" required placeholder="Subject" />
            <input 
              id="message" 
              required 
              rows="4" 
              placeholder="Your Message"
              style={{ width: '100%' }}
            ></input>
          </div>
          <div className="form-row">
            <button
              type="submit"
              className="mainSearch__submit"
            >
              Send Message 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
