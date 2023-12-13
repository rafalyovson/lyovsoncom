import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "../components/UserMenuLink";
import JessSocials from "./JessSocials";

const JessMenu = ({ windowWidth }: { windowWidth: number }) => {
  return (
    <motion.aside
      className={`fixed top-20 h-full overflow-auto z-10  left-0  flex flex-col items-center gap-4 bg-light dark:bg-dark`}
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%", opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        className="w-[200px]  rounded-sm  "
        alt="jess"
        src="/jess.png"
        width={400}
        height={400}
      />
      <Link className=" text-3xl" href="/jess">
        Jess Lyovson
      </Link>
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-r from-jess to-beige"></div>
      <JessSocials />
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-r from-jess to-beige"></div>
      <nav className="text-2xl list-none">
        <Link href="/jess/bio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Bio
        </Link>
        <Link href="/jess/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Portfolio
        </Link>
        <Link href="/jess/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Contact
        </Link>
        <Link href="/jess/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 1
        </Link>
        <Link href="/jess/portfolio">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 2
        </Link>
      </nav>
    </motion.aside>
  );
};

export default JessMenu;
