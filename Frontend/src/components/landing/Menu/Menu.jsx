import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import api from "../../../utils/api";
import { logout } from "../../../utils/auth";
import ElectricBorder from "../../shared/ElectricBorder";
import pisbLogo from "../../../images/pisblogo.png";
import ieeeLogo from "../../../images/ieeelogo.png";
import credenzLogo from "../../../images/credenzlogo2.png";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        ".menu-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        ".menu-box",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
      closeMenu();
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Our Sponsors", path: "/sponsors" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact Us", path: "/contact-us" },
  ];

  const textShadow =
    "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* Top Bar - matching Header.jsx styling3 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 py-4 pointer-events-auto">
        {/* Credenz Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
        >
          <img
            src={credenzLogo}
            alt="Credenz Logo"
            className="h-10 sm:h-14 drop-shadow-[0_0_4px_white]"
          />
        </Link>

        {/* Menu Button */}
        <button
          onClick={isOpen ? closeMenu : openMenu}
          className={`bg-gray-500 hover:bg-gray-600 px-4 sm:px-6 py-2 rounded-xl text-white cursor-pointer border-black border-2 sm:border-3 text-sm sm:text-base ${textShadow} transition-all font-[Swinging_Wake]`}
        >
          MENU
        </button>
      </header>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="menu-overlay fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 pointer-events-auto"
          onClick={handleOverlayClick}
        >
          <ElectricBorder
            color="#ff8080"
            speed={0.4}
            chaos={0.2}
            style={{ borderRadius: 16 }}
          >
            <div className="menu-box relative bg-black rounded-xl border-2 border-black min-w-70 md:min-w-100 py-6 flex flex-col shadow-[0_0_12px_red]">
              {/* Close Button */}
              <button
                onClick={closeMenu}
                className="absolute top-0 right-0 -translate-x-1/2 text-red-500 text-4xl md:text-5xl font-bold cursor-pointer hover:text-red-700 transition-all"
              >
                &times;
              </button>

              {/* MENU HEADING */}
              <h2 className="text-center text-white text-2xl md:text-4xl mb-6 tracking-widest font-[Swinging_Wake]">
                MENU
              </h2>

              {/* Menu Items */}
              {menuItems.map(({ label, path }) => {
                const isActive = location.pathname === path;

                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    className={`relative block w-full text-center px-6 py-2 md:py-1.5 text-gray-300 transition-all cursor-pointer text-md md:text-xl ${textShadow} font-[Stranger_Things] hover:text-red-900 group`}
                  >
                    <span
                      className={`absolute left-12 transition ${
                        isActive
                          ? "opacity-100 text-white"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      ▶
                    </span>
                    {label}
                  </Link>
                );
              })}

              {/* Login/Logout */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`relative block w-full text-center px-6 py-2 md:py-1.5 text-gray-300 transition-all cursor-pointer text-md md:text-xl ${textShadow} font-[Stranger_Things] hover:text-red-900 group`}
                >
                  <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition">
                    ▶
                  </span>
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className={`relative block w-full text-center px-6 py-2 md:py-1.5 text-gray-300 transition-all cursor-pointer text-md md:text-xl ${textShadow} font-[Stranger_Things] hover:text-red-900 group`}
                >
                  <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition">
                    ▶
                  </span>
                  Logout
                </button>
              )}

              {/* Mobile-only footer logos */}
              <div className="mt-8 flex justify-between px-10 md:hidden">
                <a
                  href="https://pictieee.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={pisbLogo} alt="PICT IEEE" className="h-6" />
                </a>
                <a
                  href="https://www.ieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={ieeeLogo} alt="IEEE" className="h-6" />
                </a>
              </div>
            </div>
          </ElectricBorder>
        </div>
      )}
    </>
  );
};

export default Menu;
