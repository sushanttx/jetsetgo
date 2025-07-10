import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/hotels";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "All Flights || Flight Booking",
  description: "Flight Booking",
};

export default function BVVendorHotel() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
