import { GridCard, GridCardNavItem, GridCardSection } from '@/components/grid'
import { cn } from '@/lib/utils'
import { SiGithub, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import Image from 'next/image'

type Props = {
  className?: string
}

export const GridCardRafa = ({ className }: Props) => {
  return (
    <GridCard className={className}>
      <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-3 `}>
        <Image
          src={'/rafa-cozy.webp'}
          alt={'Rafa Lyovson'}
          width={400}
          height={400}
          className="object-cover w-full h-full"
        />
      </GridCardSection>

      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center`}
      >
        <h1 className={`text-2xl text-bold text-center`}>Rafa Lyovson</h1>
        <p className={`text-sm text-center italic`}>Common sense guardian</p>
      </GridCardSection>
      <GridCardNavItem className={cn('row-start-1 row-end-2 col-start-3 col-end-4')}>
        <a
          href={`https://x.com/lyovson`}
          aria-label={`Rafa Lyovson on X`}
          className=" flex flex-col items-center gap-2 justify-center"
        >
          <SiX size={24} className="text-current" />
          <span className="">x.com</span>
        </a>
      </GridCardNavItem>
      <GridCardNavItem className={cn('row-start-2 row-end-3 col-start-3 col-end-4')}>
        <a
          href={`https://github.com/lyovson`}
          aria-label={`Rafa Lyovson on GitHub`}
          className=" flex flex-col items-center gap-2 justify-center"
        >
          <SiGithub size={24} className="text-current" />
          <span className="">GitHub</span>
        </a>
      </GridCardNavItem>
    </GridCard>
  )
}
