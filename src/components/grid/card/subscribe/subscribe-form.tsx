"use client";

import type { ActionResponse } from "@/actions/create-contact-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubscribeFormProps = {
  buttonText: string;
  action: (formData: FormData) => void;
  state: ActionResponse;
  projectId: number;
};

export function SubscribeForm({
  buttonText,
  action,
  state,
  projectId,
}: SubscribeFormProps) {
  return (
    <form
      action={action}
      className="grid h-full grid-cols-2 grid-rows-2 items-center gap-2"
    >
      <Input
        aria-label="First Name"
        name="firstName"
        placeholder="First Name"
        required
        type="text"
      />

      <Input
        aria-label="Last Name"
        name="lastName"
        placeholder="Last Name"
        type="text"
      />

      <Input
        aria-label="Email"
        name="email"
        placeholder="Email"
        required
        type="email"
      />

      <Button className="grow" type="submit">
        {buttonText}
      </Button>

      <input name="projectId" type="hidden" value={projectId} />
    </form>
  );
}
