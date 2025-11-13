const Address = () => {
  const addressContent = [
    {
      id: 1,
      colClass: "col-lg-3",
      title: "Address",
      content: (
        <>Pune, India.</>
      ),
    },
    {
      id: 2,
      colClass: "col-auto",
      title: "Call me for inquiry",
      content: (
        <>
          <a href="tel:+919022864373">+91 9022864373</a>
        </>
      ),
    },
    {
      id: 3,
      colClass: "col-auto",
      title: "Wanna Hire me?",
      content: (
        <>
          {" "}
          <a href="mailto:sushant.langhi05@gmail.com">sushant.langhi05@gmail.com</a>
        </>
      ),
    },
  ];
  return (
    <>
      {addressContent.map((item) => (
        <div className={`${item.colClass}`} key={item.id}>
          <div className="text-14 text-light-1">{item.title}</div>
          <div className="text-18 fw-500 mt-10">{item.content}</div>
        </div>
      ))}
    </>
  );
};

export default Address;
