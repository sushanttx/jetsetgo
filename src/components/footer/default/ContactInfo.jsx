const ContactInfo = () => {
  const contactContent = [
    {
      id: 1,
      title: "Contact for Hiring Me",
      action: "tel:+919022864373",
      text: "+91 9022864373",
    },
    {
      id: 2,
      title: "Mail to Hire Me",
      action: "mailto:sushant.langhi05@gmail.com",
      text: "sushant.langhi05@gmail.com",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mt-30" key={item.id}>
          <div className={"text-14 mt-30"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 text-blue-1 mt-5">
            {item.text}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
