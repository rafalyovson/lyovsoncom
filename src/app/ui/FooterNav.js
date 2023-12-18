"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const FooterNav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-wrap items-baseline gap-4 text-center">
      <Link
        className="px-4 py-2 text-center border border-beige grow"
        href="/dashboard"
      >
        Dashboard
      </Link>
      {session && (
        <Link
          className="px-4 py-2 text-center border border-beige grow"
          href="/dashboard/create-post"
        >
          Create Post
        </Link>
      )}

      <button
        className="px-4 py-2 border border-beige grow"
        onClick={() => (session ? signOut() : signIn())}
      >
        {session ? "Sign Out" : "Sign In"}
      </button>
    </nav>
  );
};

export default FooterNav;
