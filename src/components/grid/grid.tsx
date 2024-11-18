import React, { ReactNode } from 'react'

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid min-[420px]:grid-cols-1 max-[840px]:grid-cols-1 min-[840px]:grid-cols-2 max-[1260px]:grid-cols-2 min-[1260px]:grid-cols-3 max-[1680px]:grid-cols-3 min-[1680px]:grid-cols-4 max-[2100px]:grid-cols-4 min-[2100px]:grid-cols-5 max-[2520px]:grid-cols-5 min-[2520px]:grid-cols-6 mx-auto gap-4 place-items-center ">
      {children}
    </main>
  )
}
