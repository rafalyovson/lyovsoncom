"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const PostCard = ({ post }) => {
  return (
    <motion.article
      layout
      className="relative flex flex-col justify-between overflow-hidden bg-white border-2 border-blue-500 rounded-lg shadow-2xl aspect-square grow "
      transition={{ duration: 0.5 }}
    >
      <Link href={`/posts/${post.slug}`}>
        <Image
          className="absolute object-cover w-full h-full"
          src={post.featuredImg}
          alt={post.title + " featured image"}
          width="400"
          height="400"
        />
        <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-black to-transparent"></div>
        <header className="absolute bottom-0 w-full p-4 text-white bg-transparent">
          <h2 className="text-2xl font-bold capitalize">{post.title}</h2>
        </header>
      </Link>
    </motion.article>
  );
};

export default PostCard;
