import React from "react";

const StatusDropdownFilter = ({ options, value, onChange, placeholder, onReset }) => {
  const isDefault = value === undefined || value === null || value === "" || value === options[0];
  return (
    <div className="filterbox-statusdropdown dropdown js-dropdown js-services-active" style={{ width: '100%', position: 'relative' }}>
      <div
        className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-230 text-14 px-20 h-50 text-14 filterbox-input"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        data-bs-offset="0,10"
      >
        <span className="js-dropdown-title">{value || placeholder || options[0]}</span>
        <i className="icon icon-chevron-sm-down text-7 ml-10" />
      </div>
      {!isDefault && (
        <button type="button" className="filterbox-reset-btn" style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} onClick={onReset} title="Reset status">×</button>
      )}
      <div className="toggle-element -dropdown  dropdown-menu">
        <div className="text-14 y-gap-15 js-dropdown-list">
          {options.map((option, index) => (
            <div
              key={index}
              className={`${value === option ? "text-blue-1" : ""} js-dropdown-link`}
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDropdownFilter; 