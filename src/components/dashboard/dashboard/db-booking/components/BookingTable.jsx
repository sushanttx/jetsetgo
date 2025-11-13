import { useState, useEffect } from "react";
import Pagination from "../../common/Pagination";
import ActionsButton from "../components/ActionsButton";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { 
  fetchBookingHistory, 
  filterBookingsByPaymentType, 
  formatBookingDate, 
  formatBookingStatus, 
  getStatusBadgeClass, 
  getPaymentTypeDisplayName, 
  getPassengerCount, 
  getPassengerSummary 
} from "../../../../../services/bookingHistoryService";

const BookingTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabItems = [
    "All Booking",
    "Hold Booking",
    "Credit Card",
    // "Check Payment",
  ];

  // Fetch booking history on component mount
  useEffect(() => {
    const loadBookingHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchBookingHistory();
        
        if (result.success) {
          setBookings(result.data.bookings || []);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to load booking history');
        console.error('Error loading booking history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookingHistory();
  }, []);

  // Get filtered bookings based on active tab
  const getFilteredBookings = () => {
    const paymentTypes = ['ALL', 'HOLD', 'CC', 'CK'];
    const currentPaymentType = paymentTypes[activeTab];
    return filterBookingsByPaymentType(bookings, currentPaymentType);
  };

  const filteredBookings = getFilteredBookings();

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancelBooking = (booking) => {
    // TODO: Implement cancel booking functionality
    console.log('Cancel booking:', booking);
    alert('Cancel booking functionality will be implemented');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? "is-tab-el-active" : ""
                }`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
        {/* End tabs */}

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <div className="text-center py-40">
                <div className="text-16 text-light-1">Loading booking history...</div>
              </div>
            ) : error ? (
              <div className="text-center py-40">
                <div className="text-16 text-red-2">Error: {error}</div>
                <button 
                  className="button -md -blue-1 text-white mt-20"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-40">
                <div className="text-16 text-light-1">No bookings found for this payment type.</div>
              </div>
            ) : (
              <div className="overflow-scroll scroll-bar-1" style={{ position: 'relative', zIndex: 1 }}>
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Status</th>
                      {/* <th>Actions</th> */}
                      <th>Booking Type</th>
                      <th>Route</th>
                      <th>Booking Date</th>
                      <th>PNR</th>
                      <th>Passenger(s) Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={booking.id || index}>
                        <td>
                          <span className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${getStatusBadgeClass(booking.bookingStatus)}`}>
                            {formatBookingStatus(booking.bookingStatus)}
                          </span>
                        </td>
                        {/* <td>
                          <ActionsButton 
                            onView={() => handleViewBooking(booking)}
                            onCancel={() => handleCancelBooking(booking)}
                          />
                        </td> */}
                        <td>
                          <span className="text-14 fw-500">
                            {getPaymentTypeDisplayName(booking.paymentDetails?.PaymentType || booking.bookingType)}
                          </span>
                        </td>
                        <td>
                          <div className="text-14 fw-500">
                            {booking.origin} → {booking.destination}
                          </div>
                        </td>
                        <td>
                          <div className="text-14">
                            {formatBookingDate(booking.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div className="text-14 fw-500">
                            {booking.PNR || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div className="text-14">
                            {getPassengerSummary(booking.passengerDetails)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination />
      
      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default BookingTable;
