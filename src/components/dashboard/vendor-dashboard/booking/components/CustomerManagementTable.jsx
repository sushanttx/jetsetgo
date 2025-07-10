import { useState, useMemo, useEffect } from "react";
import Pagination from "../../common/Pagination";
import CustomerManagementFilterBox from "./filter-box/CustomerManagementFilterBox";
import { customerManagementRows } from "../../../../../data/CustomerManagementData";

const RECORDS_PER_PAGE = 5;

const statusOptions = ["All Status", "Active", "Deactivated"];

const formatDate = (dateObj) => {
  if (!dateObj) return null;
  if (typeof dateObj === "string") return dateObj;
  if (typeof dateObj.format === "function") return dateObj.format("YYYY-MM-DD");
  if (dateObj instanceof Date) return dateObj.toISOString().slice(0, 10);
  return null;
};

const CustomerManagementTable = () => {
  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Use imported data
  const rows = customerManagementRows;

  // Filtering logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Status filter
      if (status !== "All Status" && row.status !== status) return false;
      // Date filter (dateRange is array of 2 dates or empty)
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        const regDate = row.registeredOn;
        const startStr = formatDate(start);
        const endStr = formatDate(end);
        if (startStr && regDate < startStr) return false;
        if (endStr && regDate > endStr) return false;
      }
      // Search filter (Customer ID, Name, Email, Phone)
      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            row.customerId.toLowerCase().includes(s) ||
            row.fullName.toLowerCase().includes(s) ||
            row.email.toLowerCase().includes(s) ||
            row.phone.toLowerCase().includes(s)
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

  return (
    <>
      <CustomerManagementFilterBox
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
                  <th>Customer ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Number of Bookings</th>
                  <th>Total Spend</th>
                  <th>Account Status</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.customerId}>
                      <td>
                        <button className="view-btn button px-15 py-5 text-14 bg-blue-1 text-white rounded-4">View</button>
                      </td>
                      <td>{row.customerId}</td>
                      <td>{row.fullName}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td>{row.bookings}</td>
                      <td>${row.totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${row.status === "Active" ? "bg-green-1 text-green-2" : "bg-red-3 text-red-2"}`}
                          style={{ display: 'inline-block', minWidth: 90 }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{row.registeredOn}</td>
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

export default CustomerManagementTable; 