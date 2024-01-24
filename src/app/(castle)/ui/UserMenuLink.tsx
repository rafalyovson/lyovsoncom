"use client";

import { UserModeContext } from "@/app/(castle)/lib/UserModeProvider";
import Link from "next/link";
import { ReactNode, useContext } from "react";

interface UserMenuLinkProps {
  children: ReactNode;
  className: string;
  href: string;
}

const UserMenuLink = ({ children, className, href }: UserMenuLinkProps) => {
  const { setUser } = useContext(UserModeContext);

  return (
    <Link className={className} href={href} onClick={() => setUser("both")}>
      <li className="flex items-center gap-2 py-4">{children}</li>
    </Link>
  );
};

export default UserMenuLink;
