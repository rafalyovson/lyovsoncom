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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { contentTypes } from "@/data/content-types";
import { Category, posts } from "@/data/schema";
import { capitalize, slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Editor } from "../editor/Editor";
import { ImageUpload } from "./image-upload";

const PostSchema = createInsertSchema(posts, {
  id: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  title: z.string().trim().min(1, { message: "Title is required" }),
  featuredImg: z.string().url(),
  published: z.boolean(),
  type: z.string(),
  content: z.string(),
  createdAt: z.string().optional(),
  slug: z.string(),
  metadata: z.any().optional(),
});

export function PostFormClient({
  post,
  action,
  allCats,
  allTags,
}: {
  post?: any;
  action: any;
  allCats: any;
  allTags: any;
}) {
  const [content, setContent] = useState(post?.post.content || "");
  const newAction = action.bind(null, content);
  const [state, formAction, isPending] = useActionState(newAction, {
    message: "",
    url: "",
    slug: post?.post.slug || "",
  });

  console.log(allTags);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const form = useForm<z.infer<typeof PostSchema>>({
    mode: "all",
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: post?.post.title || "",
      slug: post?.post.slug || "",
      type: post?.post.type || "article",
      featuredImg: post?.post.featuredImg || "",
      published: post?.post.published || false,
      authorId: post?.post.authorId || "",
    },
  });

  if (state.message !== "") {
    toast.success("Done!");
    redirect(state.url);
  }

  return (
    <>
      <Form {...form}>
        <form
          className="w-full flex flex-col md:flex-row gap-2 h-full max-w-[1200px] mx-auto"
          action={formAction}
        >
          <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-1/3 ">
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
                  <FormDescription>
                    Featured image for the post.
                  </FormDescription>
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
                    <FormDescription>
                      Check to publish the post.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="published"
                      defaultChecked={post?.post.published}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a post type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          {capitalize(type.type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...field} />
                  <FormDescription>
                    Choose the post type. This will determine the content
                    format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue
                    placeholder={post?.category.name ?? "Select a category"}
                  />
                </SelectTrigger>

                <SelectContent>
                  {allCats.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {capitalize(cat.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
          </section>
          <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-2/3 ]">
            <Editor state={content} setState={setContent} />

            <Button className="w-full" type="submit" disabled={isPending}>
              Submit
            </Button>
          </section>
        </form>
      </Form>

      <ImageUpload
        isOpen={imageModalOpen}
        form={form}
        setIsOpen={setImageModalOpen}
        oldImage={post?.post.featuredImg || ""}
      />
    </>
  );
}
