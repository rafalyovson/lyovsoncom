import { GridCard, GridCardSection } from "@/components/grid";

export const GridCardSubscribeConfirmed = () => {
  return (
    <GridCard className="">
      <GridCardSection className="glass-interactive col-span-3 row-span-3 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="glass-text font-bold text-2xl">
          Subscription Confirmed!
        </h2>
      </GridCardSection>
    </GridCard>
  );
};
