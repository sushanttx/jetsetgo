import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/dashboard";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Vendor Dashboard || Flight Booking",
  description: "Flight Booking",
};

export default function VendorDashboard() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
