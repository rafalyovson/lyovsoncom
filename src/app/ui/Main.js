"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useContext } from "react";
import { colors } from "tailwindcss/defaultTheme";
import { UserContext, WindowWidthContext } from "../Providers";
import JessMenu from "../jess/JessMenu";
import RafaMenu from "../rafa/RafaMenu";

const Main = ({ children }) => {
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
        className="relative min-h-screen overflow-auto font-heading "
        layout
        initial={{
          backgroundColor: theme === "light" ? colors.light : colors.dark,
        }}
        animate={{
          backgroundColor: theme === "dark" ? colors.dark : colors.light,
          marginRight: user === "Rafa" && windowWidth > 992 ? "400px" : "0px",
          marginLeft: user === "Jess" && windowWidth > 992 ? "400px" : "0px",
        }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </>
  );
};

export default Main;
