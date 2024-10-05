/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const useDialog = (): [
  JSX.Element | null,
  ({
    isOpen,
    setIsOpen,
    title,
    desc,
    getContent,
    isModal,
  }: {
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
    title: string;
    desc: string;
    getContent: () => JSX.Element;
    isModal: boolean;
  }) => void
] => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [dialogContent, setDialogContent] = useState<null | {
    isModal: boolean;
    content: JSX.Element;
    title: string;
    desc: string;
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
  }>(null);

  const dialog = useMemo(() => {
    if (dialogContent === null) {
      return null;
    }

    const { isOpen, setIsOpen, title, desc, content, isModal } = dialogContent;

    console.log("dialog", dialogContent);

    if (isDesktop)
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal={isModal}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{desc}</DialogDescription>
            </DialogHeader>
            {content}
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      );

    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen} modal={isModal}>
        <DrawerContent className=" p-8">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{desc}</DrawerDescription>
          </DrawerHeader>
          {content}
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }, [dialogContent, isDesktop]);

  const showDialog = ({
    isOpen,
    setIsOpen,
    title,
    desc,
    getContent,
    isModal,
  }: {
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
    title: string;
    desc: string;
    getContent: () => JSX.Element;
    isModal: boolean;
  }) => {
    console.log("showDialog", isOpen);
    setDialogContent({
      isModal,
      content: getContent(),
      title,
      desc,
      isOpen,
      setIsOpen,
    });
  };

  return [dialog, showDialog];
};
