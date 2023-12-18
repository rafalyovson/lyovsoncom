"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./Button";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-wrap items-baseline gap-4 text-center">
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
    </nav>
  );
};

export default FooterNav;
