import { Mail } from "lucide-react";
import type { ActionResponse } from "@/actions/create-contact-action";
import { GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";
import { SubscribeForm } from "./subscribe-form";

type FormModeProps = {
  title: string;
  description: string;
  buttonText: string;
  formAction: (formData: FormData) => void;
  state: ActionResponse;
};

export const FormMode = ({
  title,
  description,
  buttonText,
  formAction,
  state,
}: FormModeProps) => {
  return (
    <>
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-1 row-end-3 flex flex-col items-center justify-center gap-2 text-center"
        )}
      >
        <Mail
          aria-label="Email subscription"
          className="h-12 w-12 text-primary"
        />
        <h2 className={cn("glass-text font-bold text-2xl")}>{title}</h2>
        <p className={cn("glass-text-secondary text-sm")}>{description}</p>
      </GridCardSection>

      <GridCardSection className="col-start-1 col-end-4 row-start-3 row-end-4">
        <SubscribeForm
          action={formAction}
          buttonText={buttonText}
          state={state}
        />
      </GridCardSection>
    </>
  );
};
