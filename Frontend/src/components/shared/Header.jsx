import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import credenzLogo from "../../images/credenzlogo2.png";
import { logout } from "../../utils/auth";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";
import cartIcon from "../../images/cart.png";
import ElectricBorder from "./ElectricBorder";
import pisbLogo from "../../images/pisblogo.png";
import ieeeLogo from "../../images/ieeelogo.png";

import image2 from "../../images/image2.jpg";

const Header = () => {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const profilePicNumber = Number(localStorage.getItem("profilePic"));

  const profileImages = [
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693384/image0_lvxe0k.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693385/image1_eyqcfq.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693386/image5_is1rvv.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693386/image7_b5ozdy.jpg",
    "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693387/image8_zdlz7c.jpg",
  ];

  const profileImage =
    typeof profilePicNumber === "number" && profileImages[profilePicNumber]
      ? profileImages[profilePicNumber]
      : image2;

  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) {
        setCartItemCount(0);
        return;
      }

      try {
        const response = await api.get("/cart");
        const cartItems = response.data?.cartItems || [];
        setCartItemCount(cartItems.length);
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
        setCartItemCount(0);
      }
    };

    fetchCartCount();

    const interval = setInterval(fetchCartCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]); // Refetch when route changes

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
    }
  };

  return (
    <header className={styles.topBar}>
      <Link to="/" onClick={handleLogoClick}>
        <img src={credenzLogo} alt="Credenz Logo" className={styles.logoLeft} />
      </Link>

      <div className={styles.menuContainer}>
        {isAuthenticated && (
          <div className={styles.userActions}>
            <div className={styles.cartWrapper}>
              <img
                src={cartIcon}
                alt="Cart"
                className={styles.cartIcon}
                onClick={() => navigate("/cart")}
              />
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </div>
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profileCircle}
              onClick={() => navigate("/profile")}
            />
          </div>
        )}

        <button
          className={styles.menuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          MENU
        </button>

        {isMenuOpen && (
          <div
            className={styles.dropdownOverlay}
            onClick={() => setIsMenuOpen(false)}
          >
            <ElectricBorder
              color="#ff8080"
              speed={0.4}
              chaos={0.2}
              style={{ borderRadius: 16 }}
            >
              <div
                className={styles.menuContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsMenuOpen(false)}
                >
                  &times;
                </button>

                {/* MENU HEADING */}
                <h2 className="text-center text-2xl md:text-4xl mb-6 tracking-widest font-[Swinging_Wake]">
                  MENU
                </h2>

                {[
                  ["Home", "/"],
                  ["Events", "/events"],
                  ["Our Sponsors", "/sponsors"],
                  ["About Us", "/about-us"],
                  ["Contact Us", "/contact-us"],
                ].map(([label, path]) => {
                  const isActive = location.pathname === path;

                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`${styles.menuItem} group`}
                    >
                      <span
                        className={`absolute left-12 md:left-20 transition
                          ${
                            isActive
                              ? "opacity-100 text-white"
                              : "opacity-0 group-hover:opacity-100"
                          }
                        `}
                      >
                        ▶
                      </span>
                      {label}
                    </Link>
                  );
                })}

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${styles.menuItem} group`}
                  >
                    <span
                      className={`absolute left-12 md:left-20 transition
                        ${
                          location.pathname === "/login"
                            ? "opacity-100 text-white"
                            : "opacity-0 group-hover:opacity-100"
                        }
                      `}
                    >
                      ▶
                    </span>
                    Login
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleLogout}
                      className={`${styles.menuItem} group`}
                    >
                      <span className="absolute left-12 md:left-20 opacity-0 group-hover:opacity-100 transition">
                        ▶
                      </span>
                      Logout
                    </button>
                  </>
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
      </div>
    </header>
  );
};

const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  topBar: `
    fixed top-0 left-0 w-full z-50
    flex justify-between items-center
    px-4 sm:px-8 py-4
  `,
  logoLeft: "h-10 sm:h-14 drop-shadow-[0_0_4px_white]",
  profileCircle: `
    w-7 h-7 md:w-10 md:h-10 rounded-full object-cover cursor-pointer border-2 border-red-600
    shadow-[0_0_6px_red] transition-transform hover:scale-105
  `,
  menuBtn: `bg-gray-500 hover:bg-gray-600 px-4 sm:px-6 py-2 rounded-xl text-white cursor-pointer border-black border-2 sm:border-3 text-sm sm:text-base ${textShadow} transition-all font-[Swinging_Wake]`,
  menuContainer: "flex items-center gap-4",
  dropdownOverlay: `
    fixed inset-0 bg-black/70 z-50
    flex items-center justify-center
    backdrop-blur-sm
  `,
  menuContent: `
    relative bg-black rounded-xl border-2 border-black shadow-2xl
    min-w-[280px] md:min-w-[400px] py-6 flex flex-col shadow-[0_0_12px_red]
  `,
  userActions: "flex items-center gap-5 md:gap-6 md:mr-2",
  cartWrapper: "relative",
  cartIcon:
    "h-6 w-6 md:h-8 md:w-8 cursor-pointer hover:scale-105 transition invert",
  cartBadge: `
    absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold
    rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center
    shadow-[0_0_6px_red] border border-white font-[Stranger_Things]
  `,
  menuItem: `
    relative block w-full text-center px-6 py-2 md:py-1.5
    text-gray-300 transition-all cursor-pointer
    text:md md:text-xl ${textShadow} font-[Stranger_Things]
    hover:text-red-900
  `,
  closeBtn: `
    absolute top-0 right-0 -translate-x-1/2
    text-red-500 text-4xl md:text-5xl font-bold cursor-pointer
    hover:text-red-700 transition-all
  `,
};

export default Header;
