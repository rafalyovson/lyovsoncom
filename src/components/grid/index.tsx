import type { ReactNode } from "react";

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative mx-auto grid min-h-screen g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px] g4:grid-cols-[400px_400px_400px_400px] g5:grid-cols-[400px_400px_400px_400px_400px] g6:grid-cols-[400px_400px_400px_400px_400px_400px] grid-cols-[400px] place-items-center justify-center gap-4 p-4 g2:[grid-auto-rows:max-content]">
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
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              className={`glass-stagger-${Math.min(index + 1, 6)} contents`}
              key={index}
            >
              {child}
            </div>
          ))
        : children}
    </main>
  );
};

export { GridCard } from "./card";
export { GridCardHero } from "./card/hero";
export { GridCardNav, GridCardNavItem } from "./card/nav";
export { GridCardNotFound } from "./card/not-found";
export { GridCardPostFull, GridCardPostSearch } from "./card/post";
export { GridCardRelatedPosts } from "./card/related";
export { GridCardSection } from "./card/section";
export { GridCardSubscribe } from "./card/subscribe";
export { GridCardSubscribeConfirmed } from "./card/subscribe/confirmed";
export { GridCardJess, GridCardRafa, GridCardUser } from "./card/user";
export { GridCardUserSocial } from "./card/user-social";
export { SkeletonCard, SkeletonGrid } from "./skeleton";
