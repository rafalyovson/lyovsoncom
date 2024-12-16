import { GridCard, GridCardSection } from '@/components/grid'

export const GridCardSubscribeConfirmed = () => {
  return (
    <GridCard className="">
      <GridCardSection className="col-span-3 row-span-3 flex flex-col gap-4 items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Subscription Confirmed!</h1>
      </GridCardSection>
    </GridCard>
  )
}
