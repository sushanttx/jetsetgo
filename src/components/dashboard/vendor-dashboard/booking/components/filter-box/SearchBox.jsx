const SearchBox = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <form className={`w-500 single-field relative d-flex items-center ${className}`} onSubmit={e => e.preventDefault()}>
      <input
        className="pl-50 bg-white text-dark-1 h-50 rounded-8"
        type="text"
        placeholder={placeholder || "Search"}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="submit" className="absolute d-flex items-center h-full">
        <i className="icon-search text-20 px-15 text-dark-1" />
      </button>
    </form>
  );
};

export default SearchBox;
