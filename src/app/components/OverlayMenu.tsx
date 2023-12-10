"use client";

import { motion } from "framer-motion";

const OverlayMenu = ({
  side,
  className,
  children,
  windowWidth,
}: {
  children: React.ReactNode;
  className: string;
  side: string;
  windowWidth: number;
}) => {
  const variants = {
    hidden: {
      transform: side === "left" ? "translateX(-100%)" : "translateX(100%)",
    },
    visible: { transform: "translateX(0)" },
    exit: {
      transform: side === "left" ? "translateX(-100%)" : "translateX(100%)",
    },
  };
  console.log(side);
  return (
    <motion.div
      className={`fixed top-20 h-full opacity-50 ${className}`}
      initial={{ width: "0%" }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%" }}
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default OverlayMenu;
