import flightsData from "../../../data/flights";
import { useNavigate } from "react-router-dom";

const FlightProperties = () => {
  const navigate = useNavigate();
  return (
    <>
      {flightsData.map((item) => (
        <div className="js-accordion" key={item.id}>
          <div className="py-30 px-30 bg-white rounded-4 base-tr mt-30">
            <div className="row y-gap-30 justify-between">
              <div className="col">
                {item.flightList.map((segment, idx) => (
                  <div className={`row y-gap-10 items-center${idx > 0 ? ' pt-30' : ''}`} key={segment.id}>
                  <div className="col-sm-auto">
                    <img
                      className="size-40"
                        src={segment.avatar}
                        alt="flight icon"
                    />
                  </div>
                  <div className="col">
                    <div className="row x-gap-20 items-end">
                      <div className="col-auto">
                          <div className="lh-15 fw-500">{segment.departureTime}</div>
                          <div className="text-15 lh-15 text-light-1">{segment.arrivalAirport}</div>
                      </div>
                      <div className="col text-center">
                        <div className="flightLine">
                          <div />
                          <div />
                        </div>
                        <div className="text-15 lh-15 text-light-1 mt-10">
                            {segment.duration.includes('Nonstop') ? 'Nonstop' : segment.duration}
                        </div>
                      </div>
                      <div className="col-auto">
                          <div className="lh-15 fw-500">{segment.arrivalTime}</div>
                          <div className="text-15 lh-15 text-light-1">{segment.departureAirport}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-auto">
                    <div className="text-15 text-light-1 px-20 md:px-0">
                        {segment.duration.split('-')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* End .col */}

              <div className="col-md-auto">
                <div className="d-flex items-center h-full">
                  <div className="pl-30 border-left-light h-full md:d-none" />
                  <div>
                    <div className="text-right md:text-left mb-10">
                      <div className="text-18 lh-16 fw-500">US${item.price}</div>
                      <div className="text-15 lh-16 text-light-1">{item.deals} deals</div>
                    </div>
                    <div className="accordion__button">
                      <button
                        className="button -dark-1 px-30 h-50 bg-blue-1 text-white"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${item.selectId}`}
                      >
                        View Deal <div className="icon-arrow-top-right ml-15" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .col-md-auto */}
            </div>
            {/* End .row */}

            <div className=" collapse" id={item.selectId}>
              {item.flightList.map((segment, idx) => (
                <div className={`border-light rounded-4${idx > 0 ? ' mt-20' : ' mt-30'}`} key={segment.id}>
                <div className="py-20 px-30">
                  <div className="row justify-between items-center">
                    <div className="col-auto">
                      <div className="fw-500 text-dark-1">
                          Depart • Segment {idx + 1}
                        </div>
                      </div>
                            <div className="col-auto">
                        <div className="text-14 text-light-1">{segment.duration.split('-')[0]}</div>
                    </div>
                  </div>
                </div>
                <div className="py-30 px-30 border-top-light">
                  <div className="row y-gap-10 justify-between">
                    <div className="col-auto">
                      <div className="d-flex items-center mb-15">
                        <div className="w-28 d-flex justify-center mr-15">
                            <img src={segment.avatar} alt="flight icon" />
                        </div>
                        <div className="text-14 text-light-1">
                            {/* Example: Airline name and number, can be dynamic if available */}
                            Airline Segment {idx + 1}
                        </div>
                      </div>
                      <div className="relative z-0">
                        <div className="border-line-2" />
                        <div className="d-flex items-center">
                          <div className="w-28 d-flex justify-center mr-15">
                            <div className="size-10 border-light rounded-full bg-white" />
                          </div>
                          <div className="row">
                            <div className="col-auto">
                                <div className="lh-14 fw-500">{segment.departureTime}</div>
                            </div>
                            <div className="col-auto">
                              <div className="lh-14 fw-500">
                                  {segment.arrivalAirport}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex items-center mt-15">
                          <div className="w-28 d-flex justify-center mr-15">
                              <img src="/img/flights/plane.svg" alt="plane" />
                          </div>
                            <div className="text-14 text-light-1">{segment.duration.split('-')[0]}</div>
                        </div>
                        <div className="d-flex items-center mt-15">
                          <div className="w-28 d-flex justify-center mr-15">
                            <div className="size-10 border-light rounded-full bg-border" />
                          </div>
                          <div className="row">
                            <div className="col-auto">
                                <div className="lh-14 fw-500">{segment.arrivalTime}</div>
                            </div>
                            <div className="col-auto">
                              <div className="lh-14 fw-500">
                                  {segment.departureAirport}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto text-right md:text-left">
                      <div className="text-14 text-light-1">Economy</div>
                      <div className="text-14 mt-15 md:mt-5">
                        Airbus A320neo (Narrow-body jet)
                        <br />
                        Wi-Fi available
                        <br />
                        USB outlet
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                          <button
                            className="button -dark-1 px-30 h-50 bg-blue-1 text-white"
                            onClick={() => navigate(`/flight/booking/${item.id}/${segment.id}`)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* End collapase content */}
          </div>
          {/* End bg-white */}
        </div>
      ))}
    </>
  );
};

export default FlightProperties;
