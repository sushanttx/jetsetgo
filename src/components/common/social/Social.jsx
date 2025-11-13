const Social = () => {
  const socialContent = [
    // { id: 1, icon: "icon-facebook", link: "https://facebok.com/" },
    // { id: 2, icon: "icon-twitter", link: "https://twitter.com/" },
    // { id: 3, icon: "icon-instagram", link: "https://instagram.com/" },
    { id: 4, icon: "icon-linkedin", link: "https://www.linkedin.com/in/sushantlanghi/" },
    { id: 5, icon: "icon-email-2", link: "mailto:sushant.langhi05@gmail.com" },
    { id: 5, icon: "icon-notification", link: "https://wa.me/+919022864373" },
  ];
  return (
    <>
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
        >
          <i className={`${item.icon} text-14`} />
        </a>
      ))}
    </>
  );
};

export default Social;
