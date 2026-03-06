import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../utils/api";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

import linkedin from "../../images/linkedin.png";
import whatsapp from "../../images/whatsApp.png";
import gmail from "../../images/gmail.png";

const ContactUs = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //TODO email
  const contacts = [
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693383/Ved_tpq7ma.jpg",
      name: "Ved Deshpande",
      role: "Public Relations Officer, Domain Head (ML)",
      socials: {
        linkedin: "https://www.linkedin.com/in/ved-deshpande-a632b7282",
        whatsapp: "https://wa.me/qr/PUFD3F7JSRPOM1",
        gmail: "mailto:veddeshpandepict@gmail.com",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693279/Rashmi_tsak9d.jpg",
      name: "Rashmi Abhyankar",
      role: "Vice Chairperson",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/rashmiabhyankar?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        whatsapp: "https://wa.me/qr/KKSHXKACIFFXJ1",
        gmail: "mailto:ieeedesignrashmi@gmail.com",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693284/Shlok_wdrb3r.jpg",
      name: "Shlok Sangamnerkar",
      role: "Joint Secretary, Technical",
      socials: {
        linkedin: "https://www.linkedin.com/in/shlok-sangamnerkar/",
        whatsapp: "https://wa.me/qr/PK5ZVXVIG7Z2J1",
        gmail: "mailto:shlokts710@gmail.com",
      },
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!firstName || !lastName || !email || !feedback) {
      toast.error("Enter Details", {
        className: "rb-toast-error",
      });
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/feedback", {
        firstName,
        lastName,
        email,
        message: feedback,
      });

      // clear form after submit
      setfirstName("");
      setlastName("");
      setEmail("");
      setFeedback("");
      toast.success("Feedback submitted successfully", {
        className: "rb-toast-success",
      });
      setIsLoading(false);
    } catch (error) {
      // 🔥 HANDLE 407 FIRST
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login");
        return;
      }

      console.error(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong";

      toast.error(message, {
        className: "rb-toast-error",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between  text-white">
      <Header />

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mb-12 gap-5 mt-15 md:mt-25">
        {/* HEADING */}
        <h1
          className="text-[40px] sm:text-[50px] md:text-[60px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          CONTACT US
        </h1>

        {/* CARDS */}
        {/* Contacts */}
        <div
          className="w-full flex flex-wrap justify-center items-stretch
                                    gap-x-[clamp(20px,10vw,100px)]
                                    gap-y-[clamp(20px,8vw,100px)] px-5"
        >
          {contacts.map((member, index) => (
            <div
              key={index}
              className="bg-black/90 border-3 border-[#8B8B8B] rounded-[10px] py-4 w-64 sm:w-72 md:w-64 lg:w-65 xl:w-65 text-center hover:scale-105 duration-400 hover:shadow-2xl"
            >
              {/* Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-54 sm:w-62 md:w-54 lg:w-50 xl:w-56 h-60 object-cover rounded-md mx-auto mb-3"
              />

              {/* Social Icons */}
              <div className="flex justify-center items-center gap-5 mb-3">
                <a href={member.socials.linkedin} target="_blank">
                  <img
                    src={linkedin}
                    alt="LinkedIn"
                    className="w-7 h-7 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.whatsapp} target="_blank">
                  <img
                    src={whatsapp}
                    alt="WhatsApp"
                    className="w-6 h-6 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.gmail} target="_blank">
                  <img
                    src={gmail}
                    alt="Gmail"
                    className="w-5 h-5 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
              </div>

              {/* Name */}
              <p
                className="sm:text-3xl md:text-3xl lg:text-2xl xl:text-xl tracking-wide font-bold, "
                style={{ fontFamily: "Swinging Wake" }}
              >
                {member.name}
              </p>

              {/* Position */}
              <p
                className="text-sm tracking-wide mt-1 px-3"
                style={{ fontFamily: "Stranger Things" }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FEEDBACK FORM + MAP */}
      <div className="w-full px-5 sm:px-10 md:px-30 py-10 mb-8">
        {/* Section Heading */}
        <h2
          className="text-[35px] sm:text-[40px] md:text-[50px] mb-16 text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          Feedback Form
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* FORM */}
          <form className="flex flex-col gap-6 -mt-10" onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* First Name */}
              <div>
                <label
                  className="block mb-2 text-lg md:text-2xl tracking-wider"
                  style={{ fontFamily: "Stranger Things" }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-300/70 text-black outline-none border-2 border-black focus:border-2 focus:border-white hover:scale-102 duration-300 text-lg placeholder:text-sm md:placeholder:text-sm"
                  style={{ fontFamily: "Stranger Things" }}
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  className="block mb-2 text-lg md:text-2xl tracking-wider"
                  style={{ fontFamily: "Stranger Things" }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-300/70 text-black outline-none border-2 border-black focus:border-2 focus:border-white hover:scale-102 duration-300 text-lg placeholder:text-sm md:placeholder:text-sm"
                  style={{ fontFamily: "Stranger Things" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block mb-2 text-lg md:text-2xl tracking-wider"
                style={{ fontFamily: "Stranger Things" }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-300/70 text-black outline-none border-2 border-black focus:border-2 focus:border-white hover:scale-102 duration-300 text-lg placeholder:text-sm md:placeholder:text-sm"
                style={{ fontFamily: "Stranger Things" }}
              />
            </div>

            {/* Feedback */}
            <div>
              <label
                className="block mb-2 text-lg md:text-2xl tracking-wider"
                style={{ fontFamily: "Stranger Things" }}
              >
                Feedback
              </label>
              <textarea
                rows="5"
                placeholder="Enter Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-300/70 text-black outline-none border-2 border-black resize-none focus:border-2 focus:border-white hover:scale-102 duration-300 text-lg placeholder:text-sm md:placeholder:text-sm"
                style={{ fontFamily: "Stranger Things" }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className={`px-10 py-3 rounded-2xl text-xl font-bold border-2 border-black duration-300 self-start mx-auto tracking-[2px]
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-300/70 hover:bg-gray-300/80 hover:scale-105 hover:border-white cursor-pointer"
                }`}
              style={{
                fontFamily: "Swinging Wake",
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3 ">
                  <div className="loader"></div>
                  Sending...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* MAP */}
          <div className="w-full h-101 rounded-2xl overflow-hidden border-8 md:border-15 border-gray-300/70 hover:scale-105 duration-300">
            <iframe
              title="PICT Location"
              src="https://www.google.com/maps?q=PICT%20Pune&output=embed"
              className="w-full h-full filter invert hue-rotate-180 brightness-95 contrast-90"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
