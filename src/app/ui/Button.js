"use client";

import { motion } from "framer-motion";

const Button = ({ children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`px-4 py-2 font-bold rounded text-white bg-dark hover:bg-beige dark:text-light dark:hover:bg-beige dark:bg-dark transition-all duration-300 ease-in-out shadow-md ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
