import { GridCard } from '@/components/grid/grid-card';
import Link from 'next/link';

export const GridCardHero = async () => {
  return (
    <GridCard>
      <Link
        className={`border row-start-1 row-end-3 col-start-1 col-end-4 flex flex-col justify-center items-center p-2 bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1c1c1e] dark:to-[#121212] rounded-lg shadow-md hover:shadow-lg `}
        href="/"
      >
        <h1 className={`text-3xl text-center my-10`}>Lyovson.com</h1>
      </Link>
      <div
        className={`border row-start-3 row-end-4 col-start-1 col-end-4 p-2 flex flex-col gap-2 justify-center items-center `}
      >
        The official site of Mr and Mrs Lyovsons.
      </div>
    </GridCard>
  );
};
