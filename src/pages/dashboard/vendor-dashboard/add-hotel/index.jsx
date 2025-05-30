import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/add-hotel";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Vendor Add Hotel || Flight Booking",
  description: "Flight Booking",
};

export default function VendorAddHotel() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
