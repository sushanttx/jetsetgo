import TextSearchBox from "./TextSearchBox";
import DateFieldFilter from "./DateFieldFilter";
import StatusDropdownFilter from "./StatusDropdownFilter";

const CustomerManagementFilterBox = ({
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
  rotatingOptions = [],
}) => {
  return (
    <div className="filterbox-grid" style={{ width: '100%' }}>
      {/* Row 1: Date and Status */}
      <div className="filterbox-row filterbox-row-top" style={{ display: 'flex', gap: 16, width: '100%' }}>
        <div className="filterbox-date-col" style={{ flex: 1, minWidth: 0 }}>
          <DateFieldFilter value={dateValue} onChange={onDateChange} onReset={onResetDate} />
        </div>
        <div className="filterbox-status-col" style={{ flex: 1, minWidth: 0 }}>
          <StatusDropdownFilter
            options={statusOptions}
            value={statusValue}
            onChange={onStatusChange}
            placeholder="Account Status"
            onReset={onResetStatus}
          />
        </div>
      </div>
      {/* Row 2: Text Search + Reset All Button */}
      <div className="filterbox-row filterbox-row-search-reset" style={{ display: 'flex', width: '100%', marginTop: 16, alignItems: 'center', flexWrap: 'nowrap' }}>
        <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
          <TextSearchBox
            value={searchValue}
            onChange={onSearchChange}
            onReset={onResetSearch}
            rotatingOptions={rotatingOptions}
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
          .filterbox-status-col {
            width: 100%;
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
      `}</style>
    </div>
  );
};

export default CustomerManagementFilterBox; 