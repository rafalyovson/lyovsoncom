import { GridCard, GridCardNavItem, GridCardSection } from '@/components/grid'
import { cn } from '@/lib/utils'
import { SiGithub, SiX } from '@icons-pack/react-simple-icons'
import Image from 'next/image'

type Props = {
  className?: string
}

export const GridCardRafa = ({ className }: Props) => {
  return (
    <GridCard
      className={cn(
        'row-span-2 g3:row-span-1 g3:col-span-2 h-[816px] g3:w-[816px] g3:h-[400px] grid-rows-6 g3:grid-cols-6 g3:grid-rows-3',
        className,
      )}
    >
      <GridCardSection
        className={cn(
          'row-start-2 row-end-5 col-start-1 col-end-4',
          'g3:row-start-1 g3:row-end-4 g3:col-start-1 g3:col-end-4',
        )}
      >
        <Image
          src={'/rafa-cozy.webp'}
          alt={'Rafa Lyóvson'}
          width={400}
          height={400}
          className="object-cover w-full h-full rounded-md"
        />
      </GridCardSection>

      <GridCardSection
        className={cn(
          'row-start-1 row-end-2 col-start-1 col-end-4 h-full flex flex-col justify-center',
          'g3:row-start-1 g3:row-end-2 g3:col-start-4 g3:col-end-8',
        )}
      >
        <h1 className={`text-2xl font-bold text-center glass-text`}>Rafa Lyóvson</h1>
        <p className={`text-sm text-center italic glass-text-secondary`}>Watcher on The Road 🛣️</p>
      </GridCardSection>
      <GridCardNavItem
        className={cn(
          'row-start-5 row-end-6 col-start-1 col-end-2',
          'g3:row-start-2 g3:row-end-3 g3:col-start-4 g3:col-end-5',
        )}
      >
        <a
          href={`https://x.com/rafalyovson`}
          target="_blank"
          aria-label={`Rafa Lyóvson on X.com`}
          className="flex flex-col items-center gap-2 justify-center hover:text-[var(--glass-text-secondary)] transition-colors duration-300"
        >
          <SiX size={24} className="text-current" />
          <span className="text-sm">x.com</span>
        </a>
      </GridCardNavItem>
      <GridCardNavItem
        className={cn(
          'row-start-5 row-end-6 col-start-2 col-end-3',
          'g3:row-start-2 g3:row-end-3 g3:col-start-5 g3:col-end-6',
        )}
      >
        <a
          href={`https://github.com/rafalyovson`}
          target="_blank"
          aria-label={`Rafa Lyóvson on GitHub`}
          className="flex flex-col items-center gap-2 justify-center hover:text-[var(--glass-text-secondary)] transition-colors duration-300"
        >
          <SiGithub size={24} className="text-current" />
          <span className="text-sm">GitHub</span>
        </a>
      </GridCardNavItem>
    </GridCard>
  )
}
