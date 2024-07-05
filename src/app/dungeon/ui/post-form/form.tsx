'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { contentTypes } from '@/data/content-types';
import { Category, User } from '@/data/schema';
import { capitalize, cn, slugify } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';
import { Editor } from '../editor/Editor';
import { ImageUploadForm } from '../image-uplaod-form';

export function PostFormClient({
  post,
  action,
  allCats,
  authors,
}: {
  post?: any;
  action: any;
  allCats: any;
  authors: any;
}) {
  const [content, setContent] = useState(post?.content || '');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [postTags, setPostTags] = useState(post?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [date, setDate] = useState<Date>(post?.createdAt || new Date());
  const [title, setTitle] = useState(post?.title || '');
  const [image, setImage] = useState(post?.featuredImage || null);

  const actionWithContent = action.bind(null, content);
  const [state, formAction, isPending] = useActionState(actionWithContent, {
    message: '',
    success: false,
    post: post || null,
  });

  if (state.success) {
    toast.success(state.message);
    state.success = false;
    state.message = '';
  }

  if (!state.success && state.message !== '') {
    toast.error(state.message);
    state.message = '';
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
              value={title}
              onChange={(e) => setTitle(() => e.target.value)}
            />
          </section>

          <section className="flex flex-col gap-2">
            <Label htmlFor="authorId">Author</Label>
            <Select name="authorId" defaultValue={post?.author?.id || ''}>
              <SelectTrigger>
                <SelectValue
                  placeholder={post?.author?.name || 'Choose the author'}
                />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author: User) => (
                  <SelectItem key={author.id} value={author.id}>
                    {capitalize(author.name!)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <ImageUploadForm
            isOpen={imageModalOpen}
            setIsOpen={setImageModalOpen}
            image={image}
            setImage={setImage}
          />

          <section className="flex flex-col gap-2">
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              className="hidden"
              name="createdAt"
              type="string"
              value={date?.toDateString()}
              defaultValue={
                post?.createdAt?.toDateString() || new Date().toDateString()
              }
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(e) => setDate(new Date(e!))}
                  initialFocus
                  defaultMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </section>

          <section className="flex flex-col gap-2 ">
            <Label htmlFor="published">Published</Label>
            <Switch name="published" defaultChecked={post?.published} />
          </section>

          <section className="flex flex-col gap-2 ">
            <Label htmlFor="type">Type</Label>
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
            <Select name="category" defaultValue={post?.categories?.[0]?.name}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    post?.categories[0]?.name
                      ? post.categories[0].name
                      : 'Select a category'
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
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newTag === '') return;
                  setPostTags([
                    ...postTags,
                    { name: newTag, slug: slugify(newTag) },
                  ]);
                  setNewTag('');
                }
              }}
            />

            <Button
              onClick={(e) => {
                e.preventDefault();
                if (newTag === '') return;
                setPostTags([
                  ...postTags,
                  { name: newTag, slug: slugify(newTag) },
                ]);
                setNewTag('');
              }}
            >
              Add Tag
            </Button>

            <section className="flex flex-wrap gap-2">
              {postTags.map((tag: any) => (
                <div className="flex items-center space-x-2" key={tag.id}>
                  <Checkbox
                    name={'tags'}
                    checked
                    id={tag.slug}
                    value={tag.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      setPostTags(
                        postTags.filter((t: any) => t.name !== tag.name),
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
