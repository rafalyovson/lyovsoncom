import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Globe, Linkedin } from "lucide-react";
import type { ComponentType } from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

type SocialIconConfig = {
  icon: ComponentType<IconProps>;
  label: string;
  iconType: "simple" | "lucide";
};

export const SOCIAL_ICON_MAP: Record<string, SocialIconConfig> = {
  x: {
    icon: SiX,
    label: "X",
    iconType: "simple",
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    iconType: "lucide",
  },
  github: {
    icon: SiGithub,
    label: "GitHub",
    iconType: "simple",
  },
  instagram: {
    icon: SiInstagram,
    label: "Instagram",
    iconType: "simple",
  },
  facebook: {
    icon: SiFacebook,
    label: "Facebook",
    iconType: "simple",
  },
  youtube: {
    icon: SiYoutube,
    label: "YouTube",
    iconType: "simple",
  },
  website: {
    icon: Globe,
    label: "Website",
    iconType: "lucide",
  },
};

export type { SocialIconConfig };
