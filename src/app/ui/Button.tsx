"use client";

import { motion } from "framer-motion";

const Button = ({
  children,
  className,
  onClick,
  title,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  type?: "button" | "submit" | "reset" | undefined;
  props?: any;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      type={props.type}
      className={`px-4 py-2 font-bold rounded text-light dark:text-dark dark:bg-light bg-dark  transition-all duration-300 ease-in-out shadow-md ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
