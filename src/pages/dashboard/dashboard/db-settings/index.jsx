import React from "react";
import DashboardPage from "../../../../components/dashboard/dashboard/db-settings";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Settings || Flight Booking",
  description: "Flight Booking",
};

export default function DBSettings() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
