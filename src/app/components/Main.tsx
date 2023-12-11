"use client";

import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useContext } from "react";
import { UserContext, WindowWidthContext } from "../Providers";
import OverlayMenu from "./OverlayMenu";

const Main = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useContext(UserContext);
  const { windowWidth } = useContext(WindowWidthContext);

  return (
    <>
      <AnimatePresence>
        {user === "Jess" ? (
          <OverlayMenu
            key="jess"
            windowWidth={windowWidth}
            className="bg-gradient-to-b from-jess to-dark left-0  flex flex-col items-center gap-5 text-light"
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
            <ul className="text-2xl list-none">
              <li className="flex gap-2 items-center py-4">
                <div className="w-10 h-10">
                  <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </div>
                About
              </li>
              <li className="flex gap-2 items-center py-4">
                <div className="w-10 h-10">
                  <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </div>
                Portfolio
              </li>
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
          </OverlayMenu>
        ) : user === "Rafa" ? (
          <OverlayMenu
            key="rafa"
            windowWidth={windowWidth}
            className="bg-gradient-to-b from-rafa to-dark right-0 flex flex-col items-center gap-5 text-light"
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
            <ul className="text-2xl list-none ">
              <li className="flex gap-2 items-center py-4">
                <div className="w-10 h-10">
                  <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </div>
                About
              </li>
              <li className="flex gap-2 items-center py-4">
                <div className="w-10 h-10">
                  <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </div>
                Portfolio
              </li>
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
          </OverlayMenu>
        ) : null}
      </AnimatePresence>
      <motion.main
        animate={{
          marginRight:
            user === "Rafa" && window.innerWidth > 992 ? "400px" : "0px",
          marginLeft:
            user === "Jess" && window.innerWidth > 992 ? "400px" : "0px",
        }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </>
  );
};

export default Main;
