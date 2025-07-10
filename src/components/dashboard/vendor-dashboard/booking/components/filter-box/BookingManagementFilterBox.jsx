import TextSearchBox from "./TextSearchBox";
import DateFieldFilter from "./DateFieldFilter";
import StatusDropdownFilter from "./StatusDropdownFilter";

const BookingManagementFilterBox = ({
  searchValue,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  dateValue,
  onDateChange,
  onResetDate,
  onResetStatus,
  onResetSearch,
  onResetAll,
}) => {
  return (
    <div className="filterbox-grid" style={{ width: '100%' }}>
      <div className="filterbox-row" style={{ display: 'flex', gap: 16, width: '100%' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <DateFieldFilter value={dateValue} onChange={onDateChange} onReset={onResetDate} placeholder="Booking Date" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <StatusDropdownFilter
            options={statusOptions}
            value={statusValue}
            onChange={onStatusChange}
            placeholder="Booking Status"
            onReset={onResetStatus}
          />
        </div>
      </div>
      <div className="filterbox-row" style={{ display: 'flex', gap: 16, width: '100%', marginTop: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <TextSearchBox
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search by Booking ID, PNR Number, Customer Name, Flight Details"
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

export default BookingManagementFilterBox; 