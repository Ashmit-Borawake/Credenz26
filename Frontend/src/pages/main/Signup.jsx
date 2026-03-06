import { useState } from "react";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import background from "../../images/background.png";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [year, setYear] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //==============================================================
    // toast.info("Registrations are temporarily disabled", {
    //   className: "rb-toast-error",
    // });
    // return;
    //==============================================================

    if (isSubmitting) return; // safety guard
    setIsSubmitting(true);

    // 🔹 Helper to get trimmed input value
    const getTrimmedValue = (name) => {
      return e.target[name]?.value.trim() || "";
    };

    // 🔹 Check for spaces in any input field (after trim)
    const formElements = e.target.elements;
    const fieldsWithSpaces = [];

    const fieldsToCheck = [
      { name: "username", label: "Username" },
      { name: "firstName", label: "First Name" },
      { name: "lastName", label: "Last Name" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone Number" },
      { name: "password", label: "Password" },
    ];

    for (const field of fieldsToCheck) {
      const value = getTrimmedValue(field.name);

      if (value.includes(" ")) {
        fieldsWithSpaces.push(field.label);
      }
    }

    if (fieldsWithSpaces.length > 0) {
      const message =
        fieldsWithSpaces.length === 1 ? (
          `${fieldsWithSpaces[0]} cannot contain spaces`
        ) : (
          <div className="flex flex-col gap-1">
            <div>The following fields cannot contain spaces:</div>
            {fieldsWithSpaces.map((field, i) => (
              <div key={i}>• {field}</div>
            ))}
          </div>
        );

      toast.error(message, {
        autoClose: 3000,
        className: "rb-toast-error",
      });

      setIsSubmitting(false);
      return;
    }

    // 🔹 Form data with trimmed values
    const formData = {
      user: {
        username: getTrimmedValue("username"),
        firstName: getTrimmedValue("firstName"),
        lastName: getTrimmedValue("lastName"),
        email: getTrimmedValue("email").toLowerCase(),
        phoneNumber: getTrimmedValue("phone"),
        collegeName: getTrimmedValue("college"),
        password: getTrimmedValue("password"),
        isJunior: year,
      },
    };

    const toastId = toast.loading("Registering user...", {
      className: "rb-toast-success",
    });

    try {
      await api.post("/auth/signup", formData);

      toast.update(toastId, {
        render: "Registration successful",
        type: "success",
        isLoading: false,
        autoClose: 1500,
        className: "rb-toast-success",
      });

      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/login");
      }, 1500);
    } catch (err) {
      let message = "Registration failed";

      const data = err?.response?.data;

      // 🔹 Simple validation error
      if (typeof data?.error === "string") {
        message = data.error;
      }

      // 🔹 Duplicate field errors
      const fields = data?.fields;

      if (Array.isArray(fields)) {
        const msgs = [];

        const username = getTrimmedValue("username");
        const email = getTrimmedValue("email");
        const phone = getTrimmedValue("phone");

        if (fields.includes(username)) {
          msgs.push("Username already exists");
        }

        if (fields.includes(email)) {
          msgs.push("Email already exists");
        }

        if (fields.includes(phone)) {
          msgs.push("Phone number already exists");
        }

        if (msgs.length > 0) {
          message = (
            <div className="flex flex-col gap-1">
              {msgs.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </div>
          );
        }
      }

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        className: "rb-toast-error",
      });

      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.overlay}>
      <Header />
      <form className={styles.centerBox} onSubmit={handleSubmit}>
        <h1 className={styles.title}>REGISTER</h1>

        <div className={styles.formGrid}>
          <div className="order-1 md:order-1">
            <Input
              label="Username"
              name="username"
              minLength={2}
              maxLength={20}
              helper="Username must be 2–20 characters"
            />
          </div>

          <div className="order-3 md:order-3">
            <Input label="Last Name" name="lastName" />
          </div>

          <div className="order-5 md:order-5">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              helper="Phone number must be exactly 10 digits"
            />
          </div>

          <div className="order-7 md:order-7">
            <PasswordInput
              label="Password"
              name="password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="order-2 md:order-2">
            <Input label="First Name" name="firstName" />
          </div>

          <div className="order-4 md:order-4">
            <Input label="Email" name="email" type="email" />
          </div>

          <div className="order-6 md:order-6">
            <Input label="College Name" name="college" />
          </div>

          <div className="order-8 md:order-8 mx-auto md:mx-0">
            <div className={`${styles.inputGroup} sm:mt-9`}>
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={year !== true}
                  onChange={(e) => setYear(e.target.checked ? false : true)}
                  className="hidden"
                />
                <div
                  className={`w-13 h-13 rounded-md border-2 flex items-center justify-center
                    ${
                      year ? "bg-red-600 shadow-[0_0_12px_red]" : "bg-gray-300"
                    }`}
                >
                  {year && <span className="text-white font-bold">✓</span>}
                </div>

                <span
                  className={`text-base sm:text-lg ${textShadow}  font-[Swinging_Wake]`}
                >
                  Are you FY / SY?
                </span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.registerBtn}>
          REGISTER
        </button>

        <div className={styles.linksBox}>
          <p>
            Already registered?{" "}
            <Link to="/login" className="hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>

      <Footer />
    </div>
  );
}

const Input = ({
  label,
  name,
  type = "text",
  pattern,
  helper,
  maxLength,
  minLength,
}) => (
  <div className={styles.inputGroup}>
    <label className={styles.label}>{label}</label>

    <input
      type={type}
      name={name}
      className={`${styles.input} peer`}
      pattern={pattern}
      minLength={minLength}
      maxLength={maxLength}
      required
    />

    {helper && (
      <p className="mt-1 text-sm text-red-400 peer-valid:hidden">{helper}</p>
    )}
  </div>
);

const PasswordInput = ({ label, name, show, toggle }) => {
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          className={`${styles.input} pr-12`}
          minLength={6}
          maxLength={10}
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* Shows only when password is empty OR doesn't meet length requirements */}
      {(passwordValue.length === 0 ||
        passwordValue.length < 6 ||
        passwordValue.length > 10) && (
        <p className="mt-1 text-sm text-red-400">
          Password must be 6–10 characters
        </p>
      )}
    </div>
  );
};

const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  overlay: "pt-[80px] pb-[72px]  text-white overflow-hidden",
  centerBox:
    "flex flex-col items-center justify-center px-6 min-h-[calc(100vh-152px)]",

  title: `text-4xl sm:text-5xl md:text-6xl mb-5 ${textShadow} font-[Swinging_Wake]`,

  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl",

  inputGroup: "",

  label: `block mb-2 text-lg md:text-xl ${textShadow} font-[Swinging_Wake]`,

  input:
    "w-full px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gray-300/70 text-black outline-none border border-black border-2 text-base font-[Stranger_Things] tracking-wider",

  eyeBtn:
    "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700",

  registerBtn: `mt-7 px-16 py-3.5 rounded-2xl bg-gray-400 hover:bg-gray-500/70 text-xl border-black border-2 text-white cursor-pointer ${textShadow} font-[Swinging_Wake] duration-300`,

  linksBox: `mt-4 text-center text-xs md:text-md flex flex-col gap-1 ${textShadow} font-[Stranger_Things] tracking-wider`,
};
