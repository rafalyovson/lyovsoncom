"use client";

import { motion } from "framer-motion";

const PortfolioCard = ({ post }) => {
  return (
    <motion.article
      layout
      className="relative flex flex-col justify-between overflow-hidden bg-white border rounded-lg shadow-lg aspect-square grow dark:bg-gray-800"
      transition={{ duration: 0.5 }}
    >
      <img
        className="absolute object-cover w-full h-full"
        src={post.featuredImg}
        alt="test"
      />
      <div className="absolute inset-0 "></div>
      <header className="absolute bottom-0 w-full p-4 dark:bg-dark/50 bg-light/50">
        <h2 className="text-2xl capitalize">{post.title}</h2>
      </header>
    </motion.article>
  );
};

export default PortfolioCard;
