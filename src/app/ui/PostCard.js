"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
// import { deletePost } from "../lib/actions";

const PostCard = ({ post }) => {
  return (
    <motion.article
      layout
      className="relative flex flex-col justify-between overflow-hidden border-2 rounded-lg shadow-2xl bg-light border-dark aspect-square grow "
      transition={{ duration: 0.5 }}
      // onClick={() => deletePost(post)}
    >
      <Link href={`/posts/${post.slug}`}>
        <Image
          className="absolute object-cover w-full h-full"
          src={post.featuredImg || "/images/placeholder.png"}
          alt={post.title + " featured image"}
          width="400"
          height="400"
        />
        <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-black to-transparent"></div>
        <header className="absolute bottom-0 w-full p-4 bg-transparent text-light ">
          <h2 className="text-2xl font-bold capitalize">{post.title}</h2>
        </header>
      </Link>
    </motion.article>
  );
};

export default PostCard;
