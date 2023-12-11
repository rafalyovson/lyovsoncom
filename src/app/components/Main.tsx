"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ReactNode, useContext } from "react";
import { UserContext, WindowWidthContext } from "../Providers";
import JessMenu from "../jess/JessMenu";
import RafaMenu from "../rafa/RafaMenu";

const Main = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useContext(UserContext);
  const { windowWidth } = useContext(WindowWidthContext);
  const { theme } = useTheme();

  return (
    <>
      <AnimatePresence>
        {user === "Jess" ? (
          <JessMenu key="jess" windowWidth={windowWidth} />
        ) : user === "Rafa" ? (
          <RafaMenu key="rafa" windowWidth={windowWidth} />
        ) : null}
      </AnimatePresence>
      <motion.main
        onClick={() => setUser("Both")}
        className=" bg-light text-dark dark:text-light dark:bg-dark min-h-screen overflow-auto relative"
        layout
        initial={{
          backgroundColor:
            theme === "light" ? "rgb(240 235 225)" : "rgb(3 11 34)",
        }}
        animate={{
          backgroundColor:
            theme === "light" ? "rgb(240 235 225)" : "rgb(3 11 34)",
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
