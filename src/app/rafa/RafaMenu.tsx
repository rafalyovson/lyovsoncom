import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "../components/UserMenuLink";
import RafaSocials from "./RafaSocials";

const RafaMenu = ({ windowWidth }: { windowWidth: number }) => {
  return (
    <motion.aside
      className={`fixed top-20 h-full overflow-auto z-10   right-0  flex flex-col items-center gap-4 bg-light dark:bg-dark`}
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%", opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        className="w-[200px]  rounded-sm my-5  "
        alt="rafa"
        src="/rafa.png"
        width={400}
        height={400}
      />
      <Link className=" text-3xl " href="/jess">
        Rafa Lyovson
      </Link>
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-l from-rafa to-beige"></div>
      <RafaSocials />
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-l from-rafa to-beige"></div>
      <nav className="text-2xl list-none ">
        <Link href="/rafa/bio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Bio
        </Link>
        <Link href="/rafa/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Portfolio
        </Link>
        <Link href="/rafa/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Contact
        </Link>
        <Link href="/rafa/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 1
        </Link>
        <Link href="/rafa/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 2
        </Link>
      </nav>
    </motion.aside>
  );
};

export default RafaMenu;
