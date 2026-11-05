"use client";
/*
 * Cookie consent for Google Analytics (basic consent mode): Accept and Reject are the same size and style.
 * Shown when GA is configured and no (valid) choice is stored; the footer "Cookie settings" button shows it
 * again. It is a non-modal card, in view on load (consent first): a bottom sheet on phones, over the mobile order
 * bar until a choice is made, bottom right on desktop. The page stays usable. A stored "granted" loads gtag.
 */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { CONSENT_OPEN_EVENT, loadGa, readConsent, rememberLanding, setConsent, type ConsentChoice } from "@/lib/analytics";
import styles from "./ConsentBanner.module.scss";

export type ConsentCopy = { title: string; text: string; privacy: string; accept: string; reject: string };

export function ConsentBanner({ copy }: { copy: ConsentCopy }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const reopened = useRef(false);

  useEffect(() => {
    rememberLanding();
    const stored = readConsent();
    if (stored === "granted") loadGa();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage is unreadable on the server
    if (stored === null) setOpen(true);

    const reopen = () => {
      reopened.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // a banner the visitor asked for takes focus; the one that appears on its own never steals it
  useEffect(() => {
    if (open && reopened.current) rootRef.current?.querySelector("button")?.focus();
  }, [open]);

  if (!open) return null;

  const choose = (value: ConsentChoice) => {
    setConsent(value);
    reopened.current = false;
    setOpen(false);
  };

  return (
    <section ref={rootRef} className={styles.root} aria-label={copy.title}>
      <p className={styles.text}>
        {copy.text}{" "}
        <a href="#privacy" data-no-scroll="">
          {copy.privacy}
        </a>
      </p>
      <div className={styles.actions}>
        <Button className={styles.button} onClick={() => choose("granted")}>
          {copy.accept}
        </Button>
        <Button className={styles.button} onClick={() => choose("denied")}>
          {copy.reject}
        </Button>
      </div>
    </section>
  );
}
