// image-upload-dialog.tsx
import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { imageCreateAction } from '@/lib/actions/server-actions/image/image-create-action';
import type { InsertImagePayload } from './image-plugin';

interface ImageUploadDialogProps {
  onUploadSuccess: (payload: InsertImagePayload) => void;
}

// Handle image upload and form submission
export function ImageUploadDialog({ onUploadSuccess }: ImageUploadDialogProps) {
  const [state, formAction, isPending] = useActionState(imageCreateAction, {
    message: '',
    success: false,
    image: null,
  });

  useEffect(() => {
    if (state.success && state.image) {
      onUploadSuccess({
        altText: state.image.altText!,
        src: state.image.url,
        caption: state.image.caption!,
        group: state.image.group,
      });
      state.success = false;
    }

    if (!state.success && state.message !== '') {
      console.error('Image upload error:', state.message);
      state.message = '';
    }
  }, [state, onUploadSuccess]);

  return (
    <form className="flex flex-col gap-2 space-y-4" action={formAction}>
      <section className="flex flex-col gap-2">
        <Label htmlFor="file">File</Label>
        <Input name="file" type="file" accept="image/*" />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Input name="altText" placeholder="Alt Text" />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="caption">Caption</Label>
        <Input name="caption" placeholder="Caption" />
      </section>
      <Input type="hidden" name="group" value={'post'} />
      <Button variant={'secondary'} disabled={isPending}>
        {isPending ? 'Uploading...' : 'Confirm'}
      </Button>
    </form>
  );
}
