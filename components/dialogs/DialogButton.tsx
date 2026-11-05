"use client";
// A button that opens a dialog (was [data-dialog-open] + dialogs.js). Renders the pill Button, or a plain
// <button> with the caller's class (the burger).
import type { MouseEvent, ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { useDialogs, type DialogId } from "./DialogProvider";

type DialogButtonProps = {
  dialog: DialogId;
  /** unique per opener: aria-expanded is true only on the one that opened the dialog */
  openerKey: string;
  mode?: "combos";
  variant?: "accent" | "plain";
  haspopup?: boolean;
  className?: string;
  label?: string;
  children: ReactNode;
};

export function DialogButton({ dialog, openerKey, mode, variant, haspopup = true, className, label, children }: DialogButtonProps) {
  const { open, opener, openDialog } = useDialogs();
  const props = {
    className,
    "aria-label": label,
    "aria-haspopup": haspopup ? ("dialog" as const) : undefined,
    "aria-expanded": open === dialog && opener === openerKey,
    "data-dialog-open": dialog,
    "data-chooser": mode,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      openDialog(dialog, { key: openerKey, element: event.currentTarget, mode });
    },
  };
  if (variant === "plain") {
    return (
      <button type="button" {...props}>
        {children}
      </button>
    );
  }
  return (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  );
}
