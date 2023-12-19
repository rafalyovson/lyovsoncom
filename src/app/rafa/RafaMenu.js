import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "../ui/UserMenuLink";
import RafaSocials from "./RafaSocials";

const RafaMenu = ({ windowWidth, setUser }) => {
  return (
    <motion.aside
      className={`fixed top-20 h-full overflow-auto z-10   right-0  flex flex-col items-center gap-4 bg-light dark:bg-dark lg:border-l-4 border-dark dark:border-light`}
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%", opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        className="w-[200px] border-4 border-dark dark:border-light mt-8 "
        alt="rafa"
        src="/rafa.png"
        width={300}
        height={400}
      />
      <Link className="hover:underline" href="/jess">
        Rafa Lyovson
      </Link>
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-l from-rafa to-beige"></div>
      <RafaSocials />
      <nav className="text-2xl list-none ">
        <Link className="hover:underline" href="/rafa/bio">
          <FontAwesomeIcon icon={faXTwitter} />
          Bio
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faXTwitter} />
          Portfolio
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faXTwitter} />
          Contact
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faXTwitter} />
          Project 1
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faXTwitter} />
          Project 2
        </Link>
      </nav>
      <Button
        onClick={() => {
          setUser("Both");
        }}
      >
        X
      </Button>
    </motion.aside>
  );
};

export default RafaMenu;
