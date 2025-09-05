const TopHeaderFilter = ({ flightCount, sortBy, onSortChange }) => {
  return (
    <>
      <div className="row y-gap-10 items-center justify-between">
        <div className="col-auto">
          <div className="text-18">
            {/* MODIFICATION: Dynamic flight count */}
            <span className="fw-500">{flightCount} flights</span> found
          </div>
        </div>
        {/* End .col */}

        <div className="col-auto">
          <div className="row x-gap-20 y-gap-20">
            <div className="col-auto">
              {/* MODIFICATION: Replaced button with functional select dropdown */}
              <select
                className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
                <option value="duration-asc">Duration (shortest)</option>
              </select>
            </div>
            {/* End .col */}

            <div className="col-auto d-none xl:d-block">
              <button
                data-bs-toggle="offcanvas"
                data-bs-target="#listingSidebar"
                className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
              >
                <i className="icon-up-down text-14 mr-10" />
                Filter
              </button>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}
    </>
  );
};

export default TopHeaderFilter;