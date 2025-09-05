import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../../features/auth/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <div className="sidebar -dashboard">
        <div className="sidebar__item ">
          <Link
            to="/admin-dashboard"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500${location.pathname === "/admin-dashboard" ? " active" : ""}`}
          >
            <img
              src="/img/dashboard/sidebar/compass.svg"
              alt="image"
              className="mr-15"
            />
            Dashboard
          </Link>
        </div>
        {/* End accordion__item */}
        <div className="sidebar__item ">
          <Link
            to="/admin-dashboard/all-flights"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500${location.pathname === "/admin-dashboard/all-flights" ? " active" : ""}`}
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            All Flights
          </Link>
        </div>
        {/* End accordion__item */}
        <div className="sidebar__item ">
          <Link
            to="/admin-dashboard/customer-management"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500${location.pathname === "/admin-dashboard/customer-management" ? " active" : ""}`}
          >
            <img
              src="/img/dashboard/sidebar/bookmark.svg"
              alt="image"
              className="mr-15"
            />
            Customer Management
          </Link>
        </div>
        {/* End accordion__item */}
        <div className="sidebar__item ">
          <Link
            to="/admin-dashboard/booking-management"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500${location.pathname === "/admin-dashboard/booking-management" ? " active" : ""}`}
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Booking Management
          </Link>
        </div>
        {/* End accordion__item */}
        
        {/* Logout Button */}
        <div className="sidebar__item ">
          <button
            onClick={handleLogout}
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 text-red-1"
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <img
              src="/img/dashboard/sidebar/log-out.svg"
              alt="image"
              className="mr-15"
            />
            Logout
          </button>
        </div>
        {/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;
