import { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import background from "../../images/background.png";
import { toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    subTotal: 0,
    discount: 0,
    totalPayable: 0,
  });

  const [openDetails, setOpenDetails] = useState({});
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const isMounted = useRef(false);
  const hasFetched = useRef(false);
  const toastIdRef = useRef(null);

  /* ---------------- FETCH CART + STATUS CHECK (IMMEDIATE) ---------------- */
  const fetchCartAndStatus = async () => {
    if (toastIdRef.current) return;

    toastIdRef.current = toast.loading("Loading cart items...", {
      className: "rb-toast-success",
    });

    try {
      const itemsRes = await api.get("/cart");

      if (!isMounted.current) return;
      setItems(itemsRes.data?.cartItems || []);

      const priceRes = await api.get("/user/price");

      if (!isMounted.current) return;
      setSummary(priceRes.data);
      setStatusMessage("");

      toast.update(toastIdRef.current, {
        render: "Cart loaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 1500,
        className: "rb-toast-success",
        onClose: () => {
          toastIdRef.current = null; // ✅ RESET
        },
      });
    } catch (err) {
      if (!isMounted.current) return;

      // 🔥 HANDLE 407 FIRST
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;

        navigate("/login");
        return;
      }

      toast.update(toastIdRef.current, {
        render: err.response?.data?.message || "Failed to load cart",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        className: "rb-toast-error",
        onClose: () => {
          toastIdRef.current = null; // ✅ RESET
        },
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    isMounted.current = true;

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchCartAndStatus();
    }

    return () => {
      isMounted.current = false;
    };
  }, [isAuthenticated]);

  /* ---------------- CHECKOUT (NO STATUS LOGIC HERE) ---------------- */
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty", {
        className: "rb-toast-error",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // First verify cart status
    try {
      const itemsRes = await api.get("/cart");
      if (!isMounted.current) return;
      setItems(itemsRes.data?.cartItems || []);

      const priceRes = await api.get("/user/price");
      if (!isMounted.current) return;
      setSummary(priceRes.data);
      setStatusMessage("");

      // No error - proceed to checkout
      if (priceRes.data.totalPayable >= 0) {
        navigate("/checkout", {
          state: {
            fromCart: true,
            amount: priceRes.data.totalPayable,
          },
        });
      }
    } catch (err) {
      // 🔥 HANDLE 407 FIRST
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login");
        return;
      }

      // Error occurred - show toast and stop
      toast.error(err.response?.data?.message || "Failed to verify cart", {
        className: "rb-toast-error",
      });
      setIsLoading(false);
      return;
    }
  };

  /* ---------------- DELETE ITEM ---------------- */
  const handleDelete = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setOpenDetails((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    try {
      await api.delete(`/cart/${id}`);

      /**
       * 🔁 Re-check status after delete
       */
      // //console.log("Re-checking status after delete...");
      const priceRes = await api.get("/user/price");

      setSummary(priceRes.data);
      setCheckoutDisabled(false);
      setStatusMessage("");
    } catch (err) {
      // 🔥 HANDLE 407 FIRST
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        navigate("/login");
        return;
      }

      const status = err.response?.status;
      const msg = err.response?.data?.message || "Checkout blocked";

      setStatusMessage(msg);
      setCheckoutDisabled(status !== 400);
    }
  };

  /* ---------------- TOGGLE DETAILS ---------------- */
  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.overlay}>
      <Header />

      <div className={styles.pageContent}>
        <h1 className={styles.title}>CART</h1>

        <div className={styles.grid} style={{ fontFamily: "Stranger Things" }}>
          {/* ---------------- ITEMS ---------------- */}
          <div className={styles.itemsBox}>
            <h2 className={styles.heading}>ITEMS</h2>

            <p className="text-xs sm:text-sm text-white/70 mb-4 text-center font-[Stranger Things]">
              If you want to edit teammates or team name, delete the event and
              add it again.
            </p>

            {!isAuthenticated ? (
              <p className={styles.empty}>You are not logged in</p>
            ) : items.length === 0 ? (
              <p className={styles.empty}>Your cart is empty</p>
            ) : (
              items.map((item) => {
                const usernames = [
                  item.username1,
                  item.username2,
                  item.username3,
                  item.username4,
                ].filter(Boolean);

                return (
                  <div
                    key={item.id}
                    className="bg-gray-600/70 rounded-xl mb-5 overflow-hidden"
                  >
                    <div className="relative px-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-y-1 sm:gap-x-6 pr-10 font-[Stranger Things] ">
                        <span className="font-bold truncate text-sm md:text-md">
                          {item.event?.title}
                        </span>

                        <span className="sm:text-center whitespace-nowrap tracking-wider text-sm md:text-md">
                          ₹ {item.event?.price}/-
                        </span>

                        <button
                          onClick={() => toggleDetails(item.id)}
                          className={`justify-self-start sm:justify-self-end cursor-pointer text-sm md:text-md hover:text-gray-300
                            ${openDetails[item.id] ? "underline" : "hover:underline"}`}
                        >
                          {openDetails[item.id]
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl cursor-pointer hover:scale-110 transition"
                      >
                        🗑
                      </button>
                    </div>

                    {openDetails[item.id] && (
                      <div className="bg-gray-500/50 px-4 py-3 text-sm font-[Stranger Things] flex flex-col gap-1">
                        <span>
                          <strong>Team Name :</strong> {item.teamname}
                        </span>
                        {usernames.map((m, i) => (
                          <span key={i}>
                            Member {i + 1} : {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ---------------- SUMMARY ---------------- */}
          <div className={styles.summaryBox}>
            <h2 className={styles.heading}>SUMMARY</h2>

            <div className={styles.row}>
              <span>SUBTOTAL</span>
              <span>₹ {summary.subTotal}/-</span>
            </div>

            <div className={styles.row}>
              <span>DISCOUNT (PASS)</span>
              <span>- ₹ {summary.discount}/-</span>
            </div>

            <hr className={styles.hr} />

            <div className={styles.totalRow}>
              <span>TOTAL</span>
              <span>₹ {summary.totalPayable}/-</span>
            </div>

            {/* 🔴 BLINKING BACKEND MESSAGE */}
            {statusMessage && (
              <p className="text-xs sm:text-sm text-red-400 mt-3 text-center animate-pulse font-[Stranger Things]">
                {statusMessage}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutDisabled || isLoading}
              className={`   ${styles.checkoutBtn} ${
                checkoutDisabled || isLoading
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "PROCESSING..." : "CHECKOUT"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const textShadow = "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  overlay: "min-h-screen flex flex-col  text-white",
  pageContent: "flex-1 px-4 sm:px-6 lg:px-8 pb-28 mt-10",
  title:
    "text-center mt-14 mb-5 text-[2.8rem] sm:text-[3.8rem] font-[Swinging_Wake]",
  grid: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8",
  itemsBox:
    "lg:col-span-2 bg-black/80 border-[3px] border-gray-400 rounded-2xl p-3 md:p-6",
  summaryBox:
    "bg-black/80 border-[3px] border-gray-400 rounded-2xl p-6 sm:p-8 h-fit",
  heading:
    "text-center mt-2 mb-4 md:mt-0 text-2xl sm:text-3xl font-[Swinging_Wake]",
  row: "flex justify-between text-base sm:text-lg mb-3 font-[Stranger_Things]",
  totalRow:
    "flex justify-between text-lg sm:text-xl mt-4 mb-4 font-[Stranger_Things]",
  checkoutBtn: `w-full bg-gray-400 text-white rounded-xl py-3 text-lg hover:bg-gray-300 transition font-[Swinging_Wake] ${textShadow} cursor-pointer text-xl md:text-2xl hover:scale-102 duration-300`,
  hr: "border-white/40 my-5 mb-5 cursor-pointer",
  empty: "text-center opacity-70 text-base  sm:text-2xl font-[Stranger Things]",
};
