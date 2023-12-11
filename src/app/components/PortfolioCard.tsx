"use client";

import { motion } from "framer-motion";
const PortfolioCard = ({ num }: { num: number }) => {
  return (
    <motion.div
      layout
      className="h-[200px] border rounded shadow-dark dark:shadow-light  border-gray-300 bg-white hover:shadow-lg focus:shadow-lg transition-all "
      transition={{ duration: 0.5 }}
    >
      {num}
    </motion.div>
  );
};

export default PortfolioCard;
