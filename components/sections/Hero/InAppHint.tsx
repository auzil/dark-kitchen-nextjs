"use client";
// "App didn't open?" hint, shown only in Instagram / TikTok / Facebook in-app browsers, which may not hand
// off to the delivery apps (was inAppHint() in js/page.js). Hidden in the server HTML.
import { useSyncExternalStore } from "react";

const IN_APP = /Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance/i;
const noSubscribe = () => () => {};

export function InAppHint({ className, text }: { className?: string; text: string }) {
  const inApp = useSyncExternalStore(noSubscribe, () => IN_APP.test(navigator.userAgent), () => false);
  return (
    <p className={className} data-inapp-hint="" hidden={!inApp}>
      {text}
    </p>
  );
}
