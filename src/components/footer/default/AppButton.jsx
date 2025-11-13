import '@fortawesome/fontawesome-free/css/all.min.css';

const AppButton = () => {
  const appContent = [
    {
      id: 1,
      icon: "icon-linkedin", // Use your actual live chat icon class here
      link: "https://www.linkedin.com/in/sushantlanghi/", // Replace with your Live Chat URL
      text: "Hit me up on",
      market: "LinkedIn",
      colClass: "",
    },
    {
      id: 2,
      icon: "fa-brands fa-whatsapp", // Use your actual WhatsApp icon class here
      link: "https://wa.me/+919022864373", // Replace with your WhatsApp number link
      text: "Text on",
      market: "WhatsApp",
      colClass: "mt-20",
    },  
  ];

  return (
    <>
      {appContent.map((item) => (
        <div
          className={`d-flex items-center px-20 py-10 rounded-4 border-light ${item.colClass}`}
          key={item.id}
        >
          <i className={`${item.icon} text-24`} />
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="ml-20 d-block">
            <div className="text-14 text-light-1">{item.text}</div>
            <div className="text-15 lh-1 fw-500">{item.market}</div>
          </a>
        </div>
      ))}
    </>
  );
};

export default AppButton;
