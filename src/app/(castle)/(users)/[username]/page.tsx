import { PostFull } from '@/data/types/post-full';
import { PostGrid } from '@/components/castle/post-grid';
import { userSelectByUsername } from '@/data/actions/db-actions/user/user-select-one';
import { redirect } from 'next/navigation';
import { postSelectFullAll } from '@/data/actions/db-actions/post';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/shadcn/ui/card';
import { ImageCard } from '@/components/dungeon/image-card';
import { userSelectFullOneByUsername } from '@/data/actions/db-actions/user/user-select-full-one';
import { Button } from '@/components/shadcn/ui/button';
import Link from 'next/link';
import React from 'react';
import { UserSocialMenu } from '@/components/user-soical-menu';

const Page = async (props: { params: Promise<{ username: string }> }) => {
  const params = await props.params;
  const { username } = await params;
  const userResult = await userSelectByUsername({ username });

  if (!userResult.success || !userResult.user) {
    redirect(`/`);
  }
  const { user } = await userSelectFullOneByUsername({
    username: userResult.user.username!,
  });

  if (!user || !user.avatar) {
    redirect(`/`);
  }

  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <h1>{result.message}</h1>;
  }

  const userPosts = result.posts.filter(
    (post: PostFull) => post.author!.username === userResult.user!.username,
  );

  return (
    <main>
      <article
        className={`flex gap-2 mx-auto container flex-wrap lg:flex-nowrap justify-center my-8`}
      >
        <ImageCard image={user.avatar} className={` min-w-[400px]`} />
        <Card className={` min-w-[400px]`}>
          <CardHeader>
            <h1 className={`text-3xl text-center my-10`}>
              {userResult.user.name}
            </h1>
          </CardHeader>
          <CardContent className={`flex flex-col gap-2 p-4 `}>
            {userResult.user.shortBio}
          </CardContent>
          <CardFooter>
            <nav className="flex justify-center flex-wrap items-center p-6 bg-background text-gray-800 dark:text-gray-200 gap-2 mx-auto">
              <Button
                asChild
                size="icon"
                variant={'secondary'}
                aria-label="Full Bio"
              >
                <Link href={`/${user.username}/bio`} className={`text-xl`}>
                  📇
                </Link>
              </Button>
              <Button
                asChild
                size="icon"
                variant={'secondary'}
                aria-label="Portfolio"
              >
                <Link
                  href={`/${user.username}/portfolio`}
                  className={`text-xl`}
                >
                  💼
                </Link>
              </Button>
              <UserSocialMenu user={user} />
            </nav>
          </CardFooter>
        </Card>
      </article>
      <main>
        <h2 className={`text-3xl text-center mt-10`}>Posts</h2>
        <PostGrid posts={userPosts} />
      </main>
    </main>
  );
};
export default Page;
