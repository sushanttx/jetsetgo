import { useEffect, useState } from "react";
import MainFilterSearchBox from "./MainFilterSearchBox";
//i love sushi and ramen 
const Index = () => {
  const backgroundImages = [
    "/img/masthead/1/bg.webp",
    "/img/masthead/3/bg.png",
    "/img/masthead/4/bg.png",
    "/img/masthead/9/bg.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000); // change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="masthead -type-1 z-5" style={{ position: "relative", overflow: "hidden" }}>
      <style>
        {`
          @media (max-width: 767px) {
            .mobile-hide {
              display: none !important;
            }
            .mobile-spacing {
              margin-top: 0 !important;
            }
          }
        `}
      </style>
      {/* Background image container */}
      <div className="masthead__bg" style={{ position: "absolute", width: "100%", height: "100%", zIndex: -1 }}>
        {backgroundImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className={`background-slide ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container">
        <div className="row justify-center">
          <div className="col-auto">
            <div className="text-center">
              {/* <h1 className="text-60 lg:text-40 md:text-30 text-white mobile-hide" data-aos="fade-up">
                Find Next Place To Visit
              </h1> */}
              <h1 className="text-white mt-6 md:mt-10 mobile-hide" data-aos="fade-up" data-aos-delay="100">
                Discover amazing places at exclusive deals
              </h1>
              {/* <p className="text-white"></p> */}
            </div>

            <div className="tabs -underline mt-60 md:mt-60 mobile-spacing js-tabs" data-aos="fade-up" data-aos-delay="200">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
