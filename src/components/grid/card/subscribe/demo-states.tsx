"use client";

import { useState } from "react";
import { GridCard } from "@/components/grid";
import { cn } from "@/lib/utils";
import { ErrorMode } from "./error-mode";
import { FormMode } from "./form-mode";
import { InfoMode } from "./info-mode";
import { SuccessMode } from "./success-mode";
import type { SubscribeMode } from "./types";

type DemoCardProps = {
  mode: SubscribeMode;
  className?: string;
};

const DemoSubscribeCard = ({ mode, className }: DemoCardProps) => {
  const [currentMode, setCurrentMode] = useState<SubscribeMode>(mode);

  const demoAction = () => {
    // Demo action does nothing
  };

  const demoMessages = {
    form: "",
    success: "Please check your email to confirm your subscription.",
    error: "An unexpected error occurred. Please try again.",
    info: "You're already subscribed! Check your inbox for our latest emails.",
  };

  return (
    <GridCard className={cn(className)}>
      {
        {
          form: (
            <FormMode
              buttonText="Subscribe"
              description="Get notified about new posts and projects"
              formAction={demoAction}
              title="Subscribe to updates"
            />
          ),
          success: (
            <SuccessMode
              message={demoMessages.success}
              setMode={setCurrentMode}
            />
          ),
          error: (
            <ErrorMode message={demoMessages.error} setMode={setCurrentMode} />
          ),
          info: (
            <InfoMode message={demoMessages.info} setMode={setCurrentMode} />
          ),
        }[currentMode]
      }
    </GridCard>
  );
};

export const SubscribeDemoStates = () => {
  return (
    <>
      <DemoSubscribeCard mode="form" />
      <DemoSubscribeCard mode="success" />
      <DemoSubscribeCard mode="error" />
      <DemoSubscribeCard mode="info" />
    </>
  );
};
