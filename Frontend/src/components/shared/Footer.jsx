import React from "react";
import { Link } from "react-router-dom";
import pisbLogo from "../../images/pisblogo.png";
import ieeeLogo from "../../images/ieeelogo.png";
import instagram from "../../images/instagram.png";
import facebook from "../../images/facebook.png";
import linkedin from "../../images/linkedin.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <a
          href="https://www.ieee.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={ieeeLogo} alt="IEEE" className="h-3 md:h-4 lg:h-6" />
        </a>
        <a
          href="https://pictieee.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={pisbLogo} alt="PISB" className="h-3 md:h-4 lg:h-6" />
        </a>
      </div>

      <div className={styles.footerCenter}>
        DESIGNED AND DEVELOPED BY :{" "}
        <Link
          to="/web-team"
          style={{ letterSpacing: "2px" }}
          className="font-bold hover:underline underline-offset-4 transition-all duration-200"
        >
          <b>WEB TEAM</b>
        </Link>
      </div>

      <div className={styles.footerRight}>
        <a
          href="https://www.instagram.com/pictieee/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagram}
            alt="Instagram"
            className="h-5 md:h-7 cursor-pointer hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          />
        </a>
        <a
          href="https://www.facebook.com/pictieee/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={facebook}
            alt="Facebook"
            className="h-5 md:h-7 cursor-pointer hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          />
        </a>
        <a
          href="https://in.linkedin.com/company/pisbieee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={linkedin}
            alt="LinkedIn"
            className="h-5 md:h-7 cursor-pointer hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          />
        </a>
      </div>
    </footer>
  );
};

const textShadow =
  "text-shadow-[0_0_4px_black,0_0_4px_black,0_0_4px_black,0_0_4px_black]";

const styles = {
  footer: `
  fixed bottom-0 left-0 w-full
  bg-gray-600/50 
  backdrop-blur-md
  px-4 sm:px-8 
  py-2 md:py-3 
  flex items-center justify-between
  text-sm
  lg:flex-row
  z-50
`,

  footerLeft: "hidden lg:flex items-center gap-2 sm:gap-4",

  footerCenter: `text-left text-white tracking-widest text-[9px] md:text-sm text-normal font-[Swinging_Wake] ${textShadow} `,
  footerRight: "flex items-center gap-2 sm:gap-4",
};

export default Footer;
