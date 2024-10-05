'use client';

import { Label } from '@/components/shadcn/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/ui/select';
import { Category } from '@/data/schema';
import { capitalize } from '@/lib/utils';
import { PostFull } from '@/data/types';

type PostFormCategoryProps = {
  allCats: Category[];
  post?: PostFull;
};

export function PostFormCategory({ allCats, post }: PostFormCategoryProps) {
  return (
    <section className="flex flex-col gap-2">
      <Label htmlFor="category">Category</Label>
      <Select name="category" defaultValue={post?.categories?.[0]?.name}>
        <SelectTrigger>
          <SelectValue
            placeholder={post?.categories?.[0]?.name || 'Select a category'}
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
  );
}
