"use client";
import { CopyIcon } from "@payloadcms/ui/icons/Copy";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState("Copy");
  const updateTimeout = 1000;

  function updateCopyStatus() {
    if (text === "Copy") {
      setText(() => "Copied!");
      setTimeout(() => {
        setText(() => "Copy");
      }, updateTimeout);
    }
  }

  return (
    <div className="absolute top-3 right-3">
      <Button
        className="glass-badge glass-interactive hover:glass-text-secondary glass-badge flex gap-2 rounded px-2 py-1 font-medium text-xs transition-all duration-300"
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          updateCopyStatus();
        }}
        size="sm"
        variant="ghost"
      >
        <span className="glass-text sr-only">{text}</span>
        <div className="glass-text h-4 w-4">
          <CopyIcon />
        </div>
      </Button>
    </div>
  );
}
