import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi"; // ✅ Import the icons
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
      <header className={`header bg-white ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link to="/" className="header-logo mr-20">
                  <img src="/img/general/logo-dark.svg" alt="logo icon" />
                  <img src="/img/general/logo-dark.svg" alt="logo icon" />
                </Link>

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xxl:d-none">
                  <CurrenctyMegaMenu textClass="text-dark-1" />
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>
                  <LanguageMegaMenu textClass="text-dark-1" />
                </div>

                {/* Phone and Mail Icons */}
                <div className="d-flex items-center ml-20 text-dark-1 text-18">
                  <div className="mr-15">
                    <a href="tel:+918882817640" className="text-dark-1" aria-label="Call us">
                      <FiPhone />
                    </a>
                  </div>
                  <div>
                    <a href="mailto:dheerajnarang2050@gmail.com" className="text-dark-1" aria-label="Send an email">
                      <FiMail />
                    </a>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex items-center ml-20 is-menu-opened-hide md:d-none">
                  <Link
                    to="/signup"
                    className="button px-30 fw-400 text-14 -outline-blue-1 h-50 text-blue-1 ml-20"
                  >
                    {/* +(91) 123 456 7890 */}
                    Sign In / Register
                  </Link>
                </div>

                {/* Mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-dark-1">
                  <div>
                    <Link
                      to="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div>
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />

                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet"
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
