import InvoiceComponent from "@/components/invoice/Invoice";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Invoice || Flight Booking",
  description: "Flight Booking",
};

const Invoice = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <InvoiceComponent />
    </>
  );
};

export default Invoice;
