'use client';

import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Label } from '@/components/shadcn/ui/label';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { TagOneResponse } from '@/data/actions/db-actions/tag';

type TagFormProps = {
  action: (
    _prevState: TagOneResponse,
    formData: FormData,
  ) => Promise<TagOneResponse>;
};

export const TagForm = ({ action }: TagFormProps) => {
  const [state, formAction, isPending] = useActionState(action, {
    message: '',
    success: false,
    tag: null,
  });

  if (state.message === 'success') {
    toast.success('Successfully added tag');
    state.message = '';
  }

  if (state.message === 'error') {
    toast.error('Error adding tag');
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
