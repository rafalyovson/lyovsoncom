import {
  SiApplemusic,
  SiGithub,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";

import { GridCard, GridCardNavItem } from "@/components/grid";
import { cn } from "@/lib/utils";

type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
  }>;
  useDefaultColor?: boolean;
  iconType: "simple" | "lucide";
};

const socialLinks: SocialLink[] = [
  {
    name: "X (Twitter)",
    url: "https://x.com/rafalyovson",
    icon: SiX,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/rafalyovson",
    icon: SiInstagram,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "GitHub",
    url: "https://github.com/rafalyovson",
    icon: SiGithub,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/lyovson",
    icon: Linkedin,
    useDefaultColor: false,
    iconType: "lucide",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@lyovson",
    icon: SiYoutube,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@lyovson",
    icon: SiTiktok,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/lyovson",
    icon: SiSpotify,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/profile/lyovson",
    icon: SiApplemusic,
    useDefaultColor: false,
    iconType: "simple",
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com/lyovson",
    icon: SiSoundcloud,
    useDefaultColor: false,
    iconType: "simple",
  },
];

export function GridCardUserSocial({ className }: { className?: string }) {
  return (
    <GridCard className={className}>
      {socialLinks.map((link, index) => {
        const gridPositions = [
          "row-start-1 row-end-2 col-start-1 col-end-2",
          "row-start-1 row-end-2 col-start-2 col-end-3",
          "row-start-1 row-end-2 col-start-3 col-end-4",
          "row-start-2 row-end-3 col-start-1 col-end-2",
          "row-start-2 row-end-3 col-start-2 col-end-3",
          "row-start-2 row-end-3 col-start-3 col-end-4",
          "row-start-3 row-end-4 col-start-1 col-end-2",
          "row-start-3 row-end-4 col-start-2 col-end-3",
          "row-start-3 row-end-4 col-start-3 col-end-4",
        ];

        const IconComponent = link.icon;

        return (
          <GridCardNavItem
            className={cn(
              gridPositions[index],
              `glass-stagger-${Math.min(index + 1, 6)}`
            )}
            key={link.name}
          >
            <a
              aria-label={`Visit ${link.name} profile`}
              className="glass-interactive group"
              href={link.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.iconType === "simple" ? (
                <IconComponent
                  className="glass-text transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
                  color={link.useDefaultColor ? "default" : "currentColor"}
                  size={32}
                />
              ) : (
                <IconComponent
                  className="glass-text transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
                  size={32}
                />
              )}
            </a>
          </GridCardNavItem>
        );
      })}
    </GridCard>
  );
}
