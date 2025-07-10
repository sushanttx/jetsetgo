import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import MainMenu from "../MainMenu";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import LanguageMegaMenu from "../LanguageMegaMenu";
import MobileMenu from "../MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);

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
                  <img src="/img/general/logo-dark.svg" alt="logo icon" />
                  <img src="/img/general/logo-dark.svg" alt="logo icon" />
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
                <div className="row x-gap-20 items-center xxl:d-none">
                  <div className="col-auto">
                    <Link
                      to="/admin-dashboard"
                      className="button px-20 fw-400 text-14 border-white -outline-white h-40 text-white ml-10"
                      style={{ minWidth: 120 }}
                    >
                      Admin Dashboard
                    </Link>
                  </div>
                  <CurrenctyMegaMenu textClass="text-white" />
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>
                  <LanguageMegaMenu textClass="text-white" />
                </div>



                {/* Buttons */}
                <div className="d-flex items-center ">
                  <Link
                    to="tel:+918882817640"
                    aria-label="Call us"
                    className="button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ml-20"
                  >
                    <FiPhone />{" "} +91 8882817640
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
                    to="tel:+918882817640"
                    className="button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ml-20 "
                    // className="button px-30 fw-200 text-14 -outline-blue-1 h-50 text-blue-1 ml-20"
                  >
                    <FiPhone /> {" "}+918882817640
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
