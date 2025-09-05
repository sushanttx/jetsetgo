import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/dashboard";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Admin Dashboard || Flight Booking",
  description: "Flight Booking",
};

// Uses AdminMobileMenu for mobile sidebar via dashboard-header
export default function VendorDashboard() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
