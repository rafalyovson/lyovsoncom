import { Metadata } from 'next'

import { GridCardSubscribeConfirmed } from '@/components/grid'
import { GridCardNav } from 'src/components/grid/card/nav'

export default function SubscriptionConfirmed() {
  return (
    <>
      <GridCardNav />
      <GridCardSubscribeConfirmed />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Subscription Confirmed | Lyovson.com',
  description: 'Subscription Confirmed for Lyovson.com',
}
