import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import RafaSocials from "./RafaSocials";

const RafaMenu = ({ windowWidth }: { windowWidth: number }) => {
  return (
    <motion.aside
      className={`fixed top-20 h-full overflow-auto z-10  bg-gradient-to-b from-rafa to-dark right-0  flex flex-col items-center gap-5 text-light`}
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
      <RafaSocials />
      <ul className="text-2xl list-none ">
        <Link href="/rafa/bio">
          <li className="flex gap-2 items-center py-4">
            <div className="w-10 h-10">
              <FontAwesomeIcon icon={faXTwitter} size="2x" />
            </div>
            Bio
          </li>
        </Link>
        <Link href="/rafa/portfolio">
          <li className="flex gap-2 items-center py-4">
            <div className="w-10 h-10">
              <FontAwesomeIcon icon={faXTwitter} size="2x" />
            </div>
            Portfolio
          </li>
        </Link>
        <li className="flex gap-2 items-center py-4">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Contact
        </li>
        <li className="flex gap-2 items-center py-4">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 1
        </li>
        <li className="flex gap-2 items-center py-4">
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
          Project 2
        </li>
      </ul>
    </motion.aside>
  );
};

export default RafaMenu;
