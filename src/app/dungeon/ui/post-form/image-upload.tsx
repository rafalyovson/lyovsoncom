import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { uploadImage } from "@/lib/actions";
import { Dispatch, useActionState } from "react";

const ImageForm = ({
  form,
  formAction,
  isPending,
}: {
  form: any;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) => {
  return (
    <form action={formAction}>
      <section className="flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={`featured_image_for_${form.getValues("slug")}`}
            required
          />
        </section>

        <section className="flex flex-col gap-2">
          <Label>Choose File</Label>
          <Input type="file" id="image" name="image" required />
        </section>
        <Button type="submit" variant={"default"} disabled={isPending}>
          Upload
        </Button>
      </section>
    </form>
  );
};

export const ImageUpload = ({
  form,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  form: any;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [state, formAction, isPending] = useActionState(uploadImage, {
    url: "",
  });

  if (state.url !== "") {
    form.setValue("featuredImg", state.url);
    setIsOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Social</DialogTitle>
            <DialogDescription>
              Add a social network to your profile.
            </DialogDescription>
          </DialogHeader>
          <ImageForm
            form={form}
            formAction={formAction}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="px-8">
        <DrawerHeader className="text-left">
          <DrawerTitle>Add a Social</DrawerTitle>
          <DrawerDescription>
            Add a social network to your profile.
          </DrawerDescription>
        </DrawerHeader>
        <ImageForm form={form} formAction={formAction} isPending={isPending} />
      </DrawerContent>
    </Drawer>
  );
};
