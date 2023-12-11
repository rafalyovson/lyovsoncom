"use client";

import { motion } from "framer-motion";

const OverlayMenu = ({
  className,
  children,
  windowWidth,
}: {
  children: React.ReactNode;
  className: string;
  windowWidth: number;
}) => {
  return (
    <motion.div
      className={`fixed top-20 h-full overflow-auto  ${className}`}
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: windowWidth > 992 ? "400px" : "100%", opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default OverlayMenu;
