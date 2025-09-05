import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth/authSlice";
import MainMenu from "../MainMenu";
import MobileMenu, { AdminMobileMenu } from "../MobileMenu";

const HeaderDashBoard = () => {
  const [navbar, setNavbar] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        className={`header -dashboard ${navbar ? "is-sticky bg-white" : ""}`}
      >
        <div className="header__container px-30 sm:px-20" style={{position: 'relative'}}>
          <div className="-left-side">
            <Link to="/" className="header-logo">
              <img src="/img/general/logo-dark.svg" alt="logo icon" />
            </Link>
            {/* End logo */}
          </div>
          {/* End _left-side */}

          <div className="row justify-between items-center pl-60 lg:pl-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                {/* Sidebar toggle button removed */}
                {/* <div className="single-field relative d-flex items-center md:d-none ml-30">
                  <input
                    className="pl-50 border-light text-dark-1 h-50 rounded-8"
                    type="email"
                    placeholder="Search"
                  />
                  <button className="absolute d-flex items-center h-full">
                    <i className="icon-search text-20 px-15 text-dark-1"></i>
                  </button>
                </div> */}
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="header-menu">
                  <div className="header-menu__content">
                    {/* <MainMenu style="text-dark-1" /> */}
                  </div>
                </div>
                {/* End header-menu */}

                <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-email-2 text-20"></i>
                    </button>
                  </div>
                  {/* End col-auto */}

                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-notification text-20"></i>
                    </button>
                  </div>
                  {/* End col-auto */}
                </div>
                {/* End .row */}

                {/* User Dropdown */}
                <div className="pl-15 user-dropdown-container" style={{ position: 'relative' }}>
                  <div 
                    className="d-flex items-center cursor-pointer"
                    onClick={toggleUserDropdown}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src="/img/avatars/3.png"
                      alt="user avatar"
                      className="size-50 rounded-22 object-cover"
                    />
                    <div className="ml-10 d-none md:d-block">
                      <div className="text-14 fw-500 text-dark-1">
                        {user?.name || user?.email || 'User'}
                      </div>
                      <div className="text-12 text-light-1">
                        {user?.role || 'Guest'}
                      </div>
                    </div>
                    <i className="icon-chevron-down text-12 ml-5"></i>
                  </div>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="user-dropdown absolute top-100 right-0 mt-10 bg-white rounded-8 shadow-3 border-light py-10 min-w-200 z-50">
                      <div className="px-20 py-15 border-bottom-light">
                        <div className="text-14 fw-500 text-dark-1">
                          {user?.name || 'User'}
                        </div>
                        <div className="text-12 text-light-1">
                          {user?.email}
                        </div>
                        <div className="text-12 text-blue-1 mt-5">
                          Role: {user?.role}
                        </div>
                      </div>
                      
                      <div className="px-20 py-10">
                        <div className="text-12 text-light-1 mb-10">
                          <strong>User ID:</strong> {user?.id}
                        </div>
                        <div className="text-12 text-light-1 mb-10">
                          <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </div>
                      </div>

                      <div className="border-top-light">
                        <button
                          onClick={handleLogout}
                          className="w-100 text-left px-20 py-10 text-14 text-red-1 hover:bg-light-2 transition-all"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <i className="icon-log-out mr-10"></i>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-none xl:d-flex x-gap-20 items-center pl-20">
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    ></button>
                  </div>

                  <div
                    className="offcanvas offcanvas-start  mobile_menu-contnet "
                    tabIndex="-1"
                    id="mobile-sidebar_menu"
                    aria-labelledby="offcanvasMenuLabel"
                    data-bs-scroll="true"
                  >
                    <AdminMobileMenu />
                    {/* End MobileMenu */}
                  </div>
                </div>
              </div>
              {/* End -flex items-center */}
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End header */}
    </>
  );
};

export default HeaderDashBoard;
