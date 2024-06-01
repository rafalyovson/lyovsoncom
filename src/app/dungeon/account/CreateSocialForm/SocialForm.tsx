"use client";

import { Button } from "@/components/ui/button";
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
import { Dispatch, useActionState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createSocial } from "../actions";
import { newSocialSchema } from "../createSocialScema";

export const SocialForm = ({ setIsOpen }: { setIsOpen: Dispatch<boolean> }) => {
  const [state, formAction, isPending] = useActionState(createSocial, {
    message: "",
  });

  const form = useForm<z.infer<typeof newSocialSchema>>({
    resolver: zodResolver(newSocialSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      url: "",
      ...(state?.fields ?? {}),
    },
  });

  if (!state.issues && state.message !== "") {
    setIsOpen(false);
    return toast.success(state.message);
  }

  return (
    <Form {...form}>
      <form className=" flex flex-col gap-4 " action={formAction}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Network Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>Enter the social network name.</FormDescription>
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

        <Button disabled={isPending} type="submit">
          Add
        </Button>
      </form>
    </Form>
  );
};
