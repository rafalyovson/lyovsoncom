'use client';

import { Button } from '@/components/ui/button';
import { Category } from '@/data/schema';
import { categoryDelete } from '@/lib/actions/server-actions/category-delete';
import { Delete } from 'lucide-react';

export const CategoryRow = ({ cat }: { cat: Category }) => {
  return (
    <>
      <article
        key={cat.id}
        className="flex gap-2 items-center justify-between w-48"
      >
        <h2>{cat.name}</h2>
        <Button
          asChild
          variant={'ghost'}
          size={'icon'}
          onClick={() => {
            categoryDelete(cat.id);
          }}
        >
          <Delete className="h-4 w-4" />
        </Button>
      </article>
    </>
  );
};
