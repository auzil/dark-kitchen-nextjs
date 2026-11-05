// Runs `html` synchronously while the browser parses the page, before first paint: the no-flash pattern
// from docs:02-guides/preventing-flash-before-hydration.md. On the client the script renders as text/plain
// (React would warn about rendering a <script>), and suppressHydrationWarning accepts the type difference.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
