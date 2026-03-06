import React from "react";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

// import background from "../../images/background.png";

const Sponsors = () => {
  const sponsorCards = [
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1770309712/Evotize_brabo7.jpg",
      alt: "Evotize",
      position: "Event Partner",
      name: "Evotize",
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1770309712/TenancyPassport_d65v5n.png",
      alt: "TenancyPassprt",
      position: "Tech Partner",
      name: "Tenancy Passport",
    },
    // {
    //   image:
    //     "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1770308526/Evotize_s7wn3y.jpg",
    //   alt: "maarus",
    //   position: "Food Sponsor",
    //   name: "Maaru's\nBakery",
    // },
  ];

  const SponsorCard = ({ image, alt, position, name }) => (
    <div className="bg-black/90 border-3 border-[#8B8B8B] rounded-[10px] py-4 w-75 text-center hover:scale-105 duration-400 hover:shadow-2xl shrink-0">
      <img
        src={image}
        alt={alt}
        className="w-65 h-65 object-cover rounded-md mx-auto mb-3"
      />
      <p
        className="text-md tracking-wide mb-1"
        style={{ fontFamily: "Stranger Things" }}
      >
        {position}
      </p>
      <p
        className="text-xl tracking-wide whitespace-pre-line"
        style={{ fontFamily: "Stranger Things" }}
      >
        {name}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between text-white">
      <Header />

      {/* CENTER CONTENT */}

      {/* Coming Soon  */}
      {/* <div className="flex-1 flex flex-col items-center justify-center px-4 my-15 gap-8 md:gap-10">
        
        <h1
          className="text-[40px] sm:text-[50px] md:text-[65px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          SPONSORS
        </h1>

        
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
          <h2
            className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-normal text-center tracking-wider"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            COMING SOON
          </h2>

          <p
            className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-center tracking-wide max-w-2xl px-4"
            style={{
              fontFamily: "Stranger Things",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            Stay tuned for our amazing sponsors!
          </p>
        </div>
      </div> */}

      {/* COMMENTED OUT CARDS SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 my-15 gap-5 md:gap-0">
        <h1
          className="text-[40px] md:text-[65px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          SPONSORS
        </h1>

        <div className="w-full">
          <div className="md:hidden grid grid-cols-1 gap-10 place-items-center">
            {sponsorCards.map((card, index) => (
              <SponsorCard key={index} {...card} />
            ))}
          </div>

          <div className="hidden md:block overflow-hidden relative">
            <style>
              {`
                  @keyframes marquee {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .animate-marquee {
                    animation: marquee 30s linear infinite;
                  }
                `}
            </style>
            <div className="flex animate-marquee py-5">
              {sponsorCards.map((card, index) => (
                <div key={`first-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`second-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`first-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`second-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`first-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`second-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`first-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
              {sponsorCards.map((card, index) => (
                <div key={`second-${index}`} className="mx-8">
                  <SponsorCard {...card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sponsors;
