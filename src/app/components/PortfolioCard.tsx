"use client";

import { motion } from "framer-motion";
const PortfolioCard = ({ post }: { post: any }) => {
  return (
    <motion.article
      layout
      className="max-h-[400px] aspect-square border  rounded shadow-dark dark:shadow-light  border-gray-300 bg-white hover:shadow-lg focus:shadow-lg transition-all flex flex-col justify-between p-2 "
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl capitalize">{post.title}</h2>
      <div>{post.body}</div>
    </motion.article>
  );
};

export default PortfolioCard;
