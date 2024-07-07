import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { UserFull } from '@/data/types/user-full';
import { UserSocialMenu } from '@/components/user-soical-menu';

export const Menu = ({ user }: { user: UserFull }) => {
  return (
    <SheetContent
      className="flex flex-col gap-4 w-full lg:w-[300px]"
      side={user.username === 'jess' ? 'left' : 'right'}
    >
      <SheetHeader>
        <Card className="w-[250px] mx-auto">
          <CardHeader>
            <Image
              alt={user.avatar?.altText || ''}
              src={user.avatar?.url || ''}
              width={300}
              height={400}
            />
          </CardHeader>
          <CardContent>
            <Link className="hover:underline" href={`/${user.username}`}>
              <SheetTitle>{user.name}</SheetTitle>
            </Link>

            <SheetDescription>{user.shortBio}</SheetDescription>
          </CardContent>
          <CardFooter>
            <UserSocialMenu
              className={`flex-wrap justify-center items-center align-middle`}
              user={user}
            />
          </CardFooter>
        </Card>
      </SheetHeader>
      <section className="flex flex-col gap-2 items-center">
        <Link href={`/${user.username}/bio`}> Bio</Link>
        <Link href={`/${user.username}/portfolio`}> Portfolio</Link>
      </section>
    </SheetContent>
  );
};
