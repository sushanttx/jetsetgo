import { useState, useEffect, useMemo } from "react";
import Pagination from "../../common/Pagination";
import ActionsButton from "../components/ActionsButton";
import PNRStatusFilterBox from "./filter-box/PNRStatusFilterBox";
import { pnrStatusRows } from "../../../../../data/pnrStatusData";

const RECORDS_PER_PAGE = 5;

const statusOptions = [
  "All Status",
  "Confirmed",
  "Cancelled",
  "Waitlisted",
  "On Hold",
  "Completed",
];

const PNRStatusTable = () => {
  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [airline, setAirline] = useState("All Airlines");
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // For status tabs (if still needed)
  const [currentPage, setCurrentPage] = useState(1);

  // Use imported data
  const rows = pnrStatusRows;

  // Compute unique airline options from data
  const airlineOptions = useMemo(() => {
    const set = new Set(["All Airlines"]);
    rows.forEach((row) => set.add(row.airline));
    return Array.from(set);
  }, [rows]);

  // Filtering logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Status filter
      if (status !== "All Status" && row.status !== status) return false;
      // Airline filter
      if (airline !== "All Airlines" && row.airline !== airline) return false;
      // Date filter (dateRange is array of 2 dates or empty)
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        const depDate = new Date(row.departureDate);
        if (start && depDate < new Date(start)) return false;
        if (end && depDate > new Date(end)) return false;
      }
      // Search filter (PNR, Booking ID, Passenger, Flight Number)
      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            row.pnr.toLowerCase().includes(s) ||
            row.bookingId.toLowerCase().includes(s) ||
            row.passenger.toLowerCase().includes(s) ||
            row.flightNumber.toLowerCase().includes(s)
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rows, status, airline, dateRange, search]);

  // If currentPage is out of bounds after filtering, reset to 1
  useEffect(() => {
    if ((currentPage - 1) * RECORDS_PER_PAGE >= filteredRows.length) {
      setCurrentPage(1);
    }
  }, [filteredRows.length]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRows.length / RECORDS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Status badge color mapping
  const statusBadge = {
    Confirmed: "bg-blue-1-05 text-blue-1",
    Cancelled: "bg-red-3 text-red-2",
    Waitlisted: "bg-orange-1 text-orange-2",
    "On Hold": "bg-yellow-4 text-yellow-3",
    Completed: "bg-green-1 text-green-2",
  };

  const handleResetDate = () => {
    setDateRange([]);
  };

  const handleResetStatus = () => {
    setStatus("All Status");
  };

  const handleResetAirline = () => {
    setAirline("All Airlines");
  };

  const handleResetSearch = () => {
    setSearch("");
  };

  const handleResetAll = () => {
    setDateRange([]);
    setStatus("All Status");
    setAirline("All Airlines");
    setSearch("");
  };

  return (
    <>
      <PNRStatusFilterBox
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={statusOptions}
        statusValue={status}
        onStatusChange={setStatus}
        airlineOptions={airlineOptions}
        airlineValue={airline}
        onAirlineChange={setAirline}
        dateValue={dateRange}
        onDateChange={setDateRange}
        onResetDate={handleResetDate}
        onResetStatus={handleResetStatus}
        onResetAirline={handleResetAirline}
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
                  <th>PNR Number</th>
                  <th>Booking ID</th>
                  <th>Passenger Name</th>
                  <th>Flight Number</th>
                  <th>Departure Date</th>
                  <th>Status</th>
                  <th>Last Updated At</th>
                  <th>Airline</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, idx) => (
                  <tr key={row.pnr + row.bookingId}>
                    <td>
                      <button className="view-btn button px-15 py-5 text-14 bg-blue-1 text-white rounded-4">View</button>
                    </td>
                    <td>{row.pnr}</td>
                    <td>{row.bookingId}</td>
                    <td>{row.passenger}</td>
                    <td>{row.flightNumber}</td>
                    <td>{row.departureDate}</td>
                    <td>
                      <span className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${statusBadge[row.status] || "bg-light-2 text-dark-1"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.lastUpdated}</td>
                    <td>{row.airline}</td>
                    {/* <td>
                      <ActionsButton />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default PNRStatusTable; 