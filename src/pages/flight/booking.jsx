import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import flightsData from "@/data/flights";
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import FlightStepperBooking from "@/components/flight-booking/FlightStepperBooking";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Flight Booking Page || Flight Booking",
  description: "Flight Booking",
};

const FlightBookingPage = () => {
  const { id, segmentId } = useParams();
  const [flight, setFlight] = useState(null);
  const [segment, setSegment] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const foundFlight = flightsData.find((f) => String(f.id) === String(id));
    setFlight(foundFlight);
    if (foundFlight && segmentId) {
      const foundSegment = foundFlight.flightList.find(seg => String(seg.id) === String(segmentId));
      setSegment(foundSegment);
    }
    // Prefer round trip data if present, otherwise use one way data
    const roundTripForm = localStorage.getItem("flightRoundTripFormData");
    const oneWayForm = localStorage.getItem("flightFormData");
    if (roundTripForm && !oneWayForm) {
      setFormData(JSON.parse(roundTripForm));
    } else if (oneWayForm && !roundTripForm) {
      setFormData(JSON.parse(oneWayForm));
    } else if (roundTripForm && oneWayForm) {
      // If both exist, prefer the most recently updated (by timestamp)
      const roundTrip = JSON.parse(roundTripForm);
      const oneWay = JSON.parse(oneWayForm);
      // If you want to add timestamps, you can do so in the form submission handlers
      // For now, default to roundTrip
      setFormData(JSON.parse(roundTripForm));
    } else {
      setFormData(null);
    }
  }, [id, segmentId]);

  if (!flight || !segment) {
    return (
      <div className="container py-40">
        <div className="bg-white rounded-4 p-30 text-center">
          <h2 className="text-24 fw-600 mb-20">Flight or Segment Not Found</h2>
          <p className="text-16 text-light-1">The selected flight or segment could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header11 />
      {/* End Header 1 */}

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <FlightStepperBooking flight={flight} formData={formData} segment={segment} />
        </div>
        {/* End container */}
      </section>
      {/* End stepper */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
    </>
  );
};

export default FlightBookingPage; 