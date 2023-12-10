"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import OverlayMenu from "./OverlayMenu";

enum Users {
  Rafa,
  Jess,
  Both,
}

const Header: React.FC = () => {
  const [lyovson, setLyovson] = useState<Users>(Users.Both);

  const handleImageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLyovson(event.currentTarget.id === "Jess" ? Users.Jess : Users.Rafa);
  };

  return (
    <>
      <AnimatePresence>
        {lyovson === Users.Jess ? (
          <OverlayMenu
            key="jess"
            className="bg-gradient-to-b from-red-600 to-red-950 left-0 opacity-100 "
          >
            Jess
          </OverlayMenu>
        ) : lyovson === Users.Rafa ? (
          <OverlayMenu
            key="rafa"
            className="bg-gradient-to-b from-blue-600 to-blue-950 right-0 opacity-100"
          >
            Rafa
          </OverlayMenu>
        ) : null}
      </AnimatePresence>
      <header className="bg-gradient-to-r from-red-600 to-blue-600 text-white flex items-center justify-between h-20 sticky px-4 top-0">
        <button
          id="Jess"
          onClick={handleImageClick}
          className="focus:outline-none p-0"
          title="Left Image"
        >
          <div className="relative h-10 w-10">
            <Image
              src="https://via.placeholder.com/150"
              alt="Left profile"
              layout="fill"
              className="rounded-full"
            />
          </div>
        </button>
        <Link href="/">
          <h1 onClick={() => setLyovson(Users.Both)} className="text-4xl">
            Lyovson.com
          </h1>
        </Link>
        <button
          id="Rafa"
          onClick={handleImageClick}
          className="focus:outline-none p-0"
          title="Right Image"
        >
          <div className="relative h-10 w-10">
            <Image
              src="https://via.placeholder.com/150"
              alt="Right profile"
              layout="fill"
              className="rounded-full"
            />
          </div>
        </button>
      </header>
    </>
  );
};

export default Header;
