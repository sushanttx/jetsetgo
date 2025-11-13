import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPhone, FiMail, FiType } from "react-icons/fi"; // ✅ Import icons
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
      <header className={`header bg-dark-3 ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-10">
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
                <div className="row x-gap-20 items-center xxl:d-none">
                  {/* <CurrenctyMegaMenu textClass="text-white" /> */}
                  <LanguageMegaMenu textClass="text-white" />
                  <div className="col-auto">
                    <div className="w-1 h-20 bg-black-20" />
                  </div>
                </div>


                {/* ✅ Sign In / Register Button */}
                <div className="d-flex items-center  ">
                  <Link
                    to="mailto:sushant.langhi05@gmail.com"
                    aria-label="Call Me"
                    className="button px-15 gap-2 fw-400 text-14 border-white -outline-white h-50 text-white ml-5"
                  >
                  <FiMail />{" "}Mail 
                  </Link>
                </div>

                <div className="d-flex items-center  ">
                  <Link
                    to="tel:+919022864373"
                    aria-label="Call Me"
                    className="button px-15 gap-2 fw-400 text-14 border-white -outline-white h-50 text-white ml-5"
                  >
                  <FiPhone />{" "}Contact 
                  </Link>
                </div>
                
                <div className="d-flex items-center  ">
                  <Link
                    to="tel:+919022864373"
                    aria-label="Text"
                    className="button px-15 gap-2 fw-400 text-14 border-white -outline-white h-50 text-white ml-5"
                  >
                  <FiType />{" "}WhatsApp 
                  </Link>
                </div>

                {/* Mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-white">
                  {/* <div>
                    <Link
                      to="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
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
