"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dispatch, useActionState } from "react";
import { toast } from "sonner";
import { deleteSocial2 } from "../../actions";

export const DeleteSocial = ({
  id,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  id: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [state, formAction, isPending] = useActionState(deleteSocial2, {
    message: "",
  });

  if (state.message !== "") {
    setIsOpen(false);
    const msg = state.message;
    state.message = "";
    return toast.success(msg);
  }

  if (isDesktop) {
    return (
      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are You Sure?</DialogTitle>
            </DialogHeader>
            <form action={formAction}>
              <input type="hidden" name="id" value={id} />

              <Button
                className="w-full"
                type="submit"
                disabled={isPending}
                variant={"destructive"}
                onClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                    state.message = "Social Network deleted!";
                  }, 1500);
                }}
              >
                Delete
              </Button>
            </form>
            <DialogClose>
              <Button className="w-full" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="px-8">
        <DrawerHeader className="text-left">
          <DialogTitle>Are You Sure?</DialogTitle>
        </DrawerHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <Button
            className="w-full"
            type="submit"
            disabled={isPending}
            variant={"destructive"}
            onClick={() => {
              setTimeout(() => {
                setIsOpen(false);
                state.message = "Social Network deleted!";
              }, 1500);
            }}
          >
            Delete
          </Button>
        </form>
        <DrawerFooter className="px-0">
          <DrawerClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteSocial;
