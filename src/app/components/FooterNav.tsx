"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex gap-4 items-baseline flex-wrap text-center">
      <Link
        className="border border-beige px-4 py-2 grow text-center"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <button
        className="border border-beige px-4 py-2 grow"
        onClick={() => (session ? signOut() : signIn())}
      >
        {session ? "Sign Out" : "Sign In"}
      </button>
    </nav>
  );
};

export default FooterNav;
