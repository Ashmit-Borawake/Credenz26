import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

import axios from "axios";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

import card_background from "../../images/card_event_bg.jpg";
import background from "../../images/background.png";

const Member = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for member usernames (Member 1 is the logged-in user)
  const [members, setMembers] = useState(
    Array(event?.maxplayers ? event.maxplayers - 1 : 0).fill(""),
  );

  // Handle input change
  const handleInputChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async () => {
    if (isLoading) return; // prevent double submit

    const [u2, u3, u4] = members.map((u) => u.trim());

    if (!teamName) {
      toast.error("Please enter the teamname", {
        className: "rb-toast-error",
      });
      return;
    }

    // no members entered
    if (!u2 && !u3 && !u4) {
      toast.error("Please enter at least one member username.", {
        className: "rb-toast-error",
      });
      return;
    }

    // order validation
    if (!u2 && (u3 || u4)) {
      toast.error("Please fill Member 2 before adding others.", {
        className: "rb-toast-error",
      });
      return;
    }

    if (!u3 && u4) {
      toast.error("Please fill Member 3 before adding Member 4.", {
        className: "rb-toast-error",
      });
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const payload = {
        event: {
          eventSlug: event.slug,
          teamname: teamName || undefined,
          username2: u2 || undefined,
          username3: u3 || undefined,
          username4: u4 || undefined,
        },
      };

      //console.log("Payload:", payload);

      const res = await api.post("/cart/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event Added to Cart", {
        className: "rb-toast-success",
      });
      navigate("/cart");
    } catch (error) {
      // 🔥 ADD ONLY THIS
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login", { replace: true });
        return;
      }

      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Something went wrong";

      toast.error(message, {
        className: "rb-toast-error",
      });
      setIsLoading(false);
    } finally {
      // keep disabled for ~2s (same UX as main button)
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // If no event data, redirect back
  if (!event) {
    navigate("/events");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between  text-white">
      <Header />

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 my-20 md:my-20">
        {/* BACK BUTTON */}
        <div className="w-full max-w-[90%] md:max-w-[75%]">
          <button
            className="bg-[#8B8B8B]/70 hover:bg-red-500/30 hover:scale-105
                px-3 md:px-5 py-3 rounded-xl font-bold text-white cursor-pointer
                border-black border-2 text-sm md:text-xl duration-300
                text-shadow-[0_0_3px_black,0_0_5px_black,0_0_8px_black] tracking-[2px] mb-2"
            style={{ fontFamily: "Swinging Wake" }}
            onClick={() => navigate(`/events/${event.slug}`)}
          >
            &lt; BACK
          </button>
        </div>

        {/* HEADING */}
        <h1
          className="text-[35px] sm:text-[50px] md:text-[60px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          ADD MEMBERS
        </h1>

        {/* BLUE CARD */}
        <div className="w-full flex justify-center items-center mt-5 text-white">
          <div
            className="w-full md:w-[75%] bg-cover bg-center border-[3px] border-white rounded-[10px] flex flex-col py-5 md:py-10 px-5 md:px-20"
            style={{
              backgroundImage: `url(${card_background})`,
              backgroundColor: "rgba(0,0,0,0.25)",
              backgroundBlendMode: "multiply",
            }}
          >
            {/* EVENT NAME */}
            <h2
              className="text-[30px] md:text-[45px] text-center mb-5 tracking-wider"
              style={{
                fontFamily: "Swinging Wake",
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              {event.name}
            </h2>

            {/* TEAM NAME INPUT */}
            <div className="mb-6 md:mb-10">
              <label
                className="text-[15px] md:text-[25px] tracking-widest"
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                TEAM NAME:
              </label>

              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                className="w-full px-4 py-3 rounded-md text-black text-[12px] md:text-[18px] border-2 border-black bg-[#8B8B8B] placeholder:text-black/70 focus:scale-102 duration-300 focus:outline-none mt-2"
                style={{ fontFamily: "Stranger Things" }}
              />
            </div>

            {/* MEMBER INPUTS */}
            <div className="space-y-6 md:space-y-10">
              {members.map((username, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label
                    className="text-[15px] md:text-[25px] tracking-widest"
                    style={{
                      fontFamily: "Swinging Wake",
                      textShadow:
                        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                    }}
                  >
                    MEMBER {index + 2}:
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter Username"
                    className="w-full px-4 py-3 rounded-md text-black text-[12px] md:text-[18px] border-2 border-black bg-[#8B8B8B] placeholder:text-black/70 focus:scale-102 duration-300 focus:outline-none"
                    style={{ fontFamily: "Stranger Things" }}
                  />
                </div>
              ))}
            </div>

            {/* NOTE */}
            <p
              className="mt-8 text-[12px] md:text-[18px] text-center"
              style={{
                fontFamily: "Stranger Things",
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              <span className="text-red-500 font-bold">NOTE :</span> Member 1 is
              you. Add usernames for remaining members.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`mt-5 px-8 py-2.5 rounded-[10px] text-white border-3 border-black duration-300 text-[15px] md:text-[20px] tracking-widest
            ${
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
            "ADD TO CART"
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Member;
