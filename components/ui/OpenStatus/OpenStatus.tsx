"use client";
/*
 * "Otevřeno do 22:00" / "Zavřeno, otevíráme v 11:00" in Prague time (was js/status.js).
 * The server can't know the visitor's time, so: the prerendered HTML says "open until <close>"; the inline
 * script right after the element writes the real status before first paint (suppressHydrationWarning lets
 * React keep it); after hydration useSyncExternalStore takes over and refreshes every minute.
 */
import { useSyncExternalStore } from "react";
import { InlineScript } from "@/components/ui/InlineScript/InlineScript";
import { cx } from "@/lib/cx";
import { computeStatus, type StatusInput } from "@/lib/open-status";
import styles from "./OpenStatus.module.scss";

const REFRESH_MS = 60_000;

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, REFRESH_MS);
  return () => clearInterval(id);
};

const encode = (s: { open: boolean; text: string }) => `${s.open ? 1 : 0}${s.text}`;

// before-paint script: the same function, serialised (lib/open-status.ts keeps it self-contained)
const script = (input: StatusInput) =>
  `(function(){var p=document.currentScript.previousElementSibling;var s=(${computeStatus.toString()})(${JSON.stringify(input).replace(/</g, "\\u003c")});p.setAttribute("data-open",String(s.open));p.querySelector("[data-status-text]").textContent=s.text})()`;

export function OpenStatus({ input, className }: { input: StatusInput; className?: string }) {
  const value = useSyncExternalStore(
    subscribe,
    () => encode(computeStatus(input)),
    () => encode({ open: true, text: input.text.openUntil }),
  );
  const open = value[0] === "1";

  return (
    <>
      <p className={cx(styles.root, className)} data-status data-open={String(open)} suppressHydrationWarning>
        <span className={styles.dot} aria-hidden="true" />
        <span data-status-text suppressHydrationWarning>
          {value.slice(1)}
        </span>
      </p>
      <InlineScript html={script(input)} />
    </>
  );
}
