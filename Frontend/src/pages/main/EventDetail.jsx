import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoOpenOutline } from "react-icons/io5";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import EventList from "./events";
import axios from "axios";
import api from "../../utils/api";

import background from "../../images/background.png";
import card_background from "../../images/card_event_bg.jpg";
import member_bg from "../../images/member_bg.png";

const EventDetail = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasedEvents, setPurchasedEvents] = useState([]);
  const [githubUsername, setGithubUsername] = useState("");

  const isAuthenticated = !!localStorage.getItem("token");

  const event = EventList.find((e) => e.slug === eventName.toLowerCase());

  // prevent crash if event not found
  if (!event) return null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const res = await api.get("/user/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //console.log(res);

        // Map orders to purchased events with event names from EventList
        const mappedEvents = res.data.orders.map((order) => {
          const event = EventList.find((e) => e.slug === order.eventSlug);

          return {
            slug: order.eventSlug,
            name:
              event?.name || order.eventSlug.toUpperCase().replace(/_/g, " "),
            status: order.isVerified ? "CONFIRMED" : "PENDING",
          };
        });

        setPurchasedEvents(mappedEvents);
      } catch (error) {
        // 🔥 HANDLE 407 FIRST
        if (error.response?.status === 407) {
          localStorage.removeItem("token");
          localStorage.removeItem("profilePic");

          navigate("/login");
          return;
        }

        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleAddToCart = async () => {
    try {
      if (isLoading) return; // prevent double clicks

      const alreadyPurchased = purchasedEvents.some(
        (e) => e.slug === event.slug,
      );

      if (alreadyPurchased) {
        toast.error("You have already ordered this event, Check Profile", {
          className: "rb-toast-error",
        });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      // Web Weaver → ALWAYS go to member page with event
      if (event.slug === "web_weaver") {
        navigate("/member", { state: { event } });
        return;
      }

      // OSS → Show GitHub username popup
      if (event.slug === "oss") {
        toast.info(
          "Participants must be registered on both platforms to qualify for the prize pool.",
          {
            className: "rb-toast-oss",
          },
        );
        setShowPopup(true);
        return;
      }

      if (event.maxplayers > 1) {
        setShowPopup(true);
      } else {
        setIsLoading(true);
        await api.post(
          "/cart/",
          {
            event: {
              eventSlug: event.slug,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Event Added to Cart", {
          className: "rb-toast-success",
        });
        navigate("/cart");
      }
    } catch (error) {
      //console.log(error);

      // 🔥 HANDLE 407 FIRST
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login", { replace: true });
        return;
      }

      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (status === 401) {
        toast.error(message, {
          className: "rb-toast-error",
        });
      } else {
        toast.error(message, {
          className: "rb-toast-error",
        });
      }

      setIsLoading(false);
    } finally {
      // keeps button disabled for ~2s even if response is fast
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleYes = () => {
    setShowPopup(false);
    navigate("/member", { state: { event } });
  };

  const handleNo = async () => {
    try {
      if (isLoading) return;

      // Close popup immediately
      setShowPopup(false);

      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      await api.post(
        "/cart/",
        {
          event: {
            eventSlug: event.slug,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Event Added to Cart", {
        className: "rb-toast-success",
      });
      navigate("/cart");
    } catch (error) {
      //console.log(error);

      // 🔥 HANDLE 407 FIRST
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login", { replace: true });
        return;
      }

      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 401) {
        toast.error(data.message, {
          className: "rb-toast-error",
        });
        setIsLoading(false);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleGithubSubmit = async () => {
    try {
      if (isLoading) return;

      if (!githubUsername.trim()) {
        toast.error("Please enter your GitHub username", {
          className: "rb-toast-error",
        });
        return;
      }

      // Close popup immediately
      setShowPopup(false);

      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      await api.post(
        "/cart/",
        {
          event: {
            eventSlug: event.slug,
            teamname: githubUsername || undefined,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setGithubUsername(""); // Clear input
      toast.success("Event Added to Cart", {
        className: "rb-toast-success",
      });
      navigate("/cart");
    } catch (error) {
      //console.log(error);

      // 🔥 ADD ONLY THIS
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login", { replace: true });
        return;
      }

      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (status === 401) {
        toast.error(message, {
          className: "rb-toast-error",
        });
      } else {
        toast.error(message, {
          className: "rb-toast-error",
        });
      }

      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setGithubUsername(""); // Clear input when closing
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="text-center space-y-10 md:space-y-6">
            {/* DESCRIPTION */}
            <p
              className="text-[15px] md:text-[20px] leading-relaxed"
              style={{
                fontFamily: "Stranger Things",
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              {event.description}
            </p>

            {/* APERTURE REGISTRATION LINK FOR OSS EVENT */}
            {event.slug === "oss" && (
              <div
                className="flex flex-col gap-2 text-[15px] md:text-[20px]"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                <p>
                  Participants must be registered on both platforms to qualify
                  for the prize pool.
                </p>
                <a
                  href="https://apertre.resourcio.in/register?role=mentee&ref=65CAOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    text-blue-500 underline
                    hover:text-blue-400
                    transition-colors
                    text-[12px] md:text-[16px]
                  "
                >
                  <span className="tracking-normal">
                    <span className="text-white">1 )</span> Aperture
                    Registration Link
                  </span>
                  <IoOpenOutline className="text-[15px] md:text-[16px]" />
                </a>

                <a
                  href="https://apertre.resourcio.in/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    text-blue-500 underline
                    hover:text-blue-400
                    transition-colors
                    text-[12px] md:text-[16px]
                  "
                >
                  <span className="tracking-normal">
                    <span className="text-white">2 )</span> Projects
                  </span>
                  <IoOpenOutline className="text-[15px] md:text-[16px]" />
                </a>
              </div>
            )}

            {/* WEB WEAVER LINKS */}
            {event.slug === "web_weaver" && (
              <div
                className="flex flex-col gap-2 text-[15px] md:text-[20px]"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                <p>
                  Participants must refer to the problem statements and submit
                  their ideas through the official submission form before the
                  deadline.
                </p>

                <a
                  href="https://docs.google.com/document/d/114tbOj5850QvLjIhoVFFIK23z0OMEhtokrZEagXEQxE/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  flex items-center justify-center gap-2
                  text-blue-500 underline
                  hover:text-blue-400
                  transition-colors
                  text-[12px] md:text-[16px]
                "
                >
                  <span className="tracking-normal">
                    <span className="text-white">1 )</span> Problem Statements
                  </span>
                  <IoOpenOutline className="text-[15px] md:text-[16px]" />
                </a>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe4Z8uyZ8VJWGg75YVz9UN6XC-i2itUNR8kQwv3Ci8zvBUUkQ/viewform?usp=publish-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
        flex items-center justify-center gap-2
        text-blue-500 underline
        hover:text-blue-400
        transition-colors
        text-[12px] md:text-[16px]
      "
                >
                  <span className="tracking-normal">
                    <span className="text-white">2 )</span> Idea Submission Form
                  </span>
                  <IoOpenOutline className="text-[15px] md:text-[16px]" />
                </a>
              </div>
            )}

            {/* TIMINGS */}
            <div>
              <h4
                className="text-[25px] md:text-[30px] mb-2 tracking-widest"
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                TIMINGS:
              </h4>

              <div className="space-y-1 text-[15px] md:text-[20px]">
                {event.timings?.map((time, index) => (
                  <p
                    key={index}
                    style={{
                      fontFamily: "Stranger Things",
                      textShadow:
                        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                    }}
                  >
                    {time}
                  </p>
                ))}
              </div>
            </div>

            {/* PRIZES */}
            <div>
              <h4
                className="text-[25px] md:text-[30px] mb-2 tracking-widest"
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                PRIZES:
              </h4>

              <div className="space-y-1 text-[15px] md:text-[20px]">
                {event.prizes?.map((prize, index) => (
                  <p
                    key={index}
                    style={{
                      fontFamily: "Stranger Things",
                      textShadow:
                        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                    }}
                  >
                    {prize}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );

      case "rules":
        return (
          <div className="space-y-6 text-left">
            {event.rules?.map((rule, index) => (
              <div
                key={index}
                className="flex gap-4 md:gap-3 text-[15px] md:text-[20px]"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                <span className="font-bold">{index + 1}.</span>

                {/* 🔹 THIS LINE IS THE FIX */}
                <p className="whitespace-pre-line">{rule}</p>
              </div>
            ))}
          </div>
        );

      case "structure":
        return (
          <div className="space-y-6 text-left">
            {event.structure?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 md:gap-3 text-[15px] md:text-[20px]"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                <span className="font-bold">{index + 1}.</span>
                <p className="">{item}</p>
              </div>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-10">
            {event.contact?.map((person, index) => (
              <div
                key={index}
                className="text-center"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                <p className="text-[20px] md:text-[30px] font-semibold">
                  {person.name}
                </p>
                <p className="text-[20px] mt-2">{person.number}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between  text-white">
      <Header />

      {/* center content */}
      <div className="flex-1 px-4 mb-15 mt-13 md:mt-18 gap-5 lg:gap-2 flex flex-col items-center md:overflow-hidden">
        <h1
          className="text-[40px] sm:text-[50px] md:text-[60px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          {event.name}
        </h1>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-5 md:gap-8 justify-center tracking-[3px]">
          <button
            className="   bg-[#8B8B8B]/70 hover:bg-red-500/30  hover:scale-110 py-2 px-4 md:px-6 md:py-3  rounded-xl font-bold text-white cursor-pointer border-black border-2   text-md sm:text-lg md:text-xl  duration-300 text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-widest"
            style={{ fontFamily: "Swinging Wake" }}
            onClick={() => navigate("/events")}
          >
            &lt; BACK
          </button>

          {["info", "rules", "structure", "contact"].map((tab) => (
            <button
              key={tab}
              className={`   bg-[#8B8B8B]/70 hover:bg-red-500/30  hover:scale-110 py-2 px-4 md:px-6 md:py-3  rounded-xl font-bold text-white cursor-pointer border-black border-2   text-md sm:text-lg md:text-xl  duration-300 text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-widest
                  ${
                    activeTab === tab
                      ? "bg-red-500/30 hover:bg-red-900/80!"
                      : ""
                  }`}
              style={{ fontFamily: "Swinging Wake" }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* BLUE CARD */}
        <div className="w-full flex justify-center items-center mt-2 text-white">
          <div
            className="w-full md:w-[75%] bg-cover bg-center border-[3px] border-white rounded-[10px] flex flex-col "
            style={{
              backgroundImage: `url(${card_background})`,
              backgroundColor: "rgba(0,0,0,0.20)",
              backgroundBlendMode: "multiply",
            }}
          >
            {/* SCROLLABLE CONTENT */}
            <div className="h-145 md:h-120 lg:h-75 overflow-y-auto custom-scroll py-5 px-6 md:px-10">
              {renderContent()}
            </div>

            {/* FIXED BOTTOM BAR */}
            <div
              className="w-full border-t-2 border-white/60 px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-2 bg-black/40"
              style={{
                fontFamily: "Stranger Things",
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              {/* PLAYERS */}
              <p className="text-[12px] md:text-[16px]">{event.players}</p>

              {/* COST */}
              <div className="bg-red-500/50 px-3 md:px-2 py-2 md:py-1 rounded-[10px] text-[12px] md:text-[16px] tracking-[2px] flex justify-center items-center">
                Cost: ₹{event.price}/-
              </div>
            </div>
          </div>
        </div>

        {event?.slug === "roboliga" ? (
          <div className="mt-4 w-full md:w-[75%] mx-auto">
            <div
              className="bg-red-600/90 border-3 border-white rounded-[15px] px-6 py-4 text-center"
              style={{
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
              }}
            >
              <p
                className="text-white text-[18px] md:text-[24px] font-bold mb-3 tracking-wider"
                style={{
                  fontFamily: "Stranger Things",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                ONLINE REGISTRATIONS CLOSED
              </p>
              <div
                className="bg-black/40 rounded-[10px] px-4 py-3 mb-3"
                style={{
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                }}
              >
                <p
                  className="text-white text-[16px] md:text-[20px] mb-2"
                  style={{
                    fontFamily: "Swinging Wake",
                    textShadow:
                      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                  }}
                >
                  On Spot Registrations: ₹500/-
                </p>
                <p
                  className="text-yellow-300 text-[14px] md:text-[16px]"
                  style={{
                    fontFamily: "Swinging Wake",
                    textShadow:
                      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                  }}
                >
                  Please contact the numbers mentioned in the Contact section
                </p>
              </div>
            </div>
          </div>
        ) : event?.slug === "nth" ? (
          <a
            href="https://nth.credenz.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block px-8 py-2.5 rounded-[10px] bg-[#8B8B8B] text-white border-3 border-black hover:scale-105 duration-300 text-[15px] md:text-[20px] cursor-pointer tracking-widest"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            Visit NTH Website
          </a>
        ) : isAuthenticated ? (
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`mt-2 px-8 py-2.5 rounded-[10px] text-white border-3 border-black duration-300 text-[15px] md:text-[20px] tracking-widest ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#8B8B8B] hover:scale-105 cursor-pointer"
            }`}
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="loader"></div>
                Adding...
              </span>
            ) : (
              "Add to cart"
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="mt-2 px-8 py-2.5 rounded-[10px] bg-[#8B8B8B] text-white border-3 border-black hover:scale-105 duration-300 text-[15px] md:text-[20px] cursor-pointer tracking-widest"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            Login to register
          </button>
        )}
      </div>

      {/*OSS POPUP */}
      {showPopup && event.slug === "oss" && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleClosePopup}
        >
          <div
            className="relative w-full md:w-[50%] lg:w-[35%] bg-cover bg-center border-2 md:border-[3px] border-white rounded-[20px] p-4 md:p-10"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundImage: `url(${member_bg})`,
              backgroundColor: "rgba(0,0,0,0.50)",
              backgroundBlendMode: "multiply",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClosePopup}
              className="absolute top-1 right-3 text-white text-[20px] md:text-[25px] font-bold cursor-pointer transition-transform duration-300 ease-in-out hover:text-red-500 hover:rotate-90"
              style={{
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              ✕
            </button>

            {/* POPUP CONTENT GITHUB*/}
            <div className="my-5 flex flex-col items-center gap-3">
              <h2
                className="text-[20px] md:text-[25px] text-center tracking-widest"
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                ENTER YOUR GITHUB USERNAME
              </h2>

              <p
                className="text-center tracking-wider"
                style={{
                  fontFamily: "Stranger Things",
                }}
              >
                <div className="flex flex-col justify-center items-center">
                  <p className="text-[15px] md:text-[18px] text-center">
                    Note :
                  </p>
                  <p className="text-[12px] md:text-[15px] text-center">
                    Please enter the correct GitHub username
                  </p>
                </div>
              </p>

              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="Enter GitHub Username"
                className="w-full px-4 py-3 rounded-md text-black text-[12px] md:text-[18px] border-2 border-black bg-[#8B8B8B] placeholder:text-black/70 focus:scale-102 duration-300 focus:outline-none mt-2 tracking-wider"
                style={{ fontFamily: "Stranger Things" }}
              />

              {/* Aperture Registration Note */}
              <div
                className="flex flex-col justify-center items-center text-center tracking-wider mt-3"
                style={{ fontFamily: "Stranger Things" }}
              >
                <p className="text-[15px] md:text-[18px]">Note :</p>
                <p className="text-[12px] md:text-[15px]">
                  Participants must be registered on both platforms to qualify
                  for the prize pool.
                </p>

                <a
                  href="https://apertre.resourcio.in/register?role=mentee&ref=65CAOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                      flex items-center gap-2
                      text-blue-500 underline
                      hover:text-blue-400
                      transition-colors
                      text-[12px] md:text-[16px]
                    "
                >
                  <span className="tracking-normal">
                    Aperture Registration Link
                  </span>
                  <IoOpenOutline className="text-[15px] md:text-[16px]" />
                </a>
              </div>

              <button
                onClick={handleGithubSubmit}
                disabled={isLoading}
                className={`mt-4 px-4 md:px-8 py-3 rounded-[10px] font-bold text-white cursor-pointer
                    border-black border-2 text-md md:text-2xl duration-300
                    tracking-widest ${
                      isLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#8B8B8B]/70 hover:bg-green-500/30 hover:scale-105"
                    }`}
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                {isLoading ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && event.maxplayers > 1 && event.slug !== "oss" && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleClosePopup}
        >
          <div
            className="relative w-[95%] md:w-[50%] lg:w-[35%] bg-cover bg-center border-[3px] border-white rounded-[20px] p-8 md:p-12"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundImage: `url(${member_bg})`,
              backgroundColor: "rgba(0,0,0,0.50)",
              backgroundBlendMode: "multiply",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-white text-[30px] font-bold cursor-pointer transition-transform duration-300 ease-in-out hover:text-red-500 hover:rotate-90"
              style={{
                fontFamily: "Swinging Wake",
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              ✕
            </button>

            {/* POPUP CONTENT */}
            <div className="my-8 md:my-5 flex flex-col items-center gap-10">
              <h2
                className="text-[25px] md:text-[30px] text-center tracking-widest"
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                DO YOU WANT TO ADD MEMBERS TO YOUR TEAM ?
              </h2>

              {/* BUTTONS */}
              <div className="flex gap-12 md:gap-20">
                <button
                  onClick={handleYes}
                  className="bg-[#8B8B8B]/70 hover:bg-green-500/30 hover:scale-105
                      px-6 md:px-8 py-3 rounded-[10px] font-bold text-white cursor-pointer
                      border-black border-2 text-lg md:text-2xl duration-300
                      tracking-widest"
                  style={{
                    fontFamily: "Swinging Wake",
                    textShadow:
                      "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                  }}
                >
                  YES
                </button>

                <button
                  onClick={handleNo}
                  className="bg-[#8B8B8B]/70 hover:bg-red-500/30 hover:scale-105
                      px-6 md:px-8 py-3 rounded-[10px] font-bold text-white cursor-pointer
                      border-black border-2 text-lg md:text-2xl duration-300
                      tracking-widest"
                  style={{
                    fontFamily: "Swinging Wake",
                    textShadow:
                      "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                  }}
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetail;

//for rotate logo
//  className="w-40 h-40 object-contain transition-transform duration-500 ease-in-out group-hover:rotate-360 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-hover:brightness-125 "
