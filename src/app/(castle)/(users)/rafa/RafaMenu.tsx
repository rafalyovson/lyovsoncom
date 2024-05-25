import RafaSocials from "@/app/(castle)/(users)/rafa/RafaSocials";
import Link from "@/app/(castle)/ui/UserMenuLink";
import Button from "@/components/Button";
import {
  faAddressCard,
  faBriefcase,
  faListCheck,
  faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";

const RafaMenu = ({
  windowWidth,
  setUser,
}: {
  windowWidth: number;
  setUser: Function;
}) => {
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
      <Link className="hover:underline" href="/rafa">
        Rafa Lyovson
      </Link>
      <div className="h-2 w-[80%] mx-auto rounded-lg bg-gradient-to-l from-rafa to-beige"></div>
      <RafaSocials />
      <nav className="text-2xl list-none ">
        <Link className="hover:underline" href="/rafa/bio">
          <FontAwesomeIcon icon={faUserNinja} />
          Bio
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faBriefcase} />
          Portfolio
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faAddressCard} />
          Contact
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
          <FontAwesomeIcon icon={faListCheck} />
          Project 1
        </Link>
        <Link className="hover:underline" href="/rafa/portfolio">
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

export default RafaMenu;
