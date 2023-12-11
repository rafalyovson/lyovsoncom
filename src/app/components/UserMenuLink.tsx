"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../Providers";

const UserMenuLink = ({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) => {
  const { setUser } = useContext(UserContext);

  return (
    <Link className={className} href={href} onClick={() => setUser("both")}>
      <li className="flex  gap-2 items-center py-4">{children}</li>
    </Link>
  );
};

export default UserMenuLink;
