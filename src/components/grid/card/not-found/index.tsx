
import React from 'react'

import { GridCard, GridCardSection } from '@/components/grid'
import { cn } from '@/utilities/cn'


export function GridCardNotFound({ className }: { className?: string }) {
  return (
    <GridCard className={cn(className)}>
      <GridCardSection className="row-span-3 col-span-3 flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p>This page could not be found.</p>
      </GridCardSection>
    </GridCard>
  )
}
