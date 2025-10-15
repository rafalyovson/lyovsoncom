"use client";

import { useActionState } from "react";
import type { ActionResponse } from "@/actions/create-contact-action";
import { GridCard, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";
import { SubscribeForm } from "./subscribe-form";

type GridCardSubscribeProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  emoji?: string;
  className?: string;
  handleSubmit: (
    prevState: ActionResponse,
    formData: FormData
  ) => Promise<ActionResponse>;
};

export const GridCardSubscribe = ({
  title = "Subscribe to my newsletter",
  description = "Subscribe to my newsletter to stay up to date with my latest posts and projects.",
  buttonText = "Subscribe",
  emoji = "👋",
  className,
  handleSubmit,
}: GridCardSubscribeProps) => {
  const [state, formAction] = useActionState(handleSubmit, {
    success: false,
    message: "",
  });

  return (
    <GridCard
      className={cn("col-start-1 col-end-2 row-start-2 row-end-3", className)}
    >
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 flex flex-col items-center justify-center gap-2 text-center",
          state.message ? "row-start-1 row-end-2" : "row-start-1 row-end-3"
        )}
      >
        <div
          aria-label="Greeting"
          className={cn("font-bold text-2xl")}
          role="img"
        >
          {emoji}
        </div>
        <h2 className={cn("glass-text font-bold text-2xl")}>{title}</h2>
        <p className={cn("glass-text-secondary text-sm")}>{description}</p>
      </GridCardSection>
      {state.message && (
        <GridCardSection className="col-start-1 col-end-4 row-start-2 row-end-3 flex items-center justify-center">
          {state.success && (
            <div className={cn("glass-text text-center font-bold text-2xl")}>
              <p>✅ {state.message}</p>
            </div>
          )}
          {!state.success && (
            <div className={cn("glass-text text-center font-bold text-2xl")}>
              <p>⛔️ {state.message}</p>
            </div>
          )}
        </GridCardSection>
      )}

      <GridCardSection className="col-start-1 col-end-4 row-start-3 row-end-4">
        <SubscribeForm
          action={formAction}
          buttonText={buttonText}
          state={state}
        />
      </GridCardSection>
    </GridCard>
  );
};
