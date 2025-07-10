import React from "react";

const TextSearchBox = ({ value, onChange, placeholder, onReset }) => {
  return (
    <form className="filterbox-textsearch single-field relative d-flex items-center" onSubmit={e => e.preventDefault()} style={{ width: '100%' }}>
      <span className="absolute d-flex items-center h-full" style={{ left: 0, zIndex: 2 }}>
        <i className="icon-search text-20 px-15 text-dark-1" />
      </span>
      <input
        className="pl-50 bg-white text-dark-1 h-50 rounded-8 filterbox-input"
        type="text"
        placeholder={placeholder || "Search by Customer ID, Full Name, Email, Phone Number, Number of Bookings, Total Spend"}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%' }}
      />
      {value && (
        <button type="button" className="absolute d-flex items-center h-full filterbox-reset-btn" style={{ right: 0, zIndex: 2 }} onClick={onReset} title="Reset search">×</button>
      )}
    </form>
  );
};

export default TextSearchBox; 