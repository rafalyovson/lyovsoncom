"use client";

import JessMenu from "@/app/(castle)/(users)/jess/JessMenu";
import RafaMenu from "@/app/(castle)/(users)/rafa/RafaMenu";
import { UserModeContext } from "@/app/(castle)/lib/UserModeProvider";
import { WindowWidthContext } from "@/app/(castle)/lib/WindowWidthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";

const Main = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useContext(UserModeContext);
  const { windowWidth } = useContext(WindowWidthContext);

  const renderUserMenu = () => {
    switch (user) {
      case "Jess":
        return (
          <JessMenu setUser={setUser} key="jess" windowWidth={windowWidth} />
        );
      case "Rafa":
        return (
          <RafaMenu setUser={setUser} key="rafa" windowWidth={windowWidth} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>{renderUserMenu()}</AnimatePresence>
      <motion.main
        onClick={() => setUser("Both")}
        className="relative min-h-screen my-8 overflow-auto font-heading"
        layout
        animate={{
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
