import React from "react";
import DatePicker from "react-multi-date-picker";

const DateFieldFilter = ({ value, onChange, onReset, placeholder }) => {
  const hasValue = (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value);
  return (
    <div className="filterbox-datefield w-230 single-field relative d-flex items-center" style={{ width: '100%' }}>
      <span className="absolute d-flex items-center h-full" style={{ left: 0, zIndex: 2 }}>
        <i className="icon-calendar text-20 px-15 text-dark-1" />
      </span>
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker date-input bg-white text-dark-1 rounded-8 pl-30"
        value={value}
        onChange={onChange}
        numberOfMonths={1}
        offsetY={10}
        format="YYYY-MM-DD"
        placeholder={placeholder || "Registered On"}
        range
        rangeHover
      />
      {hasValue && (
        <button type="button" className="absolute d-flex items-center h-full filterbox-reset-btn" style={{ right: 0, zIndex: 2 }} onClick={onReset} title="Reset date">×</button>
      )}
    </div>
  );
};

export default DateFieldFilter; 