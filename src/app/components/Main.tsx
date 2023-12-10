"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useContext, useEffect, useState } from "react";
import { UserContext } from "../Providers";
import OverlayMenu from "./OverlayMenu";

const Main = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useContext(UserContext);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <AnimatePresence>
        {user === "Jess" ? (
          <OverlayMenu
            key="jess"
            windowWidth={windowWidth}
            side="left"
            className="bg-gradient-to-b from-red-600 to-red-950 left-0  "
          >
            <Link href="/jess">Jess</Link>
          </OverlayMenu>
        ) : user === "Rafa" ? (
          <OverlayMenu
            key="rafa"
            windowWidth={windowWidth}
            side="right"
            className="bg-gradient-to-b from-blue-600 to-blue-950 right-0 "
          >
            <Link href="/jess">Rafa</Link>
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
