"use client";

import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { posts } from "@/data/schema";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "./image-upload";

const PostSchema = createInsertSchema(posts, {
  title: z.string().trim().min(1, { message: "Title is required" }),
  authorId: z.string().uuid().optional(),
  featuredImg: z.string().url().optional(),
});
export function InputForm() {
  const form = useForm<z.infer<typeof PostSchema>>({
    mode: "all",
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      featuredImg: "",
      published: false,
      authorId: "",
    },
  });

  const [imageModalOpen, setImageModalOpen] = useState(false);

  function onSubmit(data: z.infer<typeof PostSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
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
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>Check to publish the post.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
                      {...field}
                      onChange={(e) => onChange(e)}
                      value={value || ""}
                      disabled
                    />
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

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>

      <ImageUpload
        isOpen={imageModalOpen}
        form={form}
        setIsOpen={setImageModalOpen}
      />
    </>
  );
}
