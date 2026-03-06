import { useState } from "react";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

import background from "../../images/background.png";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // verified by backend
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toastOptions = {
    position: "top-right",
    className: "rb-toast",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
  };

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // safety guard
    setIsSubmitting(true);
    const id = toast.loading("Sending OTP...", toastOptions);
    setLoading(true);
    try {
      await api.post("/auth/forgot", { email });
      setOtpSent(true);
      toast.update(id, {
        render: "OTP sent!",
        type: "success",
        isLoading: false,
        ...toastOptions,
      });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      // 🔥 ADD ONLY THIS
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        toast.dismiss(id);
        navigate("/login");
        return;
      }

      toast.update(id, {
        render: "Incorrect Email",
        type: "error",
        isLoading: false,
        ...toastOptions,
      });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // safety guard
    setIsSubmitting(true);
    const id = toast.loading("Verifying OTP...", toastOptions);
    setLoading(true);
    try {
      const res = await api.post("/auth/verifyOtp", { email, otp });
      if (res.data.isVerified) {
        setIsVerified(true);
        toast.update(id, {
          render: "OTP verified!",
          type: "success",
          isLoading: false,
          ...toastOptions,
        });
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1500);
      } else {
        toast.update(id, {
          render: "Invalid OTP",
          type: "error",
          isLoading: false,
          ...toastOptions,
        });
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1500);
      }
    } catch (err) {
      // 🔥 ADD ONLY THIS
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        toast.dismiss(id);
        navigate("/login");
        return;
      }

      toast.update(id, {
        render: "Error verifying OTP",
        type: "error",
        isLoading: false,
        ...toastOptions,
      });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // safety guard
    setIsSubmitting(true);
    const id = toast.loading("Resetting password...", toastOptions);
    setLoading(true);
    try {
      await api.post("/auth/reset", { email, password });
      toast.update(id, {
        render: "Password reset successfully",
        type: "success",
        isLoading: false,
        ...toastOptions,
      });
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/login");
      }, 1500);
    } catch (err) {
      // 🔥 ADD ONLY THIS
      if (err.response?.status === 407) {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");

        toast.dismiss(id);
        navigate("/login");
        return;
      }

      toast.update(id, {
        render: "Error resetting password",
        type: "error",
        isLoading: false,
        ...toastOptions,
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <Header />

      <form
        className={styles.centerBox}
        onSubmit={
          isVerified
            ? handleResetPassword
            : otpSent
              ? handleVerifyOtp
              : handleSendOtp
        }
      >
        <h1 className={styles.title}>FORGOT PASSWORD</h1>

        {/* EMAIL */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent || loading}
            required
          />
        </div>

        {/* OTP */}
        {otpSent && !isVerified && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>OTP</label>
            <input
              type="text"
              className={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        )}

        {/* NEW PASSWORD */}
        {isVerified && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.input} pr-12`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        <button type="submit" className={styles.sendOtpBtn} disabled={loading}>
          {isVerified ? "RESET PASSWORD" : otpSent ? "VERIFY OTP" : "SEND OTP"}
        </button>

        <div className={styles.linksBox}>
          <p>
            Remember Password?{" "}
            <Link to="/login" className="hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </form>

      <Footer />
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  overlay: "min-h-screen flex flex-col justify-between  text-white",

  centerBox: `flex flex-col items-center justify-center flex-1 px-6 sm:px-0 ${textShadow} font-[Swinging_Wake]`,
  title: `text-4xl sm:text-5xl md:text-6xl tracking-wider mb-8 sm:mb-10 text-center ${textShadow} font-[Swinging_Wake]`,
  inputGroup: "w-full sm:w-[500px] md:w-[650px] sm:mb-4 text-left",
  label: `block mb-2 text-2xl md:text-3xl ${textShadow} font-[Swinging_Wake]`,
  input:
    "w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gray-300/70 text-black outline-none border border-black border-2 sm:border-3 text-sm sm:text-base font-[Stranger_Things]",
  sendOtpBtn: `mt-7 px-10 md:px-15 py-3.5 rounded-2xl bg-gray-400 hover:bg-gray-500/70 text-xl border-black border-2 text-white cursor-pointer ${textShadow} font-[Swinging_Wake] duration-300 tracking-[2px]`,
  linksBox: `mt-4 sm:mt-6 text-center text-sm md:text-md flex flex-col gap-2 ${textShadow} font-[Stranger_Things]`,
};
