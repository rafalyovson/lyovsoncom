"use client";

import { motion } from "framer-motion";

const variants = {
  hidden: { width: "0%" },
  visible: { width: "100%" },
  exit: { width: "0%" },
};

const OverlayMenu = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <motion.div
      className={`fixed top-20 h-full opacity-50 ${className}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default OverlayMenu;
