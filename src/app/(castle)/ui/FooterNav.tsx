"use client";

import ThemeSwitch from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  faDungeon,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col flex-wrap items-center justify-center gap-4 text-center md:flex-row">
      {session && (
        <>
          <Button
            aria-label="go to the dungeon"
            className="flex items-center justify-center rounded-full size-12"
          >
            <Link href="/dungeon">
              <FontAwesomeIcon icon={faDungeon} />
            </Link>
          </Button>
          <Button
            className="flex items-center justify-center rounded-full size-12"
            onClick={() => signOut()}
            aria-label="sign out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </>
      )}
      {!session && (
        <Button
          className="flex items-center justify-center rounded-full size-12"
          onClick={() => signIn()}
          aria-label="sign in"
        >
          <FontAwesomeIcon icon={faRightToBracket} />
        </Button>
      )}

      <ThemeSwitch />
    </nav>
  );
};

export default FooterNav;
