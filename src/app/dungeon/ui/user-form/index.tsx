"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent } from "@radix-ui/react-dialog";
import { useActionState, useState } from "react";
import { ImageForm } from "../image-form";

export const UserForm = ({ action, user }: { action: any; user?: any }) => {
  const [_state, formAction, isPending] = useActionState(action, {
    message: "",
    success: false,
  });

  const [image, _setImage] = useState(user?.imageId || "");

  return (
    <form
      className="flex flex-col space-y-6 p-4"
      action={formAction}
      method="post"
    >
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          type="text"
          placeholder="Name"
          defaultValue={user.name || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="name">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={user.email || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="bio">Bio</Label>
        <Textarea name="bio" placeholder="Bio" defaultValue={user.bio!} />
      </section>

      {image && (
        <section className="flex flex-col gap-2 ">
          <Label htmlFor="imageId">Image</Label>
          <Input
            name="imageId"
            type="text"
            placeholder="Image"
            defaultValue={user.imageId || ""}
          />
        </section>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload Image</Button>
        </DialogTrigger>
        <DialogContent className="p-8">
          <ImageForm />
        </DialogContent>
      </Dialog>

      <section className="flex flex-col gap-2 ">
        <Label htmlFor="xLink">X</Label>
        <Input
          name="xLink"
          type="url"
          placeholder="X"
          defaultValue={user.xLink || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="redditLink">Reddit</Label>
        <Input
          name="redditLink"
          type="url"
          placeholder="Reddit"
          defaultValue={user.redditLink || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="githubLink">GitHub</Label>
        <Input
          name="githubLink"
          type="url"
          placeholder="GitHub"
          defaultValue={user.githubLink || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="linkedInLink">LinkedIn</Label>
        <Input
          name="linkedInLink"
          type="url"
          placeholder="Linkedin"
          defaultValue={user.linkedInLink || ""}
        />
      </section>
      <section className="flex flex-col gap-2 ">
        <Label htmlFor="youtubeLink">YouTube</Label>
        <Input
          name="youtubeLink"
          type="url"
          placeholder="Youtube"
          defaultValue={user.youtubeLink || ""}
        />
      </section>
      <Button disabled={isPending} type="submit">
        Update
      </Button>
    </form>
  );
};

export default UserForm;
