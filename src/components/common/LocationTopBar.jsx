import { useLocation } from "react-router-dom";

const LocationTopBar = () => {
    const location = useLocation();

const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" > ");
  return (
    <section
      data-aos="fade"
      className="d-flex items-center py-15 border-top-light"
    >
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                <div>Home</div>
              </div>
              <div className="col-auto">
                <div>&gt; </div>
              </div>
              <div className="col-auto">
                <div>{pageName}</div>
              </div>
              {/* <div className="col-auto">
                <div>&gt;</div>
              </div> */}
              {/* <div className="col-auto">
                <div className="text-dark-1">London</div>
              </div> */}
            </div>
          </div>
          {/* <div className="col-auto">
            <a href="#" className="text-14 text-light-1">
              London Tourism: Best of London
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LocationTopBar;
