import { GridCard } from '@/components/grid/grid-card'
import { GridCardSection } from '@/components/grid/grid-card-section'

export default function SubscriptionConfirmed() {
  return (
    <GridCard className="col-start-1 col-end-2 row-start-2 row-end-3">
      <GridCardSection className="flex flex-col gap-4 items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Subscription Confirmed!</h1>
        <p>Thank you for confirming your subscription.</p>
        <p>You&apos;ll now receive updates from us.</p>
      </GridCardSection>
    </GridCard>
  )
}
