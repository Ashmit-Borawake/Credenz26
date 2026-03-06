import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import FireParticles from "./components/landing/FireParticles/FireParticles";
import background from "./images/background.png";
import { Analytics } from "@vercel/analytics/react";

// Landing Page2
import LandingPage from "./pages/landing/LandingPage";

// Lazy load main pages for better initial load time
const Login = lazy(() => import("./pages/main/Login"));
const Signup = lazy(() => import("./pages/main/Signup"));
const ForgotPassword = lazy(() => import("./pages/main/ForgotPassword"));
const ContactUs = lazy(() => import("./pages/main/ContactUs"));
const Sponsors = lazy(() => import("./pages/main/Sponsors"));
const Cart = lazy(() => import("./pages/main/Cart"));
const AboutUs = lazy(() => import("./pages/main/AboutUs"));
const Profile = lazy(() => import("./pages/main/Profile"));
const Event = lazy(() => import("./pages/main/Event"));
const EventDetail = lazy(() => import("./pages/main/EventDetail"));
const Member = lazy(() => import("./pages/main/Member"));
const Checkout = lazy(() => import("./pages/main/Checkout"));
const WebTeam = lazy(() => import("./pages/main/WebTeam"));

// Protected Route
import ProtectedRoute from "./context/ProtectedRoute";

// Persistent Landing - keeps Canvas in memory
function PersistentLanding() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Always render the landing page but hide it when on other pages
  // This keeps the 3D models in GPU memory for instant return
  return (
    <div
      style={{
        position: isLandingPage ? "relative" : "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: isLandingPage ? 1 : -1,
        visibility: isLandingPage ? "visible" : "hidden",
        pointerEvents: isLandingPage ? "auto" : "none",
      }}
    >
      <LandingPage isVisible={isLandingPage} />
    </div>
  );
}

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isMdUp, setIsMdUp] = useState(window.innerWidth >= 1536);

  useEffect(() => {
    const handleResize = () => {
      setIsMdUp(window.innerWidth >= 1536);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
      <Analytics />

      {/* Persistent Landing Page - always mounted */}
      <PersistentLanding />

      {/* Background and Fire Particles for non-landing pages */}
      {!isLandingPage && (
        <>
          {/* Background */}
          <div
            className="fixed inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${background})`,
              backgroundAttachment: "fixed",
              backgroundColor: "#000",
              backgroundSize: isMdUp ? "105% auto" : "cover",
              zIndex: 0,
            }}
          />

          {/* Fire Particles Background Effect - Covers entire page */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <Canvas
              camera={{ position: [0, 0, 30], fov: 75 }}
              gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
              }}
            >
              <FireParticles
                position={[0, -15, 0]}
                planeWidth={90}
                planeDepth={90}
                height={50}
                particleCount={500}
                particleSize={0.5}
                speed={0.07}
              />
            </Canvas>
          </div>
        </>
      )}

      {/* Other Routes - only render when not on landing page */}
      {!isLandingPage && (
        <div
          className="min-h-svh w-full text-white pt-8 md:pt-0 overflow-x-hidden relative bg-black/20"
          style={{ zIndex: 2 }}
        >
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Pages */}
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/web-team" element={<WebTeam />} />
            <Route path="/member" element={<Member />} />

            {/* Events */}
            <Route path="/events" element={<Event />} />
            <Route path="/events/:eventName" element={<EventDetail />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
