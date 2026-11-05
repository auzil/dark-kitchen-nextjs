// The prototype's Google Fonts, self-hosted by next/font. Same families; the two Sofia Sans families are
// variable, so `weight` is left out (whole wght axis — next/font rejects range strings like "700 900").
// Subsets: latin-ext for Czech (ř ů ě), cyrillic for /ru. Each face is a CSS variable on <html>;
// app/styles/tokens.scss maps --font-display / --font-sans onto them, Wordmark.module.scss uses --font-wordmark-face.
import { Forum, Sofia_Sans, Sofia_Sans_Extra_Condensed } from "next/font/google";

const display = Sofia_Sans_Extra_Condensed({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-display-face",
});

const sans = Sofia_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-sans-face",
});

// the "IMPERIAL FOOD" lockup only (Latin capitals)
const wordmark = Forum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-wordmark-face",
});

export const fontVariables = [display.variable, sans.variable, wordmark.variable].join(" ");
