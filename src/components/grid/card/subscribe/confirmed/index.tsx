import { CheckCircle2, Sparkles } from "lucide-react";
import { GridCard, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";

export const GridCardSubscribeConfirmed = () => {
  return (
    <GridCard className="relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, var(--success), transparent)",
        }}
      />

      <GridCardSection className="relative col-span-3 row-span-3 flex flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <CheckCircle2
            aria-label="Subscription confirmed"
            className="h-24 w-24 animate-[scale-in_0.5s_ease-out]"
            style={{ color: "var(--success)" }}
          />
          <Sparkles
            className="absolute -top-2 -right-2 h-8 w-8 animate-pulse"
            style={{ color: "var(--success)" }}
          />
        </div>

        <div className="space-y-3">
          <h1
            className="font-bold text-4xl"
            style={{ color: "var(--success)" }}
          >
            Subscription Confirmed!
          </h1>
          <p className="glass-text-secondary mx-auto max-w-[300px] text-base leading-relaxed">
            Thank you for subscribing! You'll receive updates about new posts,
            projects, and ideas.
          </p>
        </div>

        <div
          className={cn(
            "glass-badge mt-2 rounded-full px-4 py-2 font-medium text-sm"
          )}
        >
          ✓ Check your email for confirmation
        </div>
      </GridCardSection>
    </GridCard>
  );
};
