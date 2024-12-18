import React from 'react'
import { GridCardNotFound, GridCardHeader } from '@/components/grid'
import { Metadata } from 'next/types'

export default function NotFound() {
  return (
    <>
      <GridCardHeader />
      <GridCardNotFound />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Not Found | Lyovson.com',
  description: 'The requested page could not be found',
}
