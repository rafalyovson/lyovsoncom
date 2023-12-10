"use client";

import { motion } from "framer-motion";
const PortfolioCard = ({ num }: { num: number }) => {
  console.log(num);
  return (
    <motion.div
      layout
      className="h-[200px] border rounded shadow border-gray-300 bg-white"
      transition={{ duration: 0.8 }} // Increase this value to make the animation slower
    >
      {num}
    </motion.div>
  );
};

export default PortfolioCard;
