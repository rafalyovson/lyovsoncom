"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../Providers";
import { ImageButton } from "./ImageButton";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <header className="bg-gradient-to-r from-red-600 to-blue-600 text-white flex items-center justify-between h-20 sticky px-4 top-0">
      <ImageButton handleImageClick={() => setUser("Jess")} />
      <Link href="/">
        <h1 onClick={() => setUser("Both")} className="text-4xl">
          Lyovson.com
        </h1>
      </Link>
      <ImageButton handleImageClick={() => setUser("Rafa")} />
    </header>
  );
};

export default Header;
