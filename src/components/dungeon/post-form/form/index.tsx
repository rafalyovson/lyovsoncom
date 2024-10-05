'use client';

import { Button } from '@/components/shadcn/ui/button';
import { Calendar } from '@/components/shadcn/ui/calendar';
import { Input } from '@/components/shadcn/ui/input';
import { Label } from '@/components/shadcn/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/ui/select';
import { Switch } from '@/components/shadcn/ui/switch';
import { contentTypes } from '@/data/misc/content-types';
import { Category, NewTag, Tag, User } from '@/data/schema';
import { capitalize, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';
import { Editor } from '@/components/lexical/Editor';
import { ImageUploadForm } from '../../image-uplaod-form';
import { PostFormTag } from './post-form-tag';
import { PostFull } from '@/data/types';
import { PostFormCategory } from '@/components/dungeon/post-form/form/post-form-category';
import { redirect } from 'next/navigation';
import { postOneAction } from '@/data/types/post-types';

type PostFormClientProps = {
  post?: PostFull;
  action: postOneAction;
  allCats: Category[];
  authors: User[];
};

export function PostFormClient({
  post,
  action,
  allCats,
  authors,
}: PostFormClientProps) {
  const [content, setContent] = useState(post?.content || null); // Initialize content state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [postTags, setPostTags] = useState((post?.tags as NewTag[]) || []);
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

  if (state.success && state.post) {
    redirect(`/posts/${state.post.slug}`);
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
        <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-1/3 justify-between ">
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
            group={'post'}
          />

          <section className="flex flex-col gap-2">
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              className="hidden"
              name="createdAt"
              type="string"
              value={date.toDateString()}
              readOnly
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
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={post?.type || 'article'}>
              <SelectTrigger>
                <SelectValue placeholder={post?.type || 'Article'} />
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

          <PostFormCategory allCats={allCats} post={post} />

          <PostFormTag
            postTags={postTags as Tag[]}
            setPostTags={setPostTags}
            newTag={newTag}
            setNewTag={setNewTag}
          />

          <section className="flex gap-2 justify-between">
            <Label htmlFor="published">Published</Label>
            <Switch name="published" defaultChecked={post?.published} />
          </section>

          <section className="flex gap-2 justify-between">
            <Label htmlFor="featured">Featured</Label>
            <Switch name="featured" defaultChecked={post?.featured} />
          </section>
        </section>
        <section className="flex flex-col gap-2 p-4 border rounded-md space-y-6 md:w-2/3 ">
          <Editor state={content || null} setStateAction={setContent} />

          <Button className="w-full" type="submit" disabled={isPending}>
            Submit
          </Button>
        </section>
      </form>
    </>
  );
}
