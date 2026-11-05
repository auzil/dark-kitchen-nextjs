// A headline broken into explicit lines (messages store them as numbered keys: "title": { "0": …, "1": … }).
// Same markup as the prototype: <span class="line"> per line, a space between them so the text reads
// right when copied or without CSS.
import { Fragment } from "react";

export function Lines({ lines }: { lines: Record<string, string> }) {
  return Object.values(lines).map((line, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="line">{line}</span>
    </Fragment>
  ));
}
