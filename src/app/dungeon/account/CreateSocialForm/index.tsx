"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dispatch } from "react";
import { SocialForm } from "./SocialForm";

const CreateSocialForm = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
          <SocialForm setIsOpen={setIsOpen} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Done</Button>
            </DialogClose>
          </DialogFooter>
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
        <SocialForm setIsOpen={setIsOpen} />
        <DrawerFooter className="px-0">
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Done
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default CreateSocialForm;
