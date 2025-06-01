import React from 'react'
import { Metadata } from 'next/types'

import { GridCardNotFound, GridCardNav } from '@/components/grid'

export default function NotFound() {
  return (
    <>
      <GridCardNotFound />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Not Found | Lyovson.com',
  description: 'The requested page could not be found',
}
