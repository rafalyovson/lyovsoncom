"use client";

import { motion } from "framer-motion";

const Card = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: any;
}) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col justify-between overflow-hidden border-2 rounded-lg shadow-2xl bg-light border-dark aspect-square grow ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
