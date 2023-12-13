"use client";

import { motion } from "framer-motion";
const PortfolioCard = ({ post }) => {
  return (
    <motion.article
      layout
      className="flex flex-col justify-between p-4 border aspect-square"
      transition={{ duration: 0.5 }}
    >
      <header className="flex flex-col justify-between gap-4 h-[120px] ">
        <h2 className="text-2xl capitalize">{post.title}</h2>
        <div className="h-2 w-[100%] mx-auto rounded-lg bg-gradient-to-r from-jess to-rafa"></div>
      </header>

      <div>{post.body}</div>
    </motion.article>
  );
};

export default PortfolioCard;
