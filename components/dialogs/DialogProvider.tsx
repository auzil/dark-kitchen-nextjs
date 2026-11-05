"use client";
/*
 * Which dialog is open, who opened it, and how the chooser is preset (was js/dialogs.js + js/chooser.js and
 * the "dialog:open" event). Openers call openDialog(); every opener's aria-expanded follows `opener`.
 *
 * Chooser preset, each time it opens:
 *   combos button   site.combosListing, or both listings side by side while it is null
 *   header, bar     the menu section in view, else the hero choice
 */
import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { useCuisine } from "@/components/cuisine/CuisineProvider";
import type { Cuisine } from "@/content/types";

export type DialogId = "menu" | "chooser";

type DialogState = {
  open: DialogId | null;
  /** id of the button that opened the open dialog (aria-expanded="true" only there) */
  opener: string | null;
  chooserBoth: boolean;
  openDialog: (id: DialogId, opener: { key: string; element: HTMLElement; mode?: "combos" }) => void;
  onClosed: () => void;
  returnFocus: () => HTMLElement | null;
};

const DialogContext = createContext<DialogState | null>(null);

export function DialogProvider({ combosListing, children }: { combosListing: Cuisine | null; children: ReactNode }) {
  const cuisine = useCuisine();
  const [open, setOpen] = useState<DialogId | null>(null);
  const [opener, setOpener] = useState<string | null>(null);
  const [chooserBoth, setChooserBoth] = useState(false);
  const openerElement = useRef<HTMLElement | null>(null);
  const { setChooser, hero, inView } = cuisine;

  const openDialog = useCallback<DialogState["openDialog"]>(
    (id, { key, element, mode }) => {
      if (id === "chooser") {
        const fromCombos = mode === "combos";
        const listing = fromCombos ? combosListing : null;
        const showBoth = fromCombos && !listing;
        setChooserBoth(showBoth);
        setChooser(showBoth ? hero : (listing ?? inView ?? hero));
      }
      openerElement.current = element;
      setOpener(key);
      setOpen(id);
    },
    [combosListing, hero, inView, setChooser],
  );

  const onClosed = useCallback(() => {
    setOpen(null);
    setOpener(null);
  }, []);

  const returnFocus = useCallback(() => openerElement.current, []);

  const value = useMemo(
    () => ({ open, opener, chooserBoth, openDialog, onClosed, returnFocus }),
    [open, opener, chooserBoth, openDialog, onClosed, returnFocus],
  );
  return <DialogContext value={value}>{children}</DialogContext>;
}

export function useDialogs(): DialogState {
  const value = use(DialogContext);
  if (!value) throw new Error("useDialogs() outside <DialogProvider>");
  return value;
}
