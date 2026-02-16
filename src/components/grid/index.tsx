import { Children, isValidElement, type ReactNode } from "react";

const MAX_STAGGER_INDEX = 6;

function getStaggerClass(index: number): string {
  return `glass-stagger-${Math.min(index + 1, MAX_STAGGER_INDEX)}`;
}

export const Grid = ({ children }: { children: ReactNode }) => {
  const childrenArray = Children.toArray(children);

  return (
    <main className="relative mx-auto grid min-h-screen g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px] g4:grid-cols-[400px_400px_400px_400px] g5:grid-cols-[400px_400px_400px_400px_400px] g6:grid-cols-[400px_400px_400px_400px_400px_400px] grid-cols-[clamp(18rem,100vw-2rem,400px)] place-items-center justify-center gap-4 p-4 g2:[grid-auto-rows:max-content]">
      {/* Theme-aware glassmorphism background context */}
      <div
        className="-z-10 fixed inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--grid-bg-start), var(--grid-bg-middle), var(--grid-bg-end))",
        }}
      />
      <div
        className="-z-10 fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% -20%, var(--grid-bg-middle), transparent)",
        }}
      />

      {/* Enhanced children with staggered animations */}
      {Array.isArray(childrenArray)
        ? childrenArray.map((child, index) => {
            const childKey =
              isValidElement(child) && child.key != null
                ? String(child.key)
                : undefined;
            const fallbackKey =
              typeof child === "string" || typeof child === "number"
                ? `grid-child-${child}`
                : "grid-child";

            return (
              <div
                className={`${getStaggerClass(index)} contents`}
                key={childKey ?? fallbackKey}
              >
                {child}
              </div>
            );
          })
        : children}
    </main>
  );
};

export { GridCard, GridCardContent } from "./card";
export { GridCardActivityFull, GridCardActivityReview } from "./card/activity";
export {
  GridCardHero,
  GridCardHeroActivity,
  GridCardHeroNote,
} from "./card/hero";
export { GridCardNav, GridCardNavItem } from "./card/nav";
export { GridCardNotFound } from "./card/not-found";
export { GridCardNoteFull } from "./card/note";
export { GridCardPostFull } from "./card/post";
export { GridCardReferences } from "./card/references";
export { GridCardRelatedNotes, GridCardRelatedPosts } from "./card/related";
export { GridCardSection } from "./card/section";
export { GridCardSubscribe } from "./card/subscribe";
export { GridCardSubscribeConfirmed } from "./card/subscribe/confirmed";
export { GridCardUser } from "./card/user";
export { GridCardUserSocial } from "./card/user-social";
export { SkeletonCard, SkeletonGrid } from "./skeleton";
