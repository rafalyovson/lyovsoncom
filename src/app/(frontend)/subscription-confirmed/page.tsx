import { Metadata } from 'next'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { GridCardSubscribeConfirmed } from '@/components/grid'
import { GridCardNav } from 'src/components/grid/card/nav'

export default async function SubscriptionConfirmed() {
  'use cache'
  cacheTag('subscription-confirmed')
  cacheLife('static') // Static confirmation page

  return (
    <>
      <GridCardNav />
      <GridCardSubscribeConfirmed />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Subscription Confirmed | Lyovson.com',
  description: 'Subscription confirmed for Lyovson.com',
  alternates: {
    canonical: '/subscription-confirmed',
  },
}
