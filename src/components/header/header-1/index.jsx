import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPhone, FiMail, FiType } from "react-icons/fi";
import MainMenu from "../MainMenu";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import LanguageMegaMenu from "../LanguageMegaMenu";
import MobileMenu from "../MobileMenu";
import { useSelector } from "react-redux"; 

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`header ${navbar ? "bg-dark-1 is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-5">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link to="/" className="header-logo ">
                  <img src="/img/general/birb.png" alt="logo icon" />
                  <img src="/img/general/birb.png" alt="logo icon" />
                </Link>

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xxl:d-none gap">
                  {/* <div className="col-auto">
                    {isAuthenticated && user ? (
                      // If user is LOGGED IN
                      user.role === "admin" || user.role === "superadmin" ? (
                        <Link
                          to="/admin-dashboard"
                          className="button px-20 fw-400 text-14 border-white -outline-white h-40 text-white"
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard/db-dashboard" // <-- You can change this to your regular user dashboard URL
                          className="button px-20 fw-400 text-14 border-white -outline-white h-40 text-white"
                        >
                          My Dashboard
                        </Link>
                      )
                    ) : (
                      // If user is LOGGED OUT
                      <Link
                        to="/signup" // <-- You can change this to your sign-up or login URL
                        className="button px-20 fw-400 text-14 border-white -outline-white h-40 text-white"
                      >
                        Sign Up / Register
                      </Link>
                    )}
                  </div> */}
                  {/* <CurrenctyMegaMenu textClass="text-white" /> */}
                  <LanguageMegaMenu textClass="text-white" />
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>
                </div>



                {/* Buttons */}
                <div className="d-flex items-center ">
                  <Link
                    to="mailto:sushant.langhi05@gmail.com"
                    aria-label="Mail"
                    className="button px-15 fw-400 text-14 border-white -outline-white h-50 text-white ml-5 gap-2"
                  >
                    <FiMail />{" "} Mail
                  </Link>
                </div>

                <div className="d-flex items-center ">
                  <Link
                    to="tel:+919022864373"
                    aria-label="Call"
                    className="button px-15 fw-400 text-14 border-white -outline-white h-50 text-white ml-5 gap-2"
                  >
                    <FiPhone />{" "} Contact
                  </Link>
                </div>
                
                
                <div className="d-flex items-center ">
                  <Link
                    to="tel:+919022864373"
                    aria-label="WhatsApp"
                    className="button px-15 fw-400 text-14 border-white -outline-white h-50 text-white ml-5 gap-2"
                  >
                    <FiType />{" "} WhatsApp
                  </Link>
                </div>

                {/* Mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-white">
                  {/* <div>
                    <Link
                      // to="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div> */}
                  {/* <div d-flex items-center ml-20>
                  <Link
                    to="tel:+919022864373"
                    className="button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ml-20 "
                    // className="button px-30 fw-200 text-14 -outline-blue-1 h-50 text-blue-1 ml-20"
                  >
                    <FiPhone /> {" "}+919022864373
                  </Link>
                </div> */}
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />
                    <div
                      className="offcanvas offcanvas-start mobile_menu-contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header1;
