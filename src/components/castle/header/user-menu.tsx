import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/shadcn/ui/card';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/ui/sheet';
import { UserSocialMenu } from '@/components/user-soical-menu';
import { UserFull } from '@/data/types/user-full';
import Image from 'next/image';
import Link from 'next/link';

export const Menu = ({ user }: { user: UserFull }) => {
  return (
    <SheetContent
      className="flex flex-col gap-6 w-full max-w-md mx-auto lg:w-[320px] bg-[#1c1c1e] text-gray-300 shadow-lg rounded-md p-6"
      side={user.username === 'jess' ? 'left' : 'right'}
    >
      <SheetHeader className="flex flex-col items-center">
        <Card className="w-full bg-[#2a2a2e] text-white rounded-lg shadow-md">
          <CardHeader className="p-0">
            <Image
              alt={user.avatar?.altText || 'User avatar'}
              src={user.avatar?.url || '/placeholder-avatar.jpg'}
              width={300}
              height={300}
              className="w-full h-56 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-4 text-center">
            <Link
              className="hover:underline text-lg font-semibold"
              href={`/${user.username}`}
            >
              <SheetTitle>{user.name}</SheetTitle>
            </Link>
            <SheetDescription className="text-sm mt-2">
              {user.shortBio}
            </SheetDescription>
          </CardContent>
          <CardFooter className="p-4 flex flex-wrap gap-2 justify-center items-center">
            <UserSocialMenu
              className="flex flex-wrap gap-3 justify-center items-center"
              user={user}
            />
          </CardFooter>
        </Card>
      </SheetHeader>
      <section className="flex flex-col gap-4 items-center mt-4">
        <Link
          className="text-primary hover:underline text-sm lg:text-base"
          href={`/${user.username}/bio`}
        >
          Bio
        </Link>
        <Link
          className="text-primary hover:underline text-sm lg:text-base"
          href={`/${user.username}/portfolio`}
        >
          Portfolio
        </Link>
      </section>
    </SheetContent>
  );
};
