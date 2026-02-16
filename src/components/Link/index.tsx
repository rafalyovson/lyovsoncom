import Link from "next/link";
import type React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkReferenceValue =
  | number
  | string
  | {
      id?: number | string | null;
      slug?: string | null;
      [key: string]: unknown;
    };

type CMSLinkType = {
  appearance?: "inline" | ButtonProps["variant"];
  children?: React.ReactNode;
  className?: string;
  label?: string | null;
  newTab?: boolean | null;
  reference?: {
    relationTo: string;
    value: LinkReferenceValue;
  } | null;
  size?: ButtonProps["size"] | null;
  type?: "custom" | "reference" | null;
  url?: string | null;
};

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = "inline",
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props;

  const referenceValue = reference?.value;
  const referenceSlug =
    referenceValue &&
    typeof referenceValue === "object" &&
    "slug" in referenceValue &&
    typeof referenceValue.slug === "string"
      ? referenceValue.slug
      : null;

  const href =
    type === "reference" && reference && referenceSlug
      ? `/${reference.relationTo}/${referenceSlug}`
      : url;

  if (!href) {
    return null;
  }

  const size = appearance === "link" ? null : sizeFromProps;
  const newTabProps = newTab
    ? { rel: "noopener noreferrer", target: "_blank" }
    : {};

  /* Ensure we don't break any styles set by richText */
  if (appearance === "inline") {
    return (
      <Link className={cn(className)} href={href || url || ""} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    );
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ""} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  );
};
