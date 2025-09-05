import React from "react";
import { useState, useEffect } from "react";

const TextSearchBox = ({ value, onChange, placeholder, onReset, rotatingOptions }) => {
  const options = rotatingOptions && rotatingOptions.length > 0
    ? rotatingOptions
    : ["Keyword"];
  const [rotatingIndex, setRotatingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % options.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [options]);

  const dynamicPlaceholder = `Search by ${options[rotatingIndex]}`;

  return (
    <div className="text-search-box" style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={dynamicPlaceholder}
        style={{ width: '100%' }}
      />
      {value && (
        <button
          type="button"
          className="text-search-reset"
          onClick={() => onReset && onReset()}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TextSearchBox; 