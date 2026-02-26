import type { CSSProperties } from "react";

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const LIGHT_TEXT_COLOR = "oklch(0.96 0.006 224)";
const DARK_TEXT_COLOR = "oklch(0.24 0.02 238)";
const LUMINANCE_THRESHOLD = 0.46;
const RGB_MAX_CHANNEL = 255;
const SRGB_THRESHOLD = 0.039_28;
const SRGB_DIVISOR = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_DIVISOR = 1.055;
const GAMMA_POWER = 2.4;
const RED_LUMINANCE_WEIGHT = 0.2126;
const GREEN_LUMINANCE_WEIGHT = 0.7152;
const BLUE_LUMINANCE_WEIGHT = 0.0722;
const SHORT_HEX_LENGTH = 4;
const RED_CHANNEL_START_INDEX = 1;
const GREEN_CHANNEL_START_INDEX = 3;
const BLUE_CHANNEL_START_INDEX = 5;

function normalizeHexColor(rawColor: string): string | null {
  const trimmedColor = rawColor.trim();
  if (!HEX_COLOR_PATTERN.test(trimmedColor)) {
    return null;
  }

  if (trimmedColor.length === SHORT_HEX_LENGTH) {
    const [hash, r, g, b] = trimmedColor;
    return `${hash}${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return trimmedColor.toLowerCase();
}

function getChannel(hexColor: string, startIndex: number): number {
  return Number.parseInt(hexColor.slice(startIndex, startIndex + 2), 16);
}

function getRelativeLuminance(hexColor: string): number {
  const channels = [
    getChannel(hexColor, RED_CHANNEL_START_INDEX),
    getChannel(hexColor, GREEN_CHANNEL_START_INDEX),
    getChannel(hexColor, BLUE_CHANNEL_START_INDEX),
  ];

  const [r, g, b] = channels.map((channel) => {
    const normalized = channel / RGB_MAX_CHANNEL;

    return normalized <= SRGB_THRESHOLD
      ? normalized / SRGB_DIVISOR
      : ((normalized + GAMMA_OFFSET) / GAMMA_DIVISOR) ** GAMMA_POWER;
  });

  return (
    r * RED_LUMINANCE_WEIGHT +
    g * GREEN_LUMINANCE_WEIGHT +
    b * BLUE_LUMINANCE_WEIGHT
  );
}

function getReadableTextColor(hexColor: string): string {
  return getRelativeLuminance(hexColor) >= LUMINANCE_THRESHOLD
    ? DARK_TEXT_COLOR
    : LIGHT_TEXT_COLOR;
}

export function getTopicBadgeStyle(
  topicColor: string | null | undefined
): CSSProperties {
  const fallbackStyles: CSSProperties = {
    backgroundColor: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
    color: "var(--glass-text)",
  };

  if (typeof topicColor !== "string") {
    return fallbackStyles;
  }

  const normalizedColor = normalizeHexColor(topicColor);
  if (!normalizedColor) {
    return fallbackStyles;
  }

  return {
    backgroundColor: normalizedColor,
    borderColor: `color-mix(in oklch, ${normalizedColor} 70%, black 30%)`,
    boxShadow: `inset 0 1px 0 color-mix(in oklch, ${normalizedColor} 74%, white 26%)`,
    color: getReadableTextColor(normalizedColor),
  };
}
