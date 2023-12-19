"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./Button";
import ThemeSwitch from "./ThemeSwitcher";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col flex-wrap items-center justify-center gap-4 text-center md:flex-row">
      <Button>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      {session && (
        <Button>
          <Link href="/dashboard/create-post">Create Post</Link>{" "}
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
