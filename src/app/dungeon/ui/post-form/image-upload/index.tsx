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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { uploadImage } from "@/lib/actions/upload-image";
import { Dispatch, useActionState } from "react";
import { toast } from "sonner";
import ImageForm from "./image-form";

export const ImageUpload = ({
  form,
  isOpen,
  setIsOpen,
  oldImage,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  form: any;
  oldImage?: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [state, formAction, isPending] = useActionState(uploadImage, {
    url: "",
    oldImage: oldImage || " a ",
  });

  if (state.url !== "") {
    form.setValue("featuredImg", state.url);
    state.url = "";
    setIsOpen(false);
    toast.success("Image uploaded!");
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
