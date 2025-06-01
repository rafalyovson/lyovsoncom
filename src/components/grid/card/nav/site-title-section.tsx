import Link from 'next/link'

import { GridCardSection } from '../section'
import { Logo } from '@/components/Logo/Logo'

export const SiteTitleSection = () => {
  return (
    <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
      <Link className={` flex flex-col h-full justify-center items-center`} href="/">
        <Logo />
        <h1 className={`text-3xl text-center`}>Lyovson.com</h1>
      </Link>
    </GridCardSection>
  )
}
