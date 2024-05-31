"use client";
import ThemeSwitch from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  faArrowRightFromBracket,
  faDungeon,
  faFileText,
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
      <Button variant={"secondary"} aria-label="create a new post">
        <Link href="/dungeon/create-post">
          <FontAwesomeIcon icon={faPlus} className="rounded-full" />
        </Link>
      </Button>

      <Button
        variant={"secondary"}
        aria-label="return to the entrance of the dungeon"
      >
        <Link href="/dungeon">
          <FontAwesomeIcon icon={faDungeon} className="rounded-full" />
        </Link>
      </Button>

      <Button variant={"secondary"} aria-label="visit the playground">
        <Link href="/dungeon/playground">
          <FontAwesomeIcon icon={faGamepad} className="rounded-full" />
        </Link>
      </Button>

      <Button variant={"secondary"} aria-label="return to the tower">
        <Link href="/">
          <FontAwesomeIcon icon={faTowerObservation} className="rounded-full" />
        </Link>
      </Button>

      <Button variant={"secondary"} aria-label="read all the posts">
        <Link href="/posts">
          <FontAwesomeIcon icon={faFileText} className="rounded-full" />
        </Link>
      </Button>

      <ThemeSwitch />

      <Button
        variant={"secondary"}
        aria-label="sign out"
        onClick={() => signOut()}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </Button>
    </nav>
  );
};

export default Menu;
