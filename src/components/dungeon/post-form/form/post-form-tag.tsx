'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NewTag, Tag } from '@/data/schema';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Dispatch, SetStateAction } from 'react';

type PostFormTagProps = {
  postTags: Tag[] | [];
  setPostTags: Dispatch<SetStateAction<NewTag[]>>;
  newTag: string;
  setNewTag: Dispatch<SetStateAction<string>>;
};

export function PostFormTag(props: PostFormTagProps) {
  return (
    <section className="flex flex-col gap-2">
      <Label htmlFor="tags">Tags</Label>
      <section className="flex gap-2 ">
        <Input
          name="tags"
          value={props.newTag}
          onChange={(e) => props.setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (props.newTag === '') return;
              if (
                props.postTags?.some(
                  (tag: Tag) => tag.slug === slugify(props.newTag),
                )
              ) {
                props.setNewTag('');
                return;
              }
              props.setPostTags([
                ...props.postTags,
                { name: props.newTag, slug: slugify(props.newTag) },
              ]);
              props.setNewTag('');
            }
          }}
        />

        <Button
          className="py-1"
          size={'icon'}
          variant={'secondary'}
          onClick={(e) => {
            e.preventDefault();
            if (props.newTag === '') return;
            props.setPostTags([
              ...props.postTags,
              { name: props.newTag, slug: slugify(props.newTag) },
            ]);
            props.setNewTag('');
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </section>

      <section className="flex flex-wrap gap-2">
        {props.postTags &&
          props.postTags?.map((tag: Tag) => (
            <div className="flex items-center space-x-2" key={tag.id}>
              <Checkbox
                name={'tags'}
                checked
                id={tag.slug}
                value={tag.slug}
                onClick={(e) => {
                  e.preventDefault();
                  props.setPostTags(
                    props.postTags.filter((t: Tag) => t.name !== tag.name),
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
  );
}
