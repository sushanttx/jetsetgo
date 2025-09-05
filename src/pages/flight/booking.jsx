import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import FlightStepperBooking from "@/components/flight-booking/FlightStepperBooking";
import MetaComponent from "@/components/common/MetaComponent";
import { transformFlightData } from "@/utils/flight-helpers";

const metadata = {
  title: "Flight Booking Page || Flight Booking",
  description: "Flight Booking",
};

const FlightBookingPage = () => {
  // 1. Get only the main itinerary ID from the URL
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  // const [segment, setSegment] = useState(null); // REMOVED segment state
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const flightResults = localStorage.getItem("flightSearchResults");
    const storedSearchData = localStorage.getItem("flightSearchForm");

    if (flightResults && storedSearchData) {
      try {
        const parsedResults = JSON.parse(flightResults);
        const transformedResults = transformFlightData(parsedResults);

        // 2. Find the specific flight the user clicked on
        const foundFlight = transformedResults.find(f => String(f.id) === String(id));
        setFlight(foundFlight);

        // 3. REMOVED the logic that searched for a specific segment
        
        setSearchData(JSON.parse(storedSearchData));
      } catch (error) {
        console.error("Error parsing booking data from localStorage", error);
      }
    }
    setLoading(false);
  }, [id]); // 4. REMOVED segmentId from the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  // 5. Updated the check to only look for the flight
  if (!flight) {
    return (
      <div className="container py-40">
        <div className="bg-white rounded-4 p-30 text-center">
          <h2 className="text-24 fw-600 mb-20">Flight Not Found</h2>
          <p className="text-16 text-light-1">The selected flight could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>
      <Header11 />
      <section className="pt-40 layout-pb-md">
        <div className="container">
          {/* 6. REMOVED the segment prop from FlightStepperBooking */}
          <FlightStepperBooking flight={flight} searchData={searchData} />
        </div>
      </section>
      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default FlightBookingPage;