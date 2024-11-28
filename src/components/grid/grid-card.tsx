import React, { ReactNode } from 'react'

export const GridCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <article
      className={`grid grid-cols-3 grid-rows-3 border w-full h-full min-w-[400px] min-h-[400px] rounded-lg shadow-md hover:shadow-lg gap-2 p-2  aspect-square ${className}`}
    >
      {children}
    </article>
  )
}
