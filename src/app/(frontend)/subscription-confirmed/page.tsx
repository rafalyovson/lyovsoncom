import { GridCardHeader } from '@/components/grid'
import { GridCardSubscribeConfirmed } from '@/components/grid'
import { Metadata } from 'next'

export default function SubscriptionConfirmed() {
  return (
    <>
      <GridCardHeader />
      <GridCardSubscribeConfirmed />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Subscription Confirmed | Lyovson.com',
  description: 'Subscription Confirmed for Lyovson.com',
}
