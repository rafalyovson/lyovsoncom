import JessSocials from "@/app/(castle)/(users)/jess/JessSocials";
import Link from "@/app/(castle)/ui/UserMenuLink";
import Button from "@/app/ui/Button";
import {
  faAddressCard,
  faBriefcase,
  faListCheck,
  faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";

const JessMenu = ({
  windowWidth,
  setUser,
}: {
  windowWidth: number;
  setUser: Function;
}) => {
  return (
    <motion.aside
      className={`fixed top-20 h-full overflow-auto z-10  left-0  flex flex-col items-center gap-4 bg-light dark:bg-dark lg:border-r-4 border-dark dark:border-light`}
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%", opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        className="w-[200px] border-4 border-dark dark:border-light mt-8"
        alt="jess"
        src="/jess.png"
        width={300}
        height={400}
      />
      <Link className="hover:underline" href="/jess">
        Jess Lyovson
      </Link>
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-r from-jess to-beige"></div>
      <JessSocials />
      <nav className="text-2xl list-none ">
        <Link className="hover:underline" href="/jess/bio">
          <FontAwesomeIcon icon={faUserNinja} />
          Bio
        </Link>
        <Link className="hover:underline" href="/jess/portfolio">
          <FontAwesomeIcon icon={faBriefcase} />
          Portfolio
        </Link>
        <Link className="hover:underline" href="/jess/portfolio">
          <FontAwesomeIcon icon={faAddressCard} />
          Contact
        </Link>
        <Link className="hover:underline" href="/jess/portfolio">
          <FontAwesomeIcon icon={faListCheck} />
          Project 1
        </Link>
        <Link className="hover:underline" href="/jess/portfolio">
          <FontAwesomeIcon icon={faListCheck} />
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

export default JessMenu;
