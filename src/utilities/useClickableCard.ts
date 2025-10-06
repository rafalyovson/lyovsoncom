"use client";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

// Maximum time in ms between mousedown and mouseup to be considered a click
const CLICK_DELAY_THRESHOLD_MS = 250;

type UseClickableCardType<T extends HTMLElement> = {
  card: {
    ref: RefObject<T | null>;
  };
  link: {
    ref: RefObject<HTMLAnchorElement | null>;
  };
};

type Props = {
  external?: boolean;
  newTab?: boolean;
  scroll?: boolean;
};

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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Click detection requires multiple conditions to handle edge cases properly
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (link.current?.href) {
        const timeNow = Date.now();
        const difference = timeNow - timeDown.current;

        if (
          link.current?.href &&
          difference <= CLICK_DELAY_THRESHOLD_MS &&
          !hasActiveParent.current &&
          pressedButton.current === 0 &&
          !e.ctrlKey
        ) {
          if (external) {
            const target = newTab ? "_blank" : "_self";
            window.open(link.current.href, target);
          } else {
            router.push(link.current.href, { scroll });
          }
        }
      }
    },
    [router, external, newTab, scroll] // Include all props and context used
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
