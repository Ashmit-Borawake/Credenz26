import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import background from "../../images/background.png";
import { useNavigate } from "react-router-dom";
import EventList from "./events";
import api from "../../utils/api";

import image2 from "../../images/image2.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchasedEvents, setPurchasedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Dummy API
        const res = await api.get("/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //console.log(res);

        setUser(res.data.user);
      } catch (error) {
        // 🔥 ADD ONLY THIS
        if (error.response?.status === 407) {
          localStorage.removeItem("token");
          localStorage.removeItem("profilePic");

          navigate("/login", { replace: true });
          return;
        }

        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // New useEffect for fetching orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoading(false);
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
            id: order.id,
            name:
              event?.name || order.eventSlug.toUpperCase().replace(/_/g, " "),
            status: order.isVerified ? "CONFIRMED" : "PENDING",
            teamname: order.teamname,
            username1: order.username1,
            username2: order.username2,
            username3: order.username3,
            username4: order.username4,
          };
        });

        setPurchasedEvents(mappedEvents);
      } catch (error) {
        // 🔥 ADD ONLY THIS
        if (error.response?.status === 407) {
          localStorage.removeItem("token");
          localStorage.removeItem("profilePic");

          navigate("/login");
          return;
        }

        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const profileImages = [
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693384/image0_lvxe0k.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693385/image1_eyqcfq.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693386/image5_is1rvv.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693386/image7_b5ozdy.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693387/image8_zdlz7c.jpg",
  ];

  const profileImage =
    typeof user?.profilePic === "number" && profileImages[user.profilePic]
      ? profileImages[user.profilePic]
      : image2;

  // Separate CREDENZ PASS from other events
  const credenzPass = purchasedEvents.find(
    (event) => event?.name === "CREDENZ PASS",
  );
  const otherEvents = purchasedEvents.filter(
    (event) => event?.name !== "CREDENZ PASS",
  );

  return (
    <div className="min-h-screen flex flex-col justify-start  text-white">
      <Header />

      {/* PAGE HEADING */}
      <div className="flex flex-col items-center mt-15 md:mt-25 mb-5">
        <h1
          className="text-[40px] sm:text-[60px] md:text-[80px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          PROFILE
        </h1>
      </div>

      {/* PROFILE CARD */}
      <div className="flex justify-center px-4 mb-20">
        <div className="w-full max-w-7xl bg-black/60 border-3 border-[#C8C8C8] rounded-[20px] px-4 md:px-12 py-10">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="loader"></div>
              <span
                className="text-[20px] md:text-[25px]"
                style={{ fontFamily: "Stranger Things" }}
              >
                Loading Profile...
              </span>
            </div>
          ) : (
            <>
              {/* PROFILE IMAGE */}
              <div className="flex justify-center mb-6">
                <div className="w-38 h-38 md:w-54 md:h-54 rounded-full bg-[#C8C8C8] flex items-center justify-center">
                  <img
                    src={profileImage}
                    alt="Profile Avatar"
                    className="w-34 h-34 md:w-50 md:h-50 rounded-full bg-white p-1"
                  />
                </div>
              </div>

              {/* USERNAME */}
              <h2
                className="text-center text-[15px] md:text-[40px] mb-8 tracking-wider"
                style={{ fontFamily: "Swinging Wake" }}
              >
                USERNAME :
                <span className="pl-3">{user?.username || "abc_123"}</span>
              </h2>

              {/* USER DETAILS */}
              <div
                className="flex flex-col items-center md:flex-row gap-6 md:justify-around md:gap-40 text-[12px] md:text-[22px] md:mb-10"
                style={{ fontFamily: "Stranger Things" }}
              >
                <div className="space-y-3 text-center md:text-left">
                  <p>
                    <span className="font-bold">NAME :</span>{" "}
                    {(user?.firstName || "Jhon") +
                      " " +
                      (user?.lastName || "Doe")}
                  </p>
                  <p>
                    <span className="font-bold">PHONE NUMBER :</span>{" "}
                    {user?.phoneNumber || "9876543210"}
                  </p>
                </div>

                <div className="space-y-3 text-center md:text-left">
                  <p>
                    <span className="font-bold">CATEGORY :</span>{" "}
                    {user?.isJunior === false ? "Senior" : "Junior"}
                  </p>
                  <p>
                    <span className="font-bold">EMAIL :</span>{" "}
                    {user?.email || "abc@gmail.com"}
                  </p>
                </div>
              </div>

              {/* CREDENZ PASS - Displayed separately above PURCHASED EVENTS */}
              {credenzPass && (
                <div className="mt-10 mb-8 md:px-10">
                  <div
                    className="bg-linear-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-white rounded-[20px] px-4 md:px-8 py-3 border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)]"
                    style={{
                      fontFamily: "Swinging Wake",
                      textShadow:
                        "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                    }}
                  >
                    <div className="flex flex-row items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-end md:gap-5">
                        <span className="text-[16px] md:text-[35px] tracking-widest">
                          CREDENZ PASS
                        </span>
                        <button
                          onClick={() => toggleDetails(credenzPass.id)}
                          className={`text-[10px] md:text-[15px] text-black cursor-pointer mt-2 md:mt-0 text-start tracking-normal ${
                            openDetails[credenzPass.id]
                              ? "underline"
                              : "hover:underline"
                          }`}
                          style={{
                            fontFamily: "Stranger Things",
                          }}
                        >
                          {openDetails[credenzPass.id]
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </div>
                      <span className="text-[16px] md:text-[30px] tracking-widest">
                        {credenzPass?.status || "PENDING"}
                      </span>
                    </div>

                    {openDetails[credenzPass.id] && (
                      <div
                        className="bg-yellow-600/30 py-3 md:px-4 text-xs md:text-sm flex flex-col gap-1 mt-4 rounded-lg text-white tracking-normal"
                        style={{
                          fontFamily: "Stranger Things",
                          textShadow: "none",
                        }}
                      >
                        <span>
                          After your pass is purchased and approved, you can
                          simply add events to your cart and proceed to
                          checkout. You won’t be charged for these events. They
                          will be automatically approved, so no additional
                          verification is required.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PURCHASED EVENTS */}
              <h2
                className="text-center text-[25px] md:text-[50px] mb-3 mt-10 md:mt-17 tracking-wider"
                style={{ fontFamily: "Swinging Wake" }}
              >
                PURCHASED EVENTS
              </h2>

              {/* EVENTS TABLE */}
              <div className="overflow-y-auto md:px-10">
                <table className="w-full border-separate border-spacing-y-5">
                  <thead style={{ fontFamily: "Stranger Things" }}>
                    <tr className="text-[12px] md:text-[25px]">
                      <th className="pl-5 md:pl-10 text-left">EVENTS</th>
                      <th className="pr-5 md:pr-10 text-right">STATUS</th>
                    </tr>
                  </thead>

                  <tbody
                    style={{
                      fontFamily: "Swinging Wake",
                      textShadow:
                        "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                    }}
                  >
                    {otherEvents?.length > 0 ? (
                      otherEvents.map((event, index) => {
                        const usernames = [
                          event.username1,
                          event.username2,
                          event.username3,
                          event.username4,
                        ].filter(Boolean);

                        return (
                          <React.Fragment key={event.id}>
                            <tr className="bg-[#8B8B8B] text-white rounded-[20px] tracking-widest transition">
                              <td className="py-4 pl-5 md:pl-8 rounded-l-[20px] text-[15px] md:text-[30px]">
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                  <div className="flex flex-col md:flex-row justify-end md:items-end md:gap-5 tracking-[2px]">
                                    <span>{event?.name || "EVENTPASS"}</span>
                                    <button
                                      onClick={() => toggleDetails(event.id)}
                                      className={`text-[10px] md:text-[15px] text-black cursor-pointer mt-2 md:mt-0 text-start tracking-normal ${
                                        openDetails[event.id]
                                          ? "underline"
                                          : "hover:underline"
                                      }`}
                                      style={{
                                        fontFamily: "Stranger Things",
                                        textShadow: "none",
                                      }}
                                    >
                                      {openDetails[event.id]
                                        ? "Hide Details"
                                        : "View Details"}
                                    </button>
                                  </div>
                                </div>

                                {openDetails[event.id] && (
                                  <div
                                    className="bg-[#8B8B8B] py-3 text-xs md:text-sm font-[Stranger Things] flex flex-col gap-1 rounded-lg text-black tracking-normal"
                                    style={{
                                      fontFamily: "Stranger Things",
                                      textShadow: "none",
                                    }}
                                  >
                                    <span>
                                      <strong>Team Name :</strong>{" "}
                                      {event.teamname}
                                    </span>
                                    {usernames.map((m, i) => (
                                      <span key={i}>
                                        Member {i + 1} : {m}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 pr-5 md:pr-8 rounded-r-[20px] text-right text-[15px] md:text-[30px]">
                                {event?.status || "PENDING"}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr className="bg-[#8B8B8B] text-white rounded-[20px] tracking-widest">
                        <td className="py-4 pl-4 md:pl-8 rounded-l-[20px] text-[16px] md:text-[35px]">
                          {credenzPass
                            ? "No Other Events Purchased"
                            : "No Events Purchased"}
                        </td>
                        <td className="py-4 pr-4 md:pr-8 rounded-r-[20px] text-right text-[16px] md:text-[35px]">
                          -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
