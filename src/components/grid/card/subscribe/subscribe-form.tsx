'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type ActionResponse } from '@/actions/create-contact-action'

type SubscribeFormProps = {
  buttonText: string
  action: (formData: FormData) => void
  state: ActionResponse
  projectId: number
}

export function SubscribeForm({ buttonText, action, state, projectId }: SubscribeFormProps) {
  return (
    <form action={action} className="grid grid-cols-2 grid-rows-2 gap-2 h-full items-center">
      <Input
        type="text"
        name="firstName"
        placeholder="First Name"
        required
        aria-label="First Name"
      />

      <Input type="text" name="lastName" placeholder="Last Name" aria-label="Last Name" />

      <Input type="email" name="email" placeholder="Email" required aria-label="Email" />

      <Button type="submit" className="grow">
        {buttonText}
      </Button>

      <input type="hidden" name="projectId" value={projectId} />
    </form>
  )
}
