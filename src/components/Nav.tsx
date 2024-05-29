"use client";

import ThemeSwitch from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";

import Menu from "@/components/Menu";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col flex-wrap items-center justify-center gap-4 text-center md:flex-row">
      {session && <Menu />}
      {!session && (
        <>
          <Button
            className="flex items-center justify-center rounded-full size-12"
            onClick={() => signIn()}
            aria-label="sign in"
          >
            <FontAwesomeIcon icon={faRightToBracket} />
          </Button>
          <ThemeSwitch />
        </>
      )}
    </nav>
  );
};

export default Nav;
