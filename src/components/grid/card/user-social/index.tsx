import { Linkedin } from 'lucide-react'
import {
  SiX,
  SiInstagram,
  SiGithub,
  SiYoutube,
  SiTiktok,
  SiSpotify,
  SiApplemusic,
  SiSoundcloud,
} from '@icons-pack/react-simple-icons'

import { GridCard, GridCardNavItem } from '@/components/grid'
import { cn } from '@/lib/utils'

type SocialLink = {
  name: string
  url: string
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>
  useDefaultColor?: boolean
  iconType: 'simple' | 'lucide'
}

const socialLinks: SocialLink[] = [
  {
    name: 'X (Twitter)',
    url: 'https://twitter.com/lyovson',
    icon: SiX,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/lyovson',
    icon: SiInstagram,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/lyovson',
    icon: SiGithub,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/lyovson',
    icon: Linkedin,
    useDefaultColor: false,
    iconType: 'lucide',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@lyovson',
    icon: SiYoutube,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@lyovson',
    icon: SiTiktok,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/user/lyovson',
    icon: SiSpotify,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'Apple Music',
    url: 'https://music.apple.com/profile/lyovson',
    icon: SiApplemusic,
    useDefaultColor: false,
    iconType: 'simple',
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/lyovson',
    icon: SiSoundcloud,
    useDefaultColor: false,
    iconType: 'simple',
  },
]

export function GridCardUserSocial({ className }: { className?: string }) {
  return (
    <GridCard className={className}>
      {socialLinks.map((link, index) => {
        const gridPositions = [
          'row-start-1 row-end-2 col-start-1 col-end-2',
          'row-start-1 row-end-2 col-start-2 col-end-3',
          'row-start-1 row-end-2 col-start-3 col-end-4',
          'row-start-2 row-end-3 col-start-1 col-end-2',
          'row-start-2 row-end-3 col-start-2 col-end-3',
          'row-start-2 row-end-3 col-start-3 col-end-4',
          'row-start-3 row-end-4 col-start-1 col-end-2',
          'row-start-3 row-end-4 col-start-2 col-end-3',
          'row-start-3 row-end-4 col-start-3 col-end-4',
        ]

        const IconComponent = link.icon

        return (
          <GridCardNavItem key={link.name} className={cn(gridPositions[index], '')}>
            <a
              href={link.url}
              aria-label={link.name}
              className="transition-transform hover:scale-110"
            >
              {link.iconType === 'simple' ? (
                <IconComponent
                  size={32}
                  color={link.useDefaultColor ? 'default' : 'currentColor'}
                />
              ) : (
                <IconComponent size={32} className="text-current" />
              )}
            </a>
          </GridCardNavItem>
        )
      })}
    </GridCard>
  )
}
