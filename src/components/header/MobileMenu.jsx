import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  homeItems,
  blogItems,
  pageItems,
  dashboardItems,
  categorieMobileItems,
  categorieMegaMenuItems,
} from "../../data/mainMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Social from "../common/social/Social";
import ContactInfo from "./ContactInfo";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MobileMenu = () => {
  const { pathname } = useLocation();

  const [isActiveParent, setIsActiveParent] = useState(false);
  const [isActiveNestedParentTwo, setisActiveNestedParentTwo] = useState(false);
  const [isActiveNestedParent, setisActiveNestedParent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    categorieMegaMenuItems.map((megaMenu) => {
      megaMenu?.menuCol?.map((megaCol) => {
        megaCol?.menuItems?.map((item) => {
          item?.menuList?.map((list) => {
            if (list.routePath?.split("/")[1] == pathname.split("/")[1]) {
              setIsActiveParent(true);
              setisActiveNestedParentTwo(item?.title);
              setisActiveNestedParent(megaMenu?.id);
            }
          });
        });
      });
    });
  }, []);

  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        <Link to="/" className="d-flex flex-column align-items-center">
          <img src="/img/general/logo-dark.svg" alt="brand" />
          <span className="text-20 fw-500 mt-10 text-dark-1">Flight Booking</span>
        </Link>
        {/* End logo */}

        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
        {/* icon close */}
      </div>
      {/* End pro-header */}

      <Sidebar width="400" backgroundColor="#fff">
        <Menu>
        <MenuItem
            onClick={() => navigate("/")}
            className={pathname === "/" ? "menu-active-link" : ""}
          >
            Home
          </MenuItem>
         
          <MenuItem
            onClick={() => navigate("/flight")}
            className={pathname === "/flight" ? "menu-active-link" : ""}
          >
            Flight
          </MenuItem>
          
          <MenuItem
            onClick={() => navigate("/destinations")}
            className={pathname === "/destinations" ? "menu-active-link" : ""}
          >
            Destination
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/blog")}
            className={pathname === "/blog" ? "menu-active-link" : ""}
          >
            Blog
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/about")}
            className={pathname === "/about" ? "menu-active-link" : ""}
          >
            About
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/contact")}
            className={pathname === "/contact" ? "menu-active-link" : ""}
          >
            Contact
          </MenuItem>
          {/* End Contact  Menu */}
        </Menu>
      </Sidebar>

      <div className="mobile-footer px-20 py-5 border-top-light"></div>

      <div className="pro-footer">
        <ContactInfo />
        <div className="mt-10">
          <h5 className="text-16 fw-500 mb-10">Follow us on social media</h5>
          <div className="d-flex x-gap-20 items-center">
            <Social />
          </div>
        </div>
        {/* <div className="mt-20">
          {/* <Link
            className=" button -dark-1 px-30 fw-400 text-14 bg-blue-1 h-50 text-white"
            to="/login"
          >
            dheerajnarang2050@gmail.com
          </Link> 
        </div> */}
      </div>
      {/* End pro-footer */}
    </>
  );
};

export default MobileMenu;
