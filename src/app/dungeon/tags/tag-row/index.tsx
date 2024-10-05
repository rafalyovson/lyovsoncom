'use client';

import { Button } from '@/components/ui/button';
import { Tag } from '@/data/schema';
import { tagDeleteAction } from '@/lib/actions/server-actions/tag/tag-delete-action';
import { Delete } from 'lucide-react';

export const TagRow = ({ cat }: { cat: Tag }) => {
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
            tagDeleteAction(cat.id);
          }}
        >
          <Delete className="h-4 w-4" />
        </Button>
      </article>
    </>
  );
};
