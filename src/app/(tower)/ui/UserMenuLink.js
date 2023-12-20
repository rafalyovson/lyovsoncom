"use client";

import { UserContext } from "@/app/(tower)/lib/userProvider";
import Link from "next/link";
import { useContext } from "react";

const UserMenuLink = ({ children, className, href }) => {
  const { setUser } = useContext(UserContext);

  return (
    <Link className={className} href={href} onClick={() => setUser("both")}>
      <li className="flex items-center gap-2 py-4">{children}</li>
    </Link>
  );
};

export default UserMenuLink;
