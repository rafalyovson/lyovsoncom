"use client";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

// Maximum time in ms between mousedown and mouseup to be considered a click
const CLICK_DELAY_THRESHOLD_MS = 250;

interface UseClickableCardType<T extends HTMLElement> {
  card: {
    ref: RefObject<T | null>;
  };
  link: {
    ref: RefObject<HTMLAnchorElement | null>;
  };
}

interface Props {
  external?: boolean;
  newTab?: boolean;
  scroll?: boolean;
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter();
  const card = useRef<T>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const timeDown = useRef<number>(0);
  const hasActiveParent = useRef<boolean>(false);
  const pressedButton = useRef<number>(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.target) {
      const target = e.target as Element;

      const timeNow = Date.now();
      const parent = target?.closest("a");

      pressedButton.current = e.button;

      if (parent) {
        hasActiveParent.current = true;
      } else {
        hasActiveParent.current = false;
        timeDown.current = timeNow;
      }
    }
  }, []); // Refs don't need to be in dependencies

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      const linkElement = link.current;
      if (!linkElement?.href) {
        return;
      }

      const elapsed = Date.now() - timeDown.current;
      const isPrimaryButton = pressedButton.current === 0;
      const clickedQuickly = elapsed <= CLICK_DELAY_THRESHOLD_MS;
      const shouldNavigate =
        clickedQuickly &&
        isPrimaryButton &&
        !hasActiveParent.current &&
        !event.ctrlKey;

      if (!shouldNavigate) {
        return;
      }

      if (external) {
        const target = newTab ? "_blank" : "_self";
        window.open(linkElement.href, target);
        return;
      }

      router.push(linkElement.href, { scroll });
    },
    [external, newTab, router, scroll]
  );

  useEffect(() => {
    const cardNode = card.current;

    if (cardNode) {
      cardNode.addEventListener("mousedown", handleMouseDown);
      cardNode.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (cardNode) {
        cardNode.removeEventListener("mousedown", handleMouseDown);
        cardNode.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [handleMouseDown, handleMouseUp]); // Include callbacks that are used

  return {
    card: {
      ref: card,
    },
    link: {
      ref: link,
    },
  };
}

export default useClickableCard;
