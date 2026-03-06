import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import EventPass from "./EventPass";
import TiltedCard from "../../components/shared/TiltedCard";

import card_background from "../../images/card_event_bg.jpg";
import card_background2 from "../../images/card_event_bg2.png";

import datawizLogo from "../../images/logos/Datawiz..png";
import rcLogo from "../../images/logos/RC.png";
import webWeaverLogo from "../../images/logos/Web waever.png";
import cretonixLogo from "../../images/logos/Cretonix.png";
import xodiaLogo from "../../images/logos/xodia_new.png";

import nihLogo from "../../images/logos/NTH.png";
import wallstreetLogo from "../../images/logos/Wallstreet.png";
import bplanLogo from "../../images/logos/Bplan.png";
import enigmaLogo from "../../images/logos/Enigma.png";
import roboligaLogo from "../../images/logos/Roboliga.png";
import ossLogo from "../../images/logos/OSS.png";

const Event = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("tech");
  const [hoveredEventId, setHoveredEventId] = useState(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const startY = window.scrollY;
    const targetY = 60;
    const distance = targetY - startY;
    const duration = 600;

    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [activeCategory]);

  const handleEventClick = (event) => {
    navigate(`/events/${event.slug}`);
  };

  const techEvents = [
    {
      id: 1,
      name: "REVERSE CODING",
      slug: "reverse_coding",
      logo: rcLogo,
      description: "Reverse Coding Challenge",
    },
    {
      id: 2,
      name: "WEB WEAVER",
      slug: "web_weaver",
      logo: webWeaverLogo,
      description: "Web Development Event",
    },
    {
      id: 3,
      name: "MERGE CONFLICT",
      slug: "oss",
      logo: ossLogo,
      description: "MERGE CONFLICT",
    },
    {
      id: 4,
      name: "DATAWIZ",
      slug: "datawiz",
      logo: datawizLogo,
      description: "Data Science Competition",
    },
    {
      id: 5,
      name: "CRETRONIX",
      slug: "cretronix",
      logo: cretonixLogo,
      description: "Electronics Event",
    },
    {
      id: 6,
      name: "XODIA",
      slug: "xodia",
      logo: xodiaLogo,
      description: "Coding Competition",
    },
  ];

  const nonTechEvents = [
    {
      id: 1,
      name: "NTH",
      slug: "nth",
      logo: nihLogo,
      description: "Not In Hackathon",
    },
    {
      id: 2,
      name: "ENIGMA",
      slug: "enigma",
      logo: enigmaLogo,
      description: "Quiz Competition",
    },
    {
      id: 3,
      name: "B-PLAN",
      slug: "b_plan",
      logo: bplanLogo,
      description: "Business Plan Competition",
    },
    {
      id: 4,
      name: "WALLSTREET",
      slug: "wallstreet",
      logo: wallstreetLogo,
      description: "Stock Market Challenge",
    },
    {
      id: 5,
      name: "ROBOLIGA",
      slug: "roboliga",
      logo: roboligaLogo,
      description: "Robotics Competition",
    },
  ];

  const currentEvents = activeCategory === "tech" ? techEvents : nonTechEvents;

  const firstRow = currentEvents.slice(0, 3);
  const secondRow = currentEvents.slice(3);

  // Card content component for overlay
  const CardContent = ({ event }) => (
    <div className="w-75 h-75 rounded-xl border-5 hover:border-6 duration-300 border-white/80 bg-linear-to-b from-black/30 to-black/40 cursor-pointer group">
      <div className="w-75 h-75 flex flex-col items-center justify-center">
        <div className="w-75 text-center">
          <h3
            className={`text-2xl md:group-hover:text-[27px] duration-300 font-bold text-white tracking-[4px] text-center uppercase`}
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            {event.name}
          </h3>
        </div>
        <div className={`w-full flex items-center justify-center `}>
          <img
            src={event.logo}
            alt={String(event.name)}
            className={`
              object-contain group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-hover:brightness-125 duration-300 group-hover:scale-105
              ${event.name?.toLowerCase() === "xodia" ? "w-50 h-50 md:w-50 md:h-50" : "w-40 h-40 md:w-50 md:h-50"}
            `}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative  text-white">
      <Header />

      {/* main content  */}
      <div className="flex-1 px-4 my-12 md:my-20 gap-3 md:gap-5 flex flex-col items-center md:overflow-hidden">
        <h1
          className="text-[40px] sm:text-[65px] md:text-[70px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          EVENTS
        </h1>

        {/* Toggle Buttons */}
        <div className="w-full mx-auto flex gap-5 sm:gap-10 md:gap-20 justify-center">
          <button
            className={`bg-[#8B8B8B]/70 hover:bg-red-500/30 hover:scale-110 px-3 sm:px-10 py-3 rounded-xl font-bold text-white cursor-pointer border-black border-2 text-md sm:text-lg md:text-2xl duration-300 text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-widest ${
              activeCategory === "tech"
                ? "bg-red-500/30 hover:bg-red-900/80!"
                : ""
            }`}
            style={{ fontFamily: "Swinging Wake" }}
            onClick={() => setActiveCategory("tech")}
          >
            TECH
          </button>
          <button
            className={`bg-[#8B8B8B]/70 hover:bg-red-500/30 hover:scale-110 px-3 sm:px-10 py-3 rounded-xl font-bold text-white cursor-pointer border-black border-2 text-md sm:text-lg md:text-2xl duration-300 text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-widest ${
              activeCategory === "non-tech"
                ? "bg-red-500/30 hover:bg-red-900/80!"
                : ""
            }`}
            style={{ fontFamily: "Swinging Wake" }}
            onClick={() => setActiveCategory("non-tech")}
          >
            NON-TECH
          </button>
          <button
            className={`bg-[#8B8B8B]/70 hover:bg-red-500/30 hover:scale-110 px-3 sm:px-10 py-3 rounded-xl font-bold text-white cursor-pointer border-black border-2 text-md sm:text-lg md:text-2xl duration-300 text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-widest ${
              activeCategory === "pass"
                ? "bg-red-500/30 hover:bg-red-900/80!"
                : ""
            }`}
            style={{ fontFamily: "Swinging Wake" }}
            onClick={() => setActiveCategory("pass")}
          >
            BUY PASS
          </button>
        </div>

        {activeCategory === "non-tech" ? (
          <div className="w-full flex flex-col items-center">
            {/* --- FIRST ROW (Grid for top 3) --- */}
            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[repeat(2,300px)] lg:grid-cols-[repeat(3,300px)] gap-y-10 gap-x-15 px-4 mt-4 place-items-center justify-center items-center">
              {firstRow.map((event) => {
                const isHovered = hoveredEventId === event.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    onMouseEnter={() => setHoveredEventId(event.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                  >
                    <TiltedCard
                      imageSrc={isHovered ? card_background2 : card_background}
                      altText={event.name}
                      captionText={event.name}
                      containerHeight="300px"
                      containerWidth="300px"
                      imageHeight="300px"
                      imageWidth="300px"
                      rotateAmplitude={15}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={true}
                      overlayContent={<CardContent event={event} />}
                    />
                  </div>
                );
              })}
            </div>

            {/* --- SECOND ROW (Grid for bottom 2) --- */}
            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[repeat(2,300px)] gap-y-10 gap-x-15 px-4 mt-8 place-items-center justify-center items-center mb-5">
              {secondRow.map((event) => {
                const isHovered = hoveredEventId === event.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    onMouseEnter={() => setHoveredEventId(event.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                  >
                    <TiltedCard
                      imageSrc={isHovered ? card_background2 : card_background}
                      altText={event.name}
                      captionText={event.name}
                      containerHeight="300px"
                      containerWidth="300px"
                      imageHeight="300px"
                      imageWidth="300px"
                      rotateAmplitude={15}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={true}
                      overlayContent={<CardContent event={event} />}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeCategory === "tech" ? (
          <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[repeat(2,300px)] lg:grid-cols-[repeat(3,300px)] gap-y-10 gap-x-15 px-4 mt-4 place-items-center justify-center items-center mb-5">
            {currentEvents.map((event) => {
              const isHovered = hoveredEventId === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <TiltedCard
                    imageSrc={isHovered ? card_background2 : card_background}
                    altText={event.name}
                    captionText={event.name}
                    containerHeight="300px"
                    containerWidth="300px"
                    imageHeight="300px"
                    imageWidth="300px"
                    rotateAmplitude={15}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={<CardContent event={event} />}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EventPass setActiveCategory={setActiveCategory} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Event;
