'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { CategoryOneResponse } from '@/lib/actions/db-actions/category';

type CategoryFormProps = {
  action: (
    _prevState: CategoryOneResponse,
    formData: FormData,
  ) => Promise<CategoryOneResponse>;
};

export const CategoryForm = ({ action }: CategoryFormProps) => {
  const [state, formAction, isPending] = useActionState(action, {
    message: '',
    success: false,
    category: null,
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
    <form action={formAction} className="flex flex-col gap-4 p-4">
      <section>
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" />
      </section>
      <section>
        <Label htmlFor="slug">Slug</Label>
        <Input type="text" id="slug" name="slug" />
      </section>
      <Button disabled={isPending} variant={'secondary'}>
        Add
      </Button>
    </form>
  );
};
