import TextSearchBox from "./TextSearchBox";
import DateFieldFilter from "./DateFieldFilter";
import StatusDropdownFilter from "./StatusDropdownFilter";
import DropdownFilter from "./DropdownFilter";

const PNRStatusFilterBox = ({
  searchValue,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  dateValue,
  onDateChange,
  airlineOptions,
  airlineValue,
  onAirlineChange,
  onResetDate,
  onResetStatus,
  onResetSearch,
  onResetAll,
  onResetAirline,
}) => {
  return (
    <div className="filterbox-grid" style={{ width: '100%' }}>
      {/* Row 1: Date, Status, Airline (desktop); Date only (mobile) */}
      <div className="filterbox-row filterbox-row-top" style={{ display: 'flex', gap: 16, width: '100%' }}>
        <div className="filterbox-date-col" style={{ flex: 1, minWidth: 0 }}>
          <DateFieldFilter value={dateValue} onChange={onDateChange} onReset={onResetDate} placeholder="Departure Date" />
        </div>
        <div className="filterbox-status-col" style={{ flex: 1, minWidth: 0 }}>
          <StatusDropdownFilter
            options={statusOptions}
            value={statusValue}
            onChange={onStatusChange}
            placeholder="Status"
            onReset={onResetStatus}
          />
        </div>
        <div className="filterbox-airline-col" style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <DropdownFilter
            options={airlineOptions}
            value={airlineValue}
            onChange={onAirlineChange}
            placeholder="Airline"
            className="filterbox-input"
            onReset={onResetAirline}
          />
        </div>
      </div>
      {/* Row 2: Dropdowns only for mobile */}
      <div className="filterbox-row filterbox-row-dropdowns-mobile" style={{ display: 'none', gap: 16, width: '100%', marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <StatusDropdownFilter
            options={statusOptions}
            value={statusValue}
            onChange={onStatusChange}
            placeholder="Status"
            onReset={onResetStatus}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <DropdownFilter
            options={airlineOptions}
            value={airlineValue}
            onChange={onAirlineChange}
            placeholder="Airline"
            className="filterbox-input"
            onReset={onResetAirline}
          />
        </div>
      </div>
      {/* Row 3: Text Search + Reset All Button */}
      <div className="filterbox-row filterbox-row-search-reset" style={{ display: 'flex', gap: 12, width: '100%', marginTop: 12, alignItems: 'center', flexWrap: 'nowrap' }}>
        <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
          <TextSearchBox
            value={searchValue}
            onChange={onSearchChange}
            onReset={onResetSearch}
            rotatingOptions={["PNR Number", "Booking ID", "Passenger Name", "Flight Number"]}
          />
        </div>
        <button
          type="button"
          className="filterbox-reset-btn filterbox-reset-btn--all"
          onClick={onResetAll}
          title="Reset all fields"
          style={{
            whiteSpace: 'nowrap',
            flex: '0 0 auto',
            minWidth: 100,
            maxWidth: 140,
            marginLeft: 0
          }}
        >
          Reset All
        </button>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .filterbox-row-top {
            flex-direction: column !important;
            gap: 0 !important;
          }
          .filterbox-date-col {
            width: 100%;
            margin-bottom: 12px;
          }
          .filterbox-status-col,
          .filterbox-airline-col {
            display: none !important;
          }
          .filterbox-row-dropdowns-mobile {
            display: flex !important;
            flex-direction: row !important;
            gap: 12px !important;
          }
          .filterbox-row-search-reset {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .filterbox-reset-btn--all {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            margin-top: 8px !important;
            margin-left: 0 !important;
            display: block !important;
          }
        }
        @media (min-width: 601px) {
          .filterbox-row-dropdowns-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PNRStatusFilterBox; 