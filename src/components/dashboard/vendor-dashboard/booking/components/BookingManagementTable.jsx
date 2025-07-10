import { useState, useMemo, useEffect } from "react";
import Pagination from "../../common/Pagination";
import BookingManagementFilterBox from "./filter-box/BookingManagementFilterBox";
import { bookingManagementRows } from "../../../../../data/BookingManagementData";

const RECORDS_PER_PAGE = 5;

const statusOptions = ["All Status", "Confirmed", "Cancelled", "Completed", "Pending", "Rescheduled"];

const formatDate = (dateObj) => {
  if (!dateObj) return null;
  if (typeof dateObj === "string") return dateObj;
  if (typeof dateObj.format === "function") return dateObj.format("YYYY-MM-DD");
  if (dateObj instanceof Date) return dateObj.toISOString().slice(0, 10);
  return null;
};

const BookingManagementTable = () => {
  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Use imported data
  const rows = bookingManagementRows;
  console.log(rows);

  // Filtering logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Status filter
      if (status !== "All Status" && row.status !== status) return false;
      // Date filter (dateRange is array of 2 dates or empty)
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        const bookingDate = row.bookingDate;
        const startStr = formatDate(start);
        const endStr = formatDate(end);
        if (startStr && bookingDate < startStr) return false;
        if (endStr && bookingDate > endStr) return false;
      }
      // Search filter (Booking ID, PNR, Customer Name, Flight Details)
      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            row.bookingId.toLowerCase().includes(s) ||
            row.pnr.toLowerCase().includes(s) ||
            row.customerName.toLowerCase().includes(s) ||
            row.flightDetails.toLowerCase().includes(s)
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rows, status, dateRange, search]);

  // If currentPage is out of bounds after filtering, reset to 1 (in useEffect)
  useEffect(() => {
    if ((currentPage - 1) * RECORDS_PER_PAGE >= filteredRows.length) {
      setCurrentPage(1);
    }
  }, [filteredRows.length, currentPage]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / RECORDS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safeCurrentPage - 1) * RECORDS_PER_PAGE,
    safeCurrentPage * RECORDS_PER_PAGE
  );

  // Handlers for reset buttons
  const handleResetDate = () => setDateRange([]);
  const handleResetStatus = () => setStatus("All Status");
  const handleResetSearch = () => setSearch("");
  const handleResetAll = () => {
    setDateRange([]);
    setStatus("All Status");
    setSearch("");
  };

  const statusBadge = {
    Confirmed: "bg-blue-1-05 text-blue-1",
    Cancelled: "bg-red-3 text-red-2",
    Completed: "bg-green-1 text-green-2",
    Pending: "bg-yellow-4 text-yellow-3",
    "On Hold": "bg-yellow-4 text-yellow-3",
    Waitlisted: "bg-orange-1 text-orange-2",
    Rescheduled: "bg-purple-1 text-purple-2",
  };

  return (
    <>
      <BookingManagementFilterBox
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={statusOptions}
        statusValue={status}
        onStatusChange={setStatus}
        dateValue={dateRange}
        onDateChange={setDateRange}
        onResetDate={handleResetDate}
        onResetStatus={handleResetStatus}
        onResetSearch={handleResetSearch}
        onResetAll={handleResetAll}
      />
      <div className="tabs__content pt-30 js-tabs-content">
        <div className="tabs__pane -tab-item-1 is-tab-el-active">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
                <tr>
                  <th></th>
                  <th>Booking ID</th>
                  <th>PNR Number</th>
                  <th>Customer Name</th>
                  <th>Flight Details</th>
                  <th>Booking Status</th>
                  <th>Booking Date</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.bookingId}>
                      <td>
                        <button className="view-btn button px-15 py-5 text-14 bg-blue-1 text-white rounded-4">View</button>
                      </td>
                      <td>{row.bookingId}</td>
                      <td>{row.pnr}</td>
                      <td>{row.customerName}</td>
                      <td>{row.flightDetails}</td>
                      <td>
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${statusBadge[row.status] || "bg-light-2 text-dark-1"}`}
                          style={{ display: 'inline-block', minWidth: 90 }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{row.bookingDate}</td>
                      <td>${row.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default BookingManagementTable; 