'use client';

import { Button } from '@/components/shadcn/ui/button';
import { Category } from '@/data/schema';
import { categoryDeleteAction } from '@/data/actions/server-actions/category/category-delete-action';
import { Delete } from 'lucide-react';
import { Input } from '@/components/shadcn/ui/input';
import { useActionState } from 'react';
import { toast } from 'sonner';

export const CategoryRow = ({ cat }: { cat: Category }) => {
  const [state, formAction, isPending] = useActionState(categoryDeleteAction, {
    message: '',
    success: false,
  });

  if (state.success && state.message !== '') {
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
      <article
        key={cat.id}
        className="flex gap-2 items-center justify-between w-48"
      >
        <h2>{cat.name}</h2>
        <form action={formAction} method="post">
          <Input type="hidden" name="id" value={cat.id} />
          <Button asChild variant={'ghost'} size={'icon'} disabled={isPending}>
            <Delete className="h-4 w-4" />
          </Button>
        </form>
      </article>
    </>
  );
};
