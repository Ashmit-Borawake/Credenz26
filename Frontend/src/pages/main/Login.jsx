import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../utils/api";

import background from "../../images/background.png";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

const LOGIN_TOAST_ID = "login-toast";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/events");
    }
  }, [navigate]);

  const toastOptions = {
    position: "top-right",
    className: "rb-toast",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //==============================================================
    // toast.info("Login is temporarily disabled", {
    //   className: "rb-toast-error",
    // });
    // return;
    //==============================================================

    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = {
      user: {
        username: e.target.username.value,
        password: e.target.password.value,
      },
    };

    toast.loading("Logging in...", {
      toastId: LOGIN_TOAST_ID,
      className: "rb-toast-success ",
    });

    try {
      const res = await api.post("/auth/login", formData);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        // ✅ ADD THIS
        localStorage.setItem("profilePic", res.data.profilePic);

        toast.update(LOGIN_TOAST_ID, {
          render: "Login successful",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          className: "rb-toast-success ",
          bodyClassName: "rb-toast-text",
        });

        navigate("/events");
      } else {
        toast.update(LOGIN_TOAST_ID, {
          render: "Access denied",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          className: "rb-toast-error",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      toast.update(LOGIN_TOAST_ID, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 2000,
        className: "rb-toast-error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <Header />

      <form className={styles.centerBox} onSubmit={handleSubmit}>
        <h1 className={styles.title}>LOGIN</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            className={styles.input}
            required
            maxLength={20}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.input}
              required
              maxLength={10}
            />
            <span
              className={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.loginBtn}
        >
          {isSubmitting ? "LOGGING IN..." : "LOGIN"}
        </button>

        <div className={styles.linksBox}>
          <p>
            Not registered?{" "}
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </p>
          <Link to="/forgot-password" className="hover:underline">
            Forgot Password
          </Link>
        </div>
      </form>

      <Footer />
    </div>
  );
}

/* ⛔ UNCHANGED STYLES ⛔ */
const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  overlay: "min-h-screen flex flex-col justify-between  text-white ",

  centerBox: `flex flex-col items-center justify-center flex-1 px-6 sm:px-0 ${textShadow}`,

  title: `text-4xl sm:text-5xl md:text-6xl tracking-wider mb-8 sm:mb-10 text-center ${textShadow} font-[Swinging_Wake]`,

  inputGroup: "w-full sm:w-[500px] md:w-[650px] mb-4 sm:mb-6 text-left",

  label: `block mb-2 text-xl md:text-3xl ${textShadow} font-[Swinging_Wake]`,

  inputWrapper: "relative",

  input:
    "w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gray-300/70 text-black outline-none border border-black border-2 sm:border-3 text-sm sm:text-base  font-[Stranger_Things] tracking-wider",

  eyeBtn:
    "absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600",

  loginBtn: `mt-4 sm:mt-6 px-12 sm:px-16 py-2 sm:py-3 rounded-2xl bg-gray-400 text-lg sm:text-xl font-bold cursor-pointer hover:bg-gray-500/70 border-black border-2 sm:border-3 w-full sm:w-auto text-white ${textShadow} font-[Swinging_Wake] duration-300 tracking-[2px]`,

  linksBox: `mt-4 text-center text-xs md:text-md flex flex-col gap-2 justify-center ${textShadow} font-[Stranger_Things] tracking-wider`,
};
