"use client";
/*
 * Native modal <dialog>, driven by the `open` prop (starter component, adapted to the prototype's dialogs.js).
 * showModal() gives the focus trap, Esc and an inert page for free. This component adds:
 *   - close on a click on any [data-dialog-close] (✕, the chooser backdrop) or any link inside the dialog,
 *     listening on the dialog itself so it closes (and the page scrolls again) before a link's anchor scroll;
 *   - focus back to the opener on close, unless something else already took focus (a menu link focuses its
 *     target section).
 * The scroll lock is CSS in app/styles/base.scss (`html:has(dialog[open]) { overflow: hidden; }`).
 */
import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Dialog.module.scss";

type DialogProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  /** element to give focus back to when the dialog closes */
  returnFocus?: () => HTMLElement | null;
  className?: string;
  labelledBy?: string;
  label?: string;
  hooks?: Record<`data-${string}`, string | undefined>;
  children: ReactNode;
};

export function Dialog({ id, open, onClose, returnFocus, className, labelledBy, label, hooks, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("[data-dialog-close], a[href]")) dialog.close();
    };
    // "close" fires for Esc and dialog.close(): one place to sync state and restore focus
    const onDialogClose = () => {
      onClose();
      const focus = document.activeElement;
      if (!focus || focus === document.body || dialog.contains(focus)) returnFocus?.()?.focus();
    };
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("close", onDialogClose);
    return () => {
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("close", onDialogClose);
    };
  }, [onClose, returnFocus]);

  return (
    <dialog ref={ref} id={id} className={cx(styles.root, className)} aria-labelledby={labelledBy} aria-label={label} {...hooks}>
      {children}
    </dialog>
  );
}
