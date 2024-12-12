'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/cn'
import { type ActionResponse } from '@/actions/create-contact-action'

type SubscribeFormProps = {
  buttonText: string
  action: (formData: FormData) => void
  state: ActionResponse
  projectId: number
}

export function SubscribeForm({ buttonText, action, state, projectId }: SubscribeFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.message && (
        <p className={cn('text-sm', state.success ? 'text-green-500' : 'text-red-500')}>
          {state.message}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          aria-label="Email"
          className={cn(state?.errors?.email && 'border-red-500')}
        />
        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          aria-label="First Name"
          className={cn(state?.errors?.firstName && 'border-red-500')}
        />
        {state?.errors?.firstName && (
          <p className="text-sm text-red-500">{state.errors.firstName}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          aria-label="Last Name"
          className={cn(state?.errors?.lastName && 'border-red-500')}
        />
        {state?.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName}</p>}
      </div>
      <input type="hidden" name="projectId" value={projectId} />
      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  )
}
