import React from "react";
import Sidebar from "../../../components/dashboard/vendor-dashboard/common/Sidebar";
import Header from "../../../components/header/dashboard-header";
import Footer from "../../../components/dashboard/vendor-dashboard/common/Footer";
import CustomerManagementTable from "../../../components/dashboard/vendor-dashboard/booking/components/CustomerManagementTable";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Customer Management || Flight Booking",
  description: "Customer Management Table",
};

export default function CustomerManagementPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>
      <Header />
      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>
        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
              <div className="col-auto">
                <img src="/img/dashboard/sidebar/bookmark.svg" alt="Customer Icon" style={{width: 28, height: 28, marginRight: 10, verticalAlign: 'middle'}} />
                <h1 className="text-30 lh-14 fw-600" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                  Customer Management
                </h1>
              </div>
            </div>
            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <CustomerManagementTable />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
} 