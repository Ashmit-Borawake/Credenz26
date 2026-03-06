import React from "react";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import { GoDotFill } from "react-icons/go";
import { useState } from "react";

import credenzLogo from "../../images/credenzlogo2.png";

import linkedin from "../../images/linkedin.png";
import github from "../../images/github.png";
import instagram from "../../images/instagram.png";

const AboutUs = () => {
  const infoSlides = [
    {
      image: credenzLogo,
      title: "CREDENZ 2026",
      link: "https://credenz.co.in/",
      points: [
        "Credenz, organized by PICT IEEE Student Branch since 2004, is Pune's premier technical fest.",
        "It provides students opportunities to showcase their talents beyond academics.",
      ],
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693112/pictieee26_qvwdab.jpg",
      title: "PICT IEEE STUDENT BRANCH (PISB)",
      link: "https://pictieee.in/",
      points: [
        "Founded in 1988, PICT IEEE Student Branch (PISB) aims to foster technical awareness.",
        "PISB organizes Credenz in even semesters and Credenz Tech Dayz in odd semesters.",
      ],
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693090/ping_brru9k.png",
      title: "PICT IEEE NEWSLETTER GROUP (P.I.N.G.)",
      link: "https://pictieee.in/ping",
      points: [
        "P.I.C.T. IEEE Newsletter Group (P.I.N.G.) is an annual technical magazine by PISB.",
        "It features articles on cutting-edge technologies and interviews with industry experts.",
      ],
    },
  ];

  const adminTeam = [
    // Vice Chairperson
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693279/Rashmi_tsak9d.jpg",
      name: "Rashmi Abhyankar",
      role: "Vice Chairperson",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/rashmiabhyankar?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        github: "https://github.com/Rashmi-05",
        instagram:
          "https://www.instagram.com/rashmiabhyankar05?igsh=dGVxcjRoeGp1bW14",
      },
    },

    // Joint Secretaries (all)
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693284/Shlok_wdrb3r.jpg",
      name: "Shlok Sangamnerkar",
      role: "Joint Secretary, Technical",
      socials: {
        linkedin: "https://www.linkedin.com/in/shlok-sangamnerkar/",
        github: "https://github.com/Vic710",
        instagram: "https://www.instagram.com/shlok.doing.stuff/",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693184/Akanksha_eok8ou.jpg",
      name: "Akanksha Bhagwat",
      role: "Joint Secretary, Permissions and Publicity",
      socials: {
        linkedin: "www.linkedin.com/in/akanksha-bhagwat-b86390287",
        github: "https://github.com/akshu55555",
        instagram:
          "https://www.instagram.com/akankshabhagwat_?igsh=ZnZua2c0ZDJldzV1&utm_source=qr",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769955465/Rutuj_xdqoy4.jpg",
      name: "Rutuj Desale",
      role: "Joint Secretary, Finance and Marketing, B-Plan Event Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/rutuj-desale-149694293",
        github: "https://github.com/Rutuj-Desale",
        instagram: "https://www.instagram.com/rutujdesale/",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693196/Ashmit_xg0p5k.jpg",
      name: "Ashmit Borawake",
      role: "Vice Treasurer",
      socials: {
        linkedin: "https://www.linkedin.com/in/ashmit-borawake-7a8641290/",
        github: "https://github.com/Ashmit-Borawake",
        instagram: "https://instagram.com/ashmit_b_03/",
      },
    },

    // Marketing Heads
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693286/Sanket_nmwjoi.jpg",
      name: "Sanket Kulkarni",
      role: "Marketing Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/sanket-kulkarni-4167862b4/",
        github: "https://github.com/sanket-kulkarni-05",
        instagram:
          "https://www.instagram.com/sanket_kulkarni_05?igsh=MXM1a3h6d3pzMHZpaA==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693184/Aabha_gwvoji.jpg",
      name: "Aabha Jog",
      role: "Marketing Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/aabha-jog-68aa162b2/",
        github: "https://github.com/aabha25",
        instagram: "https://www.instagram.com/aabhaj25",
      },
    },

    // PRO
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693204/Hazel_d7hucd.jpg",
      name: "Hazel Rodrigues",
      role: "Public Relations Officer",
      socials: {
        linkedin: "https://www.linkedin.com/in/rodrigues-hazel",
        github: "https://github.com/hazelr1",
        instagram:
          "https://www.instagram.com/_hazelrodrigues_?igsh=MW0wbDkwa3J6azZmcg==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693383/Ved_tpq7ma.jpg",
      name: "Ved Deshpande",
      role: "Public Relations Officer,Domain Head(ML)",
      socials: {
        linkedin: "https://www.linkedin.com/in/ved-deshpande-a632b7282",
        github: "https://github.com/VED045",
        instagram: "https://www.instagram.com/ved_045",
      },
    },

    // Design Heads
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693278/Diksha_h12klf.jpg",
      name: "Diksha Vinod Gidwani",
      role: "Design Head",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/dikshaa-gidwani?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "",
        instagram:
          "https://www.instagram.com/dikshaagidwani_?igsh=MzRqdjdyeW1la29p",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693184/Antara_iyxumx.jpg",
      name: "Antara Surkule",
      role: "Design Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/antarasurkule/",
        github: "https://github.com/antara965",
        instagram: "https://www.instagram.com/_.an_tara._96/",
      },
    },

    // Social Media
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693295/Srujan_xtse1n.jpg",
      name: "Srujan Wavhal",
      role: "Social Media Manager",
      socials: {
        linkedin: "http://www.linkedin.com/in/srujan-wavhal-453164284",
        github: "https://github.com/Srujan7109",
        instagram:
          "https://www.instagram.com/srujan_107?igsh=MTNyamZlN2xmOXE3eg==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693314/Gargi_umm7wz.jpg",
      name: "Gargi Rahane",
      role: "Social Media Manager, Web Weaver Event Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/gargirahane/",
        github: "https://github.com/gargii21",
        instagram: "https://www.instagram.com/gargirahane/",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693276/Pratik_wsij9y.webp",
      name: "Pratik Kochare",
      role: "Social Media Manager",
      socials: {
        linkedin: "https://www.linkedin.com/in/pratik-kochare-91534b281",
        github: "https://github.com/thepratikpk",
        instagram: "https://www.instagram.com/thecine.man_/",
      },
    },

    // Management & Strategy
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693264/Nupoor_boaw5j.jpg",
      name: "Nupoor Joshi",
      role: "Management & Strategy Head, PING Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/nupoor-joshi-b9795a301/",
        github: "https://github.com/nupoorjoshi23",
        instagram:
          "https://www.instagram.com/nupoorjoshi2305?igsh=azdkOHNveHN6eGt2&utm_source=qr",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693186/Ayush_ia0efn.jpg",
      name: "Ayush Changle",
      role: "Management & Strategy Head, B-Plan Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/ayush-changle-7889a1236/",
        github: "https://github.com/Ayush180205",
        instagram:
          "https://www.instagram.com/ayush.changle?igsh=MWw3c29wM2NxNGIyeg==",
      },
    },
  ];

  const techTeam = [
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693231/Maitreya_hb0vm6.jpg",
      name: "Maitreya Vaidya",
      role: "Tech Head, MergeConflict Event Head",
      socials: {
        linkedin: "https://linkedin.com/in/maitreya-vaidya-33721731a/",
        github: "https://github.com/maitreya-16",
        instagram: "https://instagram.com/___maitreya___16",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693186/Ashwin_anr2w3.jpg",
      name: "Ashwin Ketkar",
      role: "Tech Head, R&D Head, WallStreet Event Head",
      socials: {
        linkedin: "https://linkedin.com/in/ashwin-ketkar-8a8a382a0",
        github: "https://github.com/ashkett",
        instagram: "https://www.instagram.com/ashwinketkar/#",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693268/Anushree_nxuxfn.jpg",
      name: "Anushree Kamath",
      role: "Webmaster, NTH Event Head, PING Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/anushreekamath04",
        github: "https://github.com/siriuslycoding",
        instagram: "https://www.instagram.com/kamathanushree",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693303/Swayam_fxlold.jpg",
      name: "Swayam Gosavi",
      role: "Webmaster, RC Event Head",
      socials: {
        linkedin: "https://linkedin.com/in/infinity1410",
        github: "https://github.com/theinfinity1410",
        instagram:
          "https://www.instagram.com/__.swayam._1410?igsh=MWxvdzV4OXZ0am5oZg==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693226/Mahesh_qbnhpk.jpg",
      name: "Mahesh Baviskar",
      role: "Domain Head(App)",
      socials: {
        linkedin: "https://www.linkedin.com/in/mahesh-baviskar-449374291",
        github: "https://github.com/BaviskarMahesh",
        instagram: "https://www.instagram.com/mahesh_22kar",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693202/Harshad_vhrfuy.jpg",
      name: "Harshad Karle",
      role: "DataWiz Event Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/harshadkarle1305",
        github: "https://github.com/harshad-k-135",
        instagram:
          "https://www.instagram.com/harshad.k.135?igsh=MXJwdm0yc2lmaDFlcQ==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693246/Harshal_bdcxos.jpg",
      name: "Harshal Belgamwar",
      role: "MergeConflict Event Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/harshal-belgamwar/",
        github: "https://github.com/Harshal-belgamwar",
        instagram:
          "https://www.instagram.com/harshalbelgamwar?igsh=NmQ5eGFlNnI0eDRw",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693206/Karan_ubypas.jpg",
      name: "Karan Mittal",
      role: "NTH Event Head",
      socials: {
        linkedin: "https://www.linkedin.com/in/karanmittaldev",
        github: "https://github.com/karan-mittal06",
        instagram: "https://www.instagram.com/karanmittal7303",
      },
    },
    {
      name: "Malhar Inamdar",
      role: "R&D Head, Tech Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693307/Malhar_ui5gnn.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/malhar-inamdar/",
        github: "https://github.com/malharinamdar",
        instagram: "https://www.instagram.com/malhar.inamdar/",
      },
    },
    {
      name: "Ansh Shah",
      role: "Roboliga Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693184/Ansh_ms1618.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/ansh-shah5",
        github: "https://github.com/Ansh-shah5",
        instagram: "https://www.instagram.com/ansh_shahh",
      },
    },
    {
      name: "Sanavi Kulkarni",
      role: "RC Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693319/Sanavi_oxqufe.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/sanavikulkarni/",
        github: "https://github.com/Sanavi05",
        instagram: "https://www.instagram.com/sanavi1708/",
      },
    },
    {
      name: "Siddharth Bhole",
      role: "Cretronix Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693290/Siddharth_wt0fxv.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/siddharth-bhole-54a4b9270/",
        github: "https://github.com/siddharth11010",
        instagram: null,
      },
    },
    {
      name: "Bhavika Panpalia",
      role: "Domain Head(ML), Roboliga Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693276/Bhavika_huv7gq.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/bhavika-panpalia-11a027284",
        github: "https://github.com/bhavika-304",
        instagram: "https://www.instagram.com/p/DGS_tqmzWF2D_Jhe0q",
      },
    },
    {
      name: "Shravan Upadhye",
      role: "Web Weaver Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693296/Shravan_li2z0y.jpg",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/shravan-upadhye?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "https://github.com/shrvan30",
        instagram: "https://www.instagram.com/shrvanupadhye/",
      },
    },
    {
      name: "Rishabh Sharma",
      role: "Enigma Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693304/Rishab_mwdbcz.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/rishabh-sharma-383a81282/",
        github: "https://github.com/Rishabh-0615",
        instagram: "https://www.instagram.com/rishabh.0615/",
      },
    },
    {
      name: "Chaitanya Shingate",
      role: "Cretronix Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693200/Chaitanya_bletkh.jpg",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/chaitanya-shingate-3081952a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: null,
        instagram:
          "https://www.instagram.com/shingate.chaitanya?igsh=MTNtOHducnBtanJwdg==",
      },
    },
    {
      name: "Darshan Wagh",
      role: "Domain Head(CP), WallStreet Event Head, Enigma Event Head",
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693200/Darshan_hgimhz.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/in/darshan-wagh-a1465b273/",
        github: "https://github.com/ninjadoesquantfr",
        instagram: "https://www.instagram.com/darshan_.wagh",
      },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? infoSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === infoSlides.length - 1 ? 0 : prev + 1));
  };

  const handleCheckout = () => {
    window.open(infoSlides[currentIndex].link, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between  text-white">
      <Header />

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-15 md:mt-25 mb-20 gap-5">
        {/* PAGE HEADING */}
        <h1
          className="text-[40px] sm:text-[50px] md:text-[60px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          ABOUT <span className="pl-5">US</span>
        </h1>

        {/* INFO BOX */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-15 w-full md:px-5">
          {/* LEFT ARROW (desktop only) */}
          <div
            className="hidden md:block text-[90px] lg:text-[120px] font-bold text-[#8B8B8B] select-none cursor-pointer hover:scale-105 duration-300"
            onClick={prevSlide}
          >
            &lt;
          </div>

          {/* MAIN BOX */}
          <div className="w-full sm:w-[95%] md:w-[85%] lg:w-[90%] max-w-255 bg-black/70 border-3 md:border-5 border-[#8B8B8B] rounded-[20px] px-4 sm:px-10 lg:px-25 py-8 sm:py-10 lg:py-12 text-center">
            {/* IMAGE + MOBILE ARROWS */}
            <div className="flex items-center justify-center gap-6 mb-6 md:mb-8">
              {/* LEFT ARROW (mobile) */}
              <div
                className="md:hidden text-[60px] font-bold text-[#8B8B8B] select-none cursor-pointer hover:scale-105 duration-300"
                onClick={prevSlide}
              >
                &lt;
              </div>

              {/* IMAGE */}
              <img
                src={infoSlides[currentIndex].image}
                alt="About Slide"
                className="w-32 h-22 sm:w-50 sm:h-40 lg:w-85 lg:h-50 object-contain drop-shadow-[0_0_8px_white]"
              />

              {/* RIGHT ARROW (mobile) */}
              <div
                className="md:hidden text-[60px] font-bold text-[#8B8B8B] select-none cursor-pointer hover:scale-105 duration-300"
                onClick={nextSlide}
              >
                &gt;
              </div>
            </div>

            {/* TITLE */}
            <h2
              className="text-[20px] sm:text-[25px] lg:text-[40px] mb-4 sm:mb-6 tracking-widest"
              style={{ fontFamily: "Swinging Wake" }}
            >
              {infoSlides[currentIndex].title}
            </h2>

            {/* DESCRIPTION */}
            <div
              className="text-[13px] sm:text-[18px] lg:text-[22px] leading-7 sm:leading-9 lg:leading-10.5 text-left mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-5"
              style={{ fontFamily: "Stranger Things", fontWeight: "700" }}
            >
              {infoSlides[currentIndex].points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <GoDotFill className="mt-2 shrink-0" />
                  <p>{point}</p>
                </div>
              ))}
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={handleCheckout}
              className="px-8 sm:px-8 py-2.5 sm:py-3 rounded-[18px] bg-[#8B8B8B] text-white border-3 border-black shadow-inner hover:scale-105 duration-300 text-[16px] md:text-[25px] cursor-pointer tracking-[2px]"
              style={{
                fontFamily: "Swinging Wake",
                textShadow:
                  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              }}
            >
              CHECKOUT
            </button>
          </div>

          {/* RIGHT ARROW (desktop only) */}
          <div
            className="hidden md:block text-[90px] lg:text-[120px] font-bold text-[#8B8B8B] select-none cursor-pointer hover:scale-105 duration-300"
            onClick={nextSlide}
          >
            &gt;
          </div>
        </div>

        <h1
          className="text-[40px] md:text-[60px] font-normal text-center my-8"
          style={{ fontFamily: "Swinging Wake" }}
        >
          ADMIN <span className="pl-5">TEAM</span>
        </h1>

        {/* ADMIN TEAM */}
        <div
          className="w-full flex flex-wrap justify-center items-stretch
                          gap-x-[clamp(20px,10vw,160px)]
                          gap-y-[clamp(20px,8vw,100px)] px-5"
        >
          {adminTeam.map((member, index) => (
            <div
              key={index}
              className="bg-black/90 border-3 border-[#8B8B8B] rounded-[10px] py-4 w-64 sm:w-72 md:w-64 lg:w-65 xl:w-65 text-center hover:scale-105 duration-400 hover:shadow-2xl"
            >
              {/* Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-54 sm:w-62 md:w-54 lg:w-50 xl:w-56 h-60 object-cover rounded-md mx-auto mb-3"
              />

              {/* SOCIAL ICONS */}
              <div className="flex justify-center items-center gap-5 mb-3">
                <a href={member.socials.linkedin} target="_blank">
                  <img
                    src={linkedin}
                    alt="LinkedIn"
                    className="w-7 h-7 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.github} target="_blank">
                  <img
                    src={github}
                    alt="github"
                    className="w-6 h-6 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.instagram} target="_blank">
                  <img
                    src={instagram}
                    alt="Instagram"
                    className="w-7 h-7 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
              </div>

              {/* Name */}
              <p
                className="sm:text-3xl md:text-3xl lg:text-2xl xl:text-xl tracking-wide font-bold, "
                style={{ fontFamily: "Swinging Wake" }}
              >
                {member.name}
              </p>

              {/* Position */}
              <p
                className="text-sm tracking-wide mt-1 px-3"
                style={{ fontFamily: "Stranger Things" }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>

        <h1
          className="text-[40px] md:text-[60px] font-normal text-center my-8"
          style={{ fontFamily: "Swinging Wake" }}
        >
          TECH <span className="pl-5">TEAM</span>
        </h1>

        {/* TECH TEAM */}
        <div
          className="w-full flex flex-wrap justify-center items-stretch
                          gap-x-[clamp(20px,10vw,160px)]
                          gap-y-[clamp(20px,8vw,100px)] px-5"
        >
          {techTeam.map((member, index) => (
            <div
              key={index}
              className="bg-black/90 border-3 border-[#8B8B8B] rounded-[10px] py-4 w-64 sm:w-72 md:w-64 lg:w-65 xl:w-65 text-center hover:scale-105 duration-400 hover:shadow-2xl"
            >
              {/* Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-54 sm:w-62 md:w-54 lg:w-50 xl:w-56 h-60 object-cover rounded-md mx-auto mb-3"
              />

              {/* SOCIAL ICONS */}
              <div className="flex justify-center items-center gap-5 mb-3">
                <a href={member.socials.linkedin} target="_blank">
                  <img
                    src={linkedin}
                    alt="LinkedIn"
                    className="w-7 h-7 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.github} target="_blank">
                  <img
                    src={github}
                    alt="github"
                    className="w-6 h-6 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
                <a href={member.socials.instagram} target="_blank">
                  <img
                    src={instagram}
                    alt="Instagram"
                    className="w-7 h-7 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                </a>
              </div>

              {/* Name */}
              <p
                className="sm:text-3xl md:text-3xl lg:text-2xl xl:text-xl tracking-wide font-bold, "
                style={{ fontFamily: "Swinging Wake" }}
              >
                {member.name}
              </p>

              {/* Position */}
              <p
                className="text-sm tracking-wide mt-1 px-3"
                style={{ fontFamily: "Stranger Things" }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
