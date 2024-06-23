"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { imageCreate } from "@/lib/actions/image-create-2";
import { useActionState } from "react";
import { toast } from "sonner";
const ImageCreate = () => {
  const [state, formAction, isPending] = useActionState(imageCreate, {
    message: "",
    success: false,
  });

  if (state.success) {
    toast.success("Image created!");
    state.success = false;
  }

  return (
    <article className="max-w-[600px] mx-auto">
      <h1 className="text-2xl text-center">New Image</h1>
      <form className="flex flex-col gap-4 p-4" action={formAction}>
        <section className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" placeholder="Name" />
        </section>
        <section className="flex flex-col gap-2">
          <Label htmlFor="alt">Alt Text</Label>
          <Input name="alt" type="text" placeholder="Alt Text" />
        </section>

        <section className="flex flex-col gap-2">
          <Label htmlFor="file">File</Label>
          <Input name="file" type="file" />
        </section>

        <section className="flex flex-col gap-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type">
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="post">Post</SelectItem>
            </SelectContent>
          </Select>
        </section>
        <Button disabled={isPending}>Submit</Button>
      </form>
    </article>
  );
};

export default ImageCreate;
