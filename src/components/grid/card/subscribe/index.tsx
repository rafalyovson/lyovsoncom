'use client'

import { useActionState } from 'react'

import { GridCardSection } from '../section'

import { SubscribeForm } from './subscribe-form'

import { GridCard } from '@/components/grid/'
import { cn } from '@/utilities/cn'
import { ActionResponse } from '@/actions/create-contact-action'

type GridCardSubscribeProps = {
  title?: string
  description?: string
  buttonText?: string
  emoji?: string
  className?: string
  projectId: number
  handleSubmit: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
}

export const GridCardSubscribe = ({
  title = 'Subscribe to my newsletter',
  description = 'Subscribe to my newsletter to stay up to date with my latest posts and projects.',
  buttonText = 'Subscribe',
  emoji = '👋',
  className,
  handleSubmit,
  projectId,
}: GridCardSubscribeProps) => {
  const [state, formAction] = useActionState(handleSubmit, {
    success: false,
    message: '',
  })

  return (
    <GridCard className={cn('col-start-1 col-end-2 row-start-2 row-end-3', className)}>
      <GridCardSection
        className={`row-start-1 ${state.message ? 'row-end-2' : 'row-end-3'} col-start-1 col-end-4 flex flex-col gap-2 items-center justify-center text-center`}
      >
        <div className={cn('text-2xl font-bold')} role="img" aria-label="Greeting">
          {emoji}
        </div>
        <h2 className={cn('text-2xl font-bold glass-text')}>{title}</h2>
        <p className={cn('text-sm glass-text-secondary')}>{description}</p>
      </GridCardSection>
      {state.message && (
        <GridCardSection
          className={cn(
            'row-start-2 row-end-3 col-start-1 col-end-4 flex justify-center items-center glass-interactive',
          )}
        >
          {state.success && (
            <div className={cn('text-2xl font-bold glass-text text-center')}>
              <p>✅ {state.message}</p>
            </div>
          )}
          {!state.success && (
            <div className={cn('text-2xl font-bold text-center glass-text')}>
              <p>⛔️ {state.message}</p>
            </div>
          )}
        </GridCardSection>
      )}

      <GridCardSection className={`row-start-3 row-end-4 col-start-1 col-end-4 glass-interactive`}>
        <SubscribeForm
          buttonText={buttonText}
          action={formAction}
          state={state}
          projectId={projectId}
        />
      </GridCardSection>
    </GridCard>
  )
}
