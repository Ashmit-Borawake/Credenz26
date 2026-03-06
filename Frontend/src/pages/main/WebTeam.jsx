import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

import linkedin from "../../images/linkedin.png";
import github from "../../images/github.png";
import instagram from "../../images/instagram.png";

const WebTeam = () => {
  const webTeam = [
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693268/Anushree_nxuxfn.jpg",
      name: "Anushree Kamath",
      socials: {
        linkedin: "https://www.linkedin.com/in/anushreekamath04",
        github: "https://github.com/siriuslycoding",
        instagram: "https://www.instagram.com/kamathanushree",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693186/Ashwin_anr2w3.jpg",
      name: "Ashwin Ketkar",
      socials: {
        linkedin: "https://linkedin.com/in/ashwin-ketkar-8a8a382a0",
        github: "https://github.com/ashkett",
        instagram: "https://www.instagram.com/ashwinketkar/#",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693284/Shlok_wdrb3r.jpg",
      name: "Shlok Sangamnerkar",
      socials: {
        linkedin: "https://www.linkedin.com/in/shlok-sangamnerkar/",
        github: "https://github.com/Vic710",
        instagram: "https://www.instagram.com/shlok.doing.stuff/",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693231/Maitreya_hb0vm6.jpg",
      name: "Maitreya Vaidya",
      socials: {
        linkedin: "https://linkedin.com/in/maitreya-vaidya-33721731a/",
        github: "https://github.com/maitreya-16",
        instagram: "https://instagram.com/___maitreya___16",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693226/Mahesh_qbnhpk.jpg",
      name: "Mahesh Baviskar",
      socials: {
        linkedin: "https://www.linkedin.com/in/mahesh-baviskar-449374291",
        github: "https://github.com/BaviskarMahesh",
        instagram: "https://www.instagram.com/mahesh_22kar",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693196/Ashmit_xg0p5k.jpg",
      name: "Ashmit Borawake",
      socials: {
        linkedin: "https://www.linkedin.com/in/ashmit-borawake-7a8641290/",
        github: "https://github.com/Ashmit-Borawake",
        instagram: "https://instagram.com/ashmit_b_03/",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693279/Rashmi_tsak9d.jpg",
      name: "Rashmi Abhyankar",
      socials: {
        linkedin:
          "https://www.linkedin.com/in/rashmiabhyankar?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        github: "https://github.com/Rashmi-05",
        instagram:
          "https://www.instagram.com/rashmiabhyankar05?igsh=dGVxcjRoeGp1bW14",
      },
    },

    // ---- rest unchanged ----
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
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693303/Swayam_fxlold.jpg",
      name: "Swayam Gosavi",
      socials: {
        linkedin: "https://linkedin.com/in/infinity1410",
        github: "https://github.com/theinfinity1410",
        instagram:
          "https://www.instagram.com/__.swayam._1410?igsh=MWxvdzV4OXZ0am5oZg==",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769693202/Harshad_vhrfuy.jpg",
      name: "Harshad Karle",
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
      socials: {
        linkedin: "https://www.linkedin.com/in/karanmittaldev",
        github: "https://github.com/karan-mittal06",
        instagram: "https://www.instagram.com/karanmittal7303",
      },
    },
    {
      image:
        "https://res.cloudinary.com/dtr7bu8ch/image/upload/v1769955954/Bhavesh_d7enyy.jpg",
      name: "Bhavesh Kadam",
      socials: {
        linkedin: "https://www.linkedin.com/in/bhavesh-kadam-9216ba328/",
        github: "https://github.com/creepertDev",
        instagram: "http://instagram.com/bhaveshfr",
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between  text-white">
      <Header />

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-20 md:mt-25 mb-20 gap-5">
        {/* PAGE HEADING */}
        <h1
          className="text-[40px] sm:text-[40px] md:text-[70px] font-normal text-center"
          style={{ fontFamily: "Swinging Wake" }}
        >
          WEB <span className="pl-5">TEAM</span>
        </h1>

        <h1
          className="text-[15px] sm:text-[20px] md:text-[25px]  font-normal text-center mx-auto tracking-[2px]"
          style={{ fontFamily: "Swinging Wake" }}
        >
          Made with love by PISB Team &lt;3
        </h1>

        <div
          className="w-full flex flex-wrap justify-center items-stretch
                gap-x-[clamp(20px,5vw,100px)]
                gap-y-[clamp(20px,5vw,100px)]"
        >
          {webTeam.map((member, index) => (
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
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WebTeam;
