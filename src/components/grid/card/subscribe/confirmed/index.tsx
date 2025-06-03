import { GridCard, GridCardSection } from '@/components/grid'

export const GridCardSubscribeConfirmed = () => {
  return (
    <GridCard className="">
      <GridCardSection className="col-span-3 row-span-3 flex flex-col gap-4 items-center justify-center text-center glass-interactive">
        <h2 className="text-2xl font-bold glass-text">Subscription Confirmed!</h2>
      </GridCardSection>
    </GridCard>
  )
}
