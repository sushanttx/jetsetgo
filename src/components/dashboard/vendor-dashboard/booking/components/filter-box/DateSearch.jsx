import React from "react";
import DatePicker from "react-multi-date-picker";

const DateSearch = ({ value, onChange, className = "" }) => {
  return (
    <div className={`w-230 single-field relative d-flex items-center ${className}`}>
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker date-input bg-white text-dark-1 rounded-8 pl-30"
        value={value}
        onChange={onChange}
        numberOfMonths={1}
        offsetY={10}
        range
        rangeHover
        format="MMMM DD"
        placeholder="Date Range"
      />

      <button className="absolute d-flex items-center h-full pointer-events-none">
        <i className="icon-calendar text-20 px-15 text-dark-1" />
      </button>
    </div>
  );
};

export default DateSearch;
