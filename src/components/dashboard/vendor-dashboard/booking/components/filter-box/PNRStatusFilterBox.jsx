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
      <div className="filterbox-row" style={{ display: 'flex', gap: 16, width: '100%' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <DateFieldFilter value={dateValue} onChange={onDateChange} onReset={onResetDate} placeholder="Departure Date" />
        </div>
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
      <div className="filterbox-row" style={{ display: 'flex', gap: 16, width: '100%', marginTop: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <TextSearchBox
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search by PNR Number, Booking ID, Passenger Name, Flight Number"
            onReset={onResetSearch}
          />
        </div>
        <button type="button" className="filterbox-reset-btn filterbox-reset-btn--all" onClick={onResetAll} title="Reset all fields" style={{ marginLeft: 16 }}>
          Reset All
        </button>
      </div>
    </div>
  );
};

export default PNRStatusFilterBox; 