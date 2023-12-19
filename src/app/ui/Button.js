"use client";

import { motion } from "framer-motion";

const Button = ({ children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`px-4 py-2 font-bold rounded text-light dark:text-dark dark:bg-light bg-dark hover:bg-beige  dark:hover:bg-beige transition-all duration-300 ease-in-out shadow-md ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
