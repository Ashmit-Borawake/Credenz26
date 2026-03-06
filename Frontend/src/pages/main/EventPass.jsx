import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/shared/Select";

import card_background from "../../images/card_event_bg.jpg";
import qr_image from "../../images/QR.jpeg";

const EventPass = ({ setActiveCategory }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const eventsArray = [
    "Xodia",
    "DATAWIZ",
    "RC",
    "MergeConflict",
    "Cretronix",
    "B-Plan",
    "Enigma",
    "WALLSTREET",
  ];

  const paymentApps = [
    { label: "PhonePe", value: "PhonePe" },
    { label: "Google Pay", value: "GooglePay" },
    { label: "Paytm", value: "Paytm" },
    { label: "Amazon Pay", value: "AmazonPay" },
  ];

  const [paymentApp, setPaymentApp] = useState("PhonePe");
  const [transactionID, setTransactionID] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter UTR");
  const [hasPass, setHasPass] = useState(false);
  const [passStatus, setPassStatus] = useState("none");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPass, setIsFetchingPass] = useState(true);

  /* 📄 Fetch pass status */
  useEffect(() => {
    const fetchPassStatus = async () => {
      try {
        setIsFetchingPass(true);

        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const res = await api.get("/pass/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasPass(res.data.hasPass);
        setPassStatus(res.data.passStatus);
      } catch (error) {
        // 🔥 ADD ONLY THIS
        if (error.response?.status === 407) {
          localStorage.removeItem("token");
          localStorage.removeItem("profilePic");

          navigate("/login");
          return;
        }

        console.error("Failed to fetch pass status:", error);
      } finally {
        setIsFetchingPass(false);
      }
    };

    fetchPassStatus();
  }, []);

  /* 🔄 Change placeholder based on selected app */
  useEffect(() => {
    switch (paymentApp) {
      case "PhonePe":
        setPlaceholder("Enter UTR");
        break;
      case "GooglePay":
        setPlaceholder("Enter UPI Transaction ID");
        break;
      case "Paytm":
        setPlaceholder("Enter UPI Reference ID");
        break;
      case "AmazonPay":
        setPlaceholder("Enter Bank Reference ID");
        break;
      default:
        setPlaceholder("Enter Reference ID");
    }
  }, [paymentApp]);

  /* 📤 Form submit */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // prevent double clicks

    if (!transactionID) {
      toast.error("Please enter the UTR", {
        className: "rb-toast-error",
      });
      return;
    }

    if (transactionID.length < 12) {
      toast.error("Transaction ID must be at least 12 digits", {
        className: "rb-toast-error",
      });
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const res = await api.post(
        "/pass/",
        {
          transactionID: transactionID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        setActiveCategory("tech");
        navigate("/events");
        toast.success("Pass ordered successfully", {
          className: "rb-toast-success",
        });
      }

      setTransactionID("");
    } catch (error) {
      // 🔥 ADD ONLY THIS
      if (error.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login");
        return;
      }

      console.error(error);
      toast.error("Something went wrong while submitting payment details.", {
        className: "rb-toast-error",
      });
      setIsLoading(false);
    } finally {
      // keep disabled for ~2s
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const isButtonDisabled = isFetchingPass || (hasPass && passStatus !== "none");

  return (
    <>
      {/* BLUE EVENT PASS CARD */}
      <div className="w-full flex justify-center items-center mt-5 text-white">
        <div
          className="w-full md:w-[75%] bg-cover bg-center border-[3px] border-white rounded-[20px] flex flex-col items-center px-6 md:px-16 py-5"
          style={{
            backgroundImage: `url(${card_background})`,
            backgroundColor: "rgba(0,0,0,0.20)",
            backgroundBlendMode: "multiply",
          }}
        >
          {/* TITLE */}
          <h1
            className="text-[30px] sm:text-[45px] md:text-[50px] mb-4 tracking-wider"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            EVENTPASS
          </h1>

          {/* DESCRIPTION */}
          <p
            className="text-[12px] sm:text-[20px] md:text-[25px] text-center"
            style={{
              fontFamily: "Stranger Things",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            Unlock the Ultimate Event Experience!
            <br />
            Get your All-Access Event Pass to explore an exciting lineup of
            events and competitions, including:
          </p>

          {/* EVENTS LIST */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 md:gap-x-15 gap-y-3 mt-10 text-[12px] sm:text-[20px] md:text-[25px] tracking-[2px]"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            {eventsArray.map((item, index) => (
              <div className="flex gap-2" key={index}>
                <span>▶</span>
                <div className="text-center">{item}</div>
              </div>
            ))}
          </div>

          {/* COST */}
          <p
            className="my-6 text-[15px] sm:text-[25px] md:text-[35px]"
            style={{
              fontFamily: "Stranger Things",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            COST:
            <span className="text-red-500 line-through mx-3">RS. 350/-</span>
            RS. 100/-
          </p>

          {/* SCAN QR */}
          <p
            className="text-[15px] sm:text-[20px] md:text-[25px]"
            style={{
              fontFamily: "Stranger Things",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            SCAN THE QR TO PAY
          </p>

          {/* QR IMAGE */}
          <img
            src={qr_image}
            alt="QR Code"
            className="w-45 sm:w-55 md:w-65 my-4 border-[3px] border-black rounded-lg brightness-135"
          />

          {/* PAYMENT SECTION */}
          <div className="flex flex-col items-center gap-4 mt-2">
            {/* SELECT APP - Shadcn UI */}
            <Select
              items={paymentApps}
              value={paymentApp}
              onValueChange={(value) => setPaymentApp(value)}
            >
              <SelectTrigger
                className="px-2 md:px-4 py-2 text-[12px] md:text-[16px] tracking-wide cursor-pointer"
                style={{
                  fontFamily: "Stranger Things",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  <SelectLabel className="text-black">Payment Apps</SelectLabel>
                  {paymentApps.map((app) => (
                    <SelectItem
                      key={app.value}
                      value={app.value}
                      style={{
                        fontFamily: "Stranger Things",
                      }}
                    >
                      {app.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* INPUT */}
            <input
              type="text"
              value={transactionID}
              onChange={(e) => setTransactionID(e.target.value)}
              placeholder={placeholder}
              className="px-3 md:px-4 py-2 rounded-md text-black text-[12px] md:text-[16px] border-2 border-black w-65 bg-gray-400 placeholder:text-black/70 placeholder:text-[14px] focus:scale-105 duration-300"
              style={{ fontFamily: "Stranger Things" }}
            />
          </div>

          {/* NOTE */}
          <p
            className="mt-6 text-[12px] md:text-[20px] text-center max-w-275 tracking-wider"
            style={{ fontFamily: "Stranger Things" }}
          >
            <span className="text-red-500 text-[15px] md:text-[20px]">
              NOTE:
            </span>
            <br /> After your pass is purchased and approved, you can simply add
            events to your cart and proceed to checkout. You won't be charged
            for these events. They will be automatically approved, so no
            additional verification is required.
          </p>

          {isAuthenticated ? (
            /* USER LOGGED IN */
            <div
              className="relative"
              onMouseEnter={() => isButtonDisabled && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={handleFormSubmit}
                disabled={isButtonDisabled || isLoading}
                className={`mt-4 px-8 py-2.5 rounded-[18px] text-white border-3 border-black text-[15px] sm:text-[20px] md:text-[25px] tracking-widest
                ${isButtonDisabled || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 duration-300 cursor-pointer bg-[#8B8B8B]"
                  }`}
                style={{
                  fontFamily: "Swinging Wake",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                {isFetchingPass ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="loader"></div>
                    Checking...
                  </span>
                ) : isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="loader"></div>
                    Processing...
                  </span>
                ) : (
                  "BUY"
                )}
              </button>

              {/* TOOLTIP */}
              {showTooltip && isButtonDisabled && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-black text-white text-sm lg:text-md rounded-[10px] whitespace-nowrap z-50 tracking-wider"
                  style={{ fontFamily: "Stranger Things" }}
                >
                  Status : {passStatus.toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            /* USER NOT LOGGED IN */
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-8 py-2.5 rounded-[18px] bg-[#8B8B8B] text-white border-3 border-black hover:scale-105 duration-300 cursor-pointer text-[15px] sm:text-[20px] md:text-[25px] tracking-widest"
              style={{
                fontFamily: "Swinging Wake",
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              Login to buy pass
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EventPass;
