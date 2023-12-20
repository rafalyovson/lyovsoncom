"use client";

import Button from "@/app/ui/Button";
import ThemeSwitch from "@/app/ui/ThemeSwitcher";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col flex-wrap items-center justify-center gap-4 text-center md:flex-row">
      <Button>
        <Link href="/dungeon">Dungeon</Link>
      </Button>
      {session && (
        <Button>
          <Link href="/dungeon/create-post">Create Post</Link>{" "}
        </Button>
      )}
      <Button className="" onClick={() => (session ? signOut() : signIn())}>
        {session ? "Sign Out" : "Sign In"}
      </Button>
      <ThemeSwitch />
    </nav>
  );
};

export default FooterNav;
