"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Category } from "@/data/schema";
import { capitalize, slugify } from "@/lib/utils";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Editor } from "../editor/Editor";
import { PostImageForm } from "./post-image-form";

export function PostFormClient({
  post,
  action,
  allCats,
}: {
  post?: any;
  action: any;
  allCats: any;
}) {
  const [content, setContent] = useState(post?.content || "");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [postTags, setPostTags] = useState(post?.tags || []);
  const [newTag, setNewTag] = useState("");

  const [image, setImage] = useState(null);

  const actionWithContent = action.bind(null, content);
  const [state, formAction, isPending] = useActionState(actionWithContent, {
    message: "",
    success: false,
  });

  if (state.message !== "") {
    toast.success("Done!");
  }

  return (
    <>
      <form
        className="w-full flex flex-col md:flex-row gap-2 h-full max-w-[1200px] mx-auto"
        action={formAction}
      >
        <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-1/3 ">
          <section className="flex flex-col gap-2  ">
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Title"
              defaultValue={post?.title || ""}
            />
          </section>
          <section className="flex flex-col gap-2  ">
            <Label htmlFor="slug">Slug</Label>
            <Input
              name="slug"
              type="text"
              placeholder="Slug"
              defaultValue={post?.slug || ""}
            />
          </section>

          <PostImageForm
            isOpen={imageModalOpen}
            setIsOpen={setImageModalOpen}
            image={image}
            setImage={setImage}
          />

          <section className="flex flex-col gap-2 ">
            <Label htmlFor="published">Published</Label>
            <Switch name="published" defaultChecked={post?.published} />
          </section>

          <section className="flex flex-col gap-2 ">
            <Select name="type" defaultValue={post?.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select a post type" />
              </SelectTrigger>

              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {capitalize(type.type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={post?.category?.name}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    post?.categories[0]?.name
                      ? post.categories[0].name
                      : "Select a category"
                  }
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

          <section className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              name="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newTag === "") return;
                  setPostTags([
                    ...postTags,
                    { name: newTag, slug: slugify(newTag) },
                  ]);
                  setNewTag("");
                }
              }}
            />

            <Button
              onClick={(e) => {
                e.preventDefault();
                if (newTag === "") return;
                setPostTags([
                  ...postTags,
                  { name: newTag, slug: slugify(newTag) },
                ]);
                setNewTag("");
              }}
            >
              Add Tag
            </Button>

            <section className="flex flex-wrap gap-2">
              {postTags.map((tag: any) => (
                <div className="flex items-center space-x-2" key={tag.id}>
                  <Checkbox
                    name={"tags"}
                    checked
                    id={tag.slug}
                    value={tag.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      setPostTags(
                        postTags.filter((t: any) => t.name !== tag.name)
                      );
                    }}
                  />
                  <label
                    htmlFor={tag.slug}
                    className="text-sm font-medium leading-none "
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </section>
          </section>
        </section>

        <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-2/3 ]">
          <Editor state={content} setState={setContent} />

          <Button className="w-full" type="submit" disabled={isPending}>
            Submit
          </Button>
        </section>
      </form>
    </>
  );
}
