"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SocialNetwork } from "@/data/schema";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteSocial } from "./actions";
import CreateSocialForm from "./CreateSocialForm";

const SocialTable = (socials: any) => {
  const [isCreatingSocial, setIsCreatingSocial] = useState(false);
  const [isDeletingSocial, setIsDeletingSocial] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <Card className="flex-grow">
      <CardHeader className="px-7">
        <CardTitle>Social Networks</CardTitle>
        <CardDescription>Your social networks.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-end">
        {socials.socials.map((social: SocialNetwork) => (
          <section
            key={social.id}
            className="flex border-b w-full justify-end "
          >
            <Button asChild variant="link">
              <a target="_blank" rel="noopener" href={social.url!} className="">
                <h2>{social.name}</h2>
              </a>
            </Button>

            <Button variant="ghost" onClick={() => setIsDeletingSocial(true)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Dialog open={isDeletingSocial} onOpenChange={setIsDeletingSocial}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are You Sure?</DialogTitle>
                </DialogHeader>
                <Button
                  disabled={isPending}
                  variant={"destructive"}
                  onClick={() => {
                    startTransition(() => deleteSocial(social.id));
                    return toast.success("Social Network deleted");
                  }}
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button variant={"secondary"}>Cancel</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </section>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={() => setIsCreatingSocial(true)}
        >
          Add Social
        </Button>
        <CreateSocialForm
          isOpen={isCreatingSocial}
          setIsOpen={setIsCreatingSocial}
        />
      </CardFooter>
    </Card>
  );
};

export default SocialTable;
