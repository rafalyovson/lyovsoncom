'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const SignOutButton = () => {
  return (
    <div
      className={`cursor-pointer h-full w-full flex justify-center items-center gap-2 flex-col`}
      onClick={() => signOut()}
    >
      <LogOut className="w-7 h-7" />
      <span>Sign Out</span>
    </div>
  );
};
