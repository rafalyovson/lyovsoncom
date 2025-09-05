import Link from 'next/link'

import { Logo } from '@/components/Logo/Logo'
import { GridCardSection } from '../section'

export const SiteTitleSection = () => {
  return (
    <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
      <Link
        className={`flex flex-col h-full justify-center items-center hover:scale-105 transition-transform duration-300`}
        href="/"
      >
        <Logo />
        <div
          className={`text-3xl text-center font-bold glass-text`}
          role="banner"
          aria-label="Site title"
        >
          Lyóvson.com
        </div>
      </Link>
    </GridCardSection>
  )
}
