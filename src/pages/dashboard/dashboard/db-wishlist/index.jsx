import React from "react";
import DashboardPage from "../../../../components/dashboard/dashboard/db-wishlist";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Wishlist || Flight Booking",
  description: "Flight Booking",
};

export default function DBWishlist() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
