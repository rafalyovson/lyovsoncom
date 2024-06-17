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
import { imageCreate } from "@/lib/actions/image-create";
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

  const [state, formAction, isPending] = useActionState(imageCreate, {
    url: "",
    oldImage: oldImage || "",
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
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload the featured image of the post.
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
      <DrawerContent className="p-8 ">
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload Image</DrawerTitle>
          <DrawerDescription>
            Upload the featured image of the post.
          </DrawerDescription>
        </DrawerHeader>
        <ImageForm form={form} formAction={formAction} isPending={isPending} />
      </DrawerContent>
    </Drawer>
  );
};
