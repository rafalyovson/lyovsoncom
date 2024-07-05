'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { imageGroups } from '@/data/image-groups';
import { Image } from '@/data/schema';
import { imageCreateAction } from '@/lib/actions/server-actions/image/image-create-action';
import { capitalize } from '@/lib/utils';
import { Dispatch, useActionState } from 'react';
import { toast } from 'sonner';

export const ImageForm = ({
  setImage,
  setIsOpen,
}: {
  setIsOpen?: Dispatch<boolean>;
  setImage?: Dispatch<Image | null>;
}) => {
  const [state, formAction, isPending] = useActionState(imageCreateAction, {
    message: '',
    success: false,
    image: null,
  });

  if (setImage && state.image) {
    setImage(state.image);
  }

  if (state.success && state.message === '') {
    toast.success(state.message);
    state.success = false;
    setIsOpen && setIsOpen(false);
  }

  if (!state.success && state.message !== '') {
    toast.error(state.message);
    state.message = '';
  }

  return (
    <form className="flex flex-col gap-4 p-4" action={formAction}>
      <section className="flex flex-col gap-2">
        <Label htmlFor="caption">Caption</Label>
        <Input name="caption" type="text" placeholder="Caption" />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Input name="altText" type="text" placeholder="Alt Text" />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="file">File</Label>
        <Input name="file" type="file" />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="group">Group</Label>
        <Select name="group">
          <SelectTrigger>
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {imageGroups.map((group: any) => (
              <SelectItem key={group} value={group}>
                {capitalize(group)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      <Button disabled={isPending}>Submit</Button>
    </form>
  );
};
