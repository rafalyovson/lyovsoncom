'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActionState, useState } from 'react';
import { ImageUploadForm } from '@/app/dungeon/ui/image-uplaod-form';
import { UserFull } from '@/data/types/user-full';
import { Editor } from '@/app/dungeon/ui/editor/Editor';

type UserFormProps = {
  action: any;
  user?: UserFull | null;
};

export const UserForm = ({ action, user }: UserFormProps) => {
  const [longBio, setLongBio] = useState(user?.longBio || '');
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  console.log('🐤 LB', longBio);
  const actionWithBio = action.bind(null, longBio);
  const [_state, formAction, isPending] = useActionState(actionWithBio, {
    message: '',
    success: false,
    user: user || null,
  });

  return (
    <form
      className="w-full flex flex-col md:flex-row gap-2 h-full max-w-[1200px] mx-auto"
      action={formAction}
      method="post"
    >
      <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-1/3 justify-between ">
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            defaultValue={user?.name || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            defaultValue={user?.username || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={user?.email || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="shortBio">Bio</Label>
          <Textarea
            name="shortBio"
            placeholder="Short Bio"
            defaultValue={user?.shortBio!}
          />
        </section>

        <ImageUploadForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          image={avatar}
          setImage={setAvatar}
          group={'user'}
        />

        <section className="flex flex-col gap-2 ">
          <Label htmlFor="xLink">X</Label>
          <Input
            name="xLink"
            type="url"
            placeholder="X"
            defaultValue={user?.xLink || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="redditLink">Reddit</Label>
          <Input
            name="redditLink"
            type="url"
            placeholder="Reddit"
            defaultValue={user?.redditLink || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="githubLink">GitHub</Label>
          <Input
            name="githubLink"
            type="url"
            placeholder="GitHub"
            defaultValue={user?.githubLink || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="linkedInLink">LinkedIn</Label>
          <Input
            name="linkedInLink"
            type="url"
            placeholder="Linkedin"
            defaultValue={user?.linkedInLink || ''}
          />
        </section>
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="youtubeLink">YouTube</Label>
          <Input
            name="youtubeLink"
            type="url"
            placeholder="Youtube"
            defaultValue={user?.youtubeLink || ''}
          />
        </section>
      </section>
      <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-2/3 ">
        <section className="flex flex-col gap-2 flex-grow ">
          <Label htmlFor="longBio">Long Bio</Label>
          <Editor name="longBio" state={longBio} setState={setLongBio} />
        </section>
        <Button disabled={isPending} type="submit">
          Update
        </Button>
      </section>
    </form>
  );
};

export default UserForm;
