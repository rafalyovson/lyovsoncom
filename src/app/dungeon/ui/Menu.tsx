"use client";
import ThemeSwitch from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  faArrowRightFromBracket,
  faDungeon,
  faGamepad,
  faPlus,
  faTowerObservation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Menu = () => {
  return (
    <nav className="flex flex-row items-center justify-center gap-4 text-center ">
      <Button
        aria-label="create a new post"
        className="flex items-center justify-center rounded-full size-12"
      >
        <Link href="/dungeon/create-post">
          <FontAwesomeIcon icon={faPlus} className="rounded-full" />
        </Link>
      </Button>

      <ThemeSwitch />

      <Button
        aria-label="return to the tower"
        className="flex items-center justify-center rounded-full size-12"
      >
        <Link href="/">
          <FontAwesomeIcon icon={faTowerObservation} className="rounded-full" />
        </Link>
      </Button>

      <Button
        aria-label="return to the tower"
        className="flex items-center justify-center rounded-full size-12"
      >
        <Link href="/dungeon/playground">
          <FontAwesomeIcon icon={faGamepad} className="rounded-full" />
        </Link>
      </Button>

      <Button
        aria-label="return to the tower"
        className="flex items-center justify-center rounded-full size-12"
      >
        <Link href="/dungeon">
          <FontAwesomeIcon icon={faDungeon} className="rounded-full" />
        </Link>
      </Button>

      <Button
        aria-label="sign out"
        className="flex items-center justify-center rounded-full size-12"
        onClick={() => signOut()}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </Button>
    </nav>
  );
};

export default Menu;
