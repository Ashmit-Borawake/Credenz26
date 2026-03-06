import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/api";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/shared/Select";

import qrCode from "../../images/QR.jpeg";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [amount, setAmount] = useState(0);
  const [transactionID, setTransactionID] = useState("");
  const [paymentApp, setPaymentApp] = useState("PhonePe");
  const [placeholder, setPlaceholder] = useState("Enter UTR");
  const [isLoading, setIsLoading] = useState(false);

  const paymentApps = [
    { label: "PhonePe", value: "PhonePe" },
    { label: "Google Pay", value: "GooglePay" },
    { label: "Paytm", value: "Paytm" },
    { label: "Amazon Pay", value: "AmazonPay" },
  ];

  const toastOptions = {
    position: "top-right",
    className: "rb-toast",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
  };

  /* ------------------- Update Placeholder ------------------- */
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

  /* ------------------- Initialize amount ------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!location.state || location.state.fromCart !== true) {
      navigate("/cart", { replace: true });
      return;
    }

    const cartAmount = location.state.amount;
    if (typeof cartAmount !== "number" || cartAmount < 0) {
      navigate("/cart", { replace: true });
      return;
    }

    setAmount(cartAmount);
    setTransactionID(cartAmount === 0 ? "N/A" : "");
  }, [location, navigate]);

  /* ------------------- Submit Payment ------------------- */
  const handleSubmit = async () => {
    // ✅ Only validate Transaction ID when amount > 0
    if (amount > 0) {
      if (!transactionID) {
        toast.error("Enter Transaction ID", {
          className: "rb-toast-error",
        });
        return;
      }

      if (isNaN(transactionID)) {
        toast.error("Enter a valid Transaction ID", {
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
    }

    const txID = amount === 0 ? "N/A" : transactionID;
    const id = toast.loading("Processing Payment...", toastOptions);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await api.post(
        "/user/confirm",
        { transactionID: txID },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.update(id, {
        render: "Event Ordered Successfully",
        type: "success",
        isLoading: false,
        ...toastOptions,
      });

      if (res.status === 201) navigate("/profile");
    } catch (err) {
      // 🔥 HANDLE 407 FIRST
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        toast.dismiss(id);
        navigate("/login", { replace: true });
        return;
      }

      console.error(err);
      toast.update(id, {
        render: "Payment Failed!",
        type: "error",
        isLoading: false,
        ...toastOptions,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <Header />

      <div className={styles.pageContent}>
        <h1 className={styles.title}>CHECKOUT</h1>

        <div className={styles.checkoutBox}>
          {/* QR Section */}
          <div className={styles.qrSection}>
            <p className={styles.subHeading}>SCAN THE QR TO PAY</p>
            <div className={styles.qrBox}>
              <img src={qrCode} alt="QR" className={styles.qrImage} />
            </div>
          </div>

          {/* Payment Section */}
          <div className={styles.paymentSection}>
            <div className={styles.amountRow}>
              <span>AMOUNT TO PAY</span>
              <span>RS. {amount}/-</span>
            </div>

            <hr className={styles.hr} />

            <div className={styles.utrRow}>
              {amount === 0 ? (
                <>
                  <input
                    type="text"
                    value="N/A: Click the checkout button"
                    disabled
                    className={`${styles.utrInput} opacity-70 cursor-not-allowed`}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={styles.submitBtn}
                  >
                    {isLoading ? "PROCESSING..." : "CHECKOUT"}
                  </button>
                </>
              ) : (
                <>
                  {/* Shadcn UI Select */}
                  <Select
                    items={paymentApps}
                    value={paymentApp}
                    onValueChange={(value) => setPaymentApp(value)}
                  >
                    <SelectTrigger
                      className={styles.selectInput}
                      style={{
                        fontFamily: "Stranger Things",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectLabel>Payment Apps</SelectLabel>
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

                  <input
                    type="text"
                    placeholder={placeholder}
                    value={transactionID}
                    onChange={(e) => setTransactionID(e.target.value)}
                    className={styles.utrInput}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={styles.submitBtn}
                  >
                    {isLoading ? "PROCESSING..." : "CHECKOUT"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";
const styles = {
  overlay: "min-h-screen flex flex-col text-white",
  pageContent: "flex-1 px-4 pt-28 sm:pt-32 md:pt-36 lg:pt-20 pb-28",
  title: `text-center mb-8 text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] tracking-wider font-[Swinging_Wake] ${textShadow}`,
  checkoutBox:
    "w-full max-w-3xl lg:max-w-5xl mx-auto bg-black/80 border-[3px] border-gray-400 rounded-2xl p-6 flex flex-col lg:flex-row gap-6",
  qrSection: "flex flex-col items-center justify-center w-full mb-6 lg:mb-0",
  subHeading:
    "mb-4 text-base sm:text-lg text-center tracking-[2px] font-[Swinging_Wake]",
  qrBox: "bg-gray-300 p-1 rounded-xl",
  qrImage: "w-60 sm:w-70 md:w-80 lg:w-65 rounded-xl",
  paymentSection: "flex flex-col justify-center w-full",
  amountRow:
    "flex justify-between text-md sm:text-xl mb-4 font-[Stranger_Things] md:px-2",
  hr: "border-white/40 mb-6",
  utrRow: "flex flex-col gap-4 w-full",
  utrInput:
    "flex-1 px-4 py-3 rounded-xl bg-gray-300 text-black outline-none text-base sm:text-lg font-[Stranger_Things] placeholder:text-black/70",
  selectInput:
    "w-full px-4 py-3 rounded-xl bg-gray-400 text-black border-2 border-black text-base sm:text-lg cursor-pointer hover:scale-105 focus:scale-105 duration-500",
  submitBtn: `px-8 py-3 rounded-xl bg-gray-400 text-white text-lg md:text-xl font-[Swinging_Wake] hover:bg-gray-600 transition cursor-pointer ${textShadow} tracking-[1px]`,
};

/* ---------------- CUSTOM TOAST CSS ---------------- */
const style = document.createElement("style");
style.innerHTML = `
  .rb-toast {
    background-color: black !important;
    color: red !important;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 0 12px red;
  }
`;
document.head.appendChild(style);
