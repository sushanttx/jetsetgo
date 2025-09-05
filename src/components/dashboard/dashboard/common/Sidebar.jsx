import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../../features/auth/authSlice";
import { isActiveLink } from "@/utils/linkActiveChecker";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem("flightSearchResults");
      localStorage.removeItem("flightSearchForm");
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarContent = [
    {
      id: 1,
      icon: "/img/dashboard/sidebar/compass.svg",
      name: "Dashboard",
      routePath: "/dashboard/db-dashboard",
    },
    {
      id: 2,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: " Booking History",
      routePath: "/dashboard/db-booking",
    },
    {
      id: 3,
      icon: "/img/dashboard/sidebar/bookmark.svg",
      name: "Wishlist",
      routePath: "/dashboard/db-wishlist",
    },
    {
      id: 4,
      icon: "/img/dashboard/sidebar/gear.svg",
      name: " Settings",
      routePath: "/dashboard/db-settings",
    },
  ];
  
  return (
    <div className="sidebar -dashboard">
      {sidebarContent.map((item) => (
        <div className="sidebar__item" key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, pathname) ? "-is-active" : ""
            } sidebar__button `}
          >
            <Link
              to={item.routePath}
              className="d-flex items-center text-15 lh-1 fw-500"
            >
              <img src={item.icon} alt="image" className="mr-15" />
              {item.name}
            </Link>
          </div>
        </div>
      ))}
      
      {/* Logout Button */}
      <div className="sidebar__item">
        <div className="sidebar__button">
          <button
            onClick={handleLogout}
            className="d-flex items-center text-15 lh-1 fw-500 text-red-1"
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <img src="/img/dashboard/sidebar/log-out.svg" alt="image" className="mr-15" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
