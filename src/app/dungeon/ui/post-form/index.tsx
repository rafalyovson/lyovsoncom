"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Post, posts } from "@/data/schema";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUpload } from "./image-upload";

const PostSchema = createInsertSchema(posts, {
  title: z.string().trim().min(1, { message: "Title is required" }),
  authorId: z.string().uuid().optional(),
  featuredImg: z.string().url().optional(),
});

export function PostForm({ post, action }: { post?: Post; action: any }) {
  const [state, formAction, isPending] = useActionState(action, {
    message: "",
    url: "",
    slug: post?.slug || "",
  });

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const form = useForm<z.infer<typeof PostSchema>>({
    mode: "all",
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      featuredImg: post?.featuredImg || "",
      published: post?.published || false,
      authorId: post?.authorId || "",
    },
  });

  if (state.message !== "") {
    toast.success("Post Created!");
    redirect(state.url);
  }

  return (
    <>
      <Form {...form}>
        <form className="w-full space-y-6" action={formAction}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      form.setValue("slug", slugify(e.target.value));
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>Post title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Post slug used in URLs.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featuredImg"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <>
                    <Input
                      className="hidden"
                      {...field}
                      onChange={(e) => onChange(e)}
                      value={value || ""}
                    />
                    {form.getValues("featuredImg") && (
                      <Card>
                        <CardContent className="pt-6">
                          <Image
                            src={form.getValues("featuredImg")!}
                            alt={"image"}
                            width={400}
                            height={400}
                            className="mx-auto"
                          />
                        </CardContent>
                      </Card>
                    )}
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setImageModalOpen(true);
                      }}
                      variant={"secondary"}
                    >
                      Upload Image
                    </Button>
                  </>
                </FormControl>
                <FormDescription>Featured image for the post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>Check to publish the post.</FormDescription>
                </div>
                <FormControl>
                  <Switch name="published" defaultChecked={post?.published} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Post body goes here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>

      <ImageUpload
        isOpen={imageModalOpen}
        form={form}
        setIsOpen={setImageModalOpen}
        oldImage={post?.featuredImg || ""}
      />
    </>
  );
}
