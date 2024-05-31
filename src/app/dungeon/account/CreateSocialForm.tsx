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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onFormAction } from "./actions";
import { newSocialSchema } from "./createSocialScema";

const CreateSocialForm = () => {
  const [state, formAction, isPending] = useActionState(onFormAction, {
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof newSocialSchema>>({
    resolver: zodResolver(newSocialSchema),
    defaultValues: {
      name: "",
      url: "",
      ...(state?.fields ?? {}),
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-2 w-full" variant="default">
          Add a Social
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a Social</DialogTitle>
          <DialogDescription>
            Add a social network to your profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {state?.message !== "" && !state.issues && (
            <div className="text-red-500">{state.message}</div>
          )}
          {state?.issues && (
            <div className="text-red-500">
              <ul>
                {state.issues.map((issue) => (
                  <li key={issue} className="flex gap-1">
                    <X fill="red" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form
            className=" flex flex-col gap-4 w-full max-w-[400px] mx-auto my-10"
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(
                async () => {
                  formAction(new FormData(formRef.current!));
                  form.reset();
                },
                (e) => {
                  console.log("form error", e);
                }
              )(evt);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Network Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the social network name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Url</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your social network profile url.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-2 flex-wrap">
              <DialogClose asChild>
                <Button variant="secondary">Done</Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSocialForm;
