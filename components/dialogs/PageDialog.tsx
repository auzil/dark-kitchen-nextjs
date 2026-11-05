"use client";
// Binds one of the page's dialogs to DialogProvider: open state, close sync, focus return.
import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import { useDialogs, type DialogId } from "./DialogProvider";

type PageDialogProps = { id: DialogId; className?: string; label?: string; labelledBy?: string; children: ReactNode };

export function PageDialog({ id, className, label, labelledBy, children }: PageDialogProps) {
  const { open, onClosed, returnFocus } = useDialogs();
  const { chooser } = useCuisine();
  return (
    <Dialog
      id={id}
      open={open === id}
      onClose={onClosed}
      returnFocus={returnFocus}
      className={className}
      label={label}
      labelledBy={labelledBy}
      // the chooser carries its own cuisine accent
      hooks={id === "chooser" ? { "data-cuisine": chooser } : undefined}
    >
      {children}
    </Dialog>
  );
}
