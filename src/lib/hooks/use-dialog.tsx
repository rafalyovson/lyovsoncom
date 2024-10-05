import { Dispatch, ReactElement, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/shadcn/ui/drawer';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const useDialog = (): [
  ReactElement | null,
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
    getContent: () => ReactElement;
    isModal: boolean;
  }) => void,
] => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [dialogContent, setDialogContent] = useState<null | {
    isModal: boolean;
    content: ReactElement;
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

    console.log('dialog', dialogContent);

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
    getContent: () => ReactElement;
    isModal: boolean;
  }) => {
    console.log('showDialog', isOpen);
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
