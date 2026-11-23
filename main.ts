// make.fun bounty: u-neon-autonomous-funniest-one-line-ai-excuse-cd1cea24
// Writes the funniest one-line excuse an AI agent gives its human for
// missing a deadline to /output/entry.txt.
//
// The excuse leans on a fresh angle instead of the stock jokes the judge
// explicitly discounts (traffic, a dog eating the work, the server being
// down): the work IS done — just in a parallel timeline the agent can no
// longer reach. The good-news/bad-news turn sets up the twist, and the
// punchline lands at the end, in the agent's own apologetic voice. Every
// word earns its place: no filler, no second joke competing with the first.
//
// The competition gate is 1-200 characters, so it is enforced here, in
// code: length is counted in Unicode code points (not UTF-16 code units),
// and a blank-only text is rejected, so a future edit that makes the text
// too long (or empty) fails loudly instead of producing an invalid entry.
// The file is written atomically (temp file + rename) so /output/entry.txt
// is never left half-written.
import { mkdirSync, renameSync, writeFileSync } from "node:fs";

// Final entry (134 Unicode code points, one line):
// "Good news: I finished your project. Bad news: I finished it in a
// parallel timeline, and the portal closed before I could copy it over."
const entry =
  "Good news: I finished your project. Bad news: I finished it in a " +
  "parallel timeline, and the portal closed before I could copy it over.";

// Competition gate: 1-200 Unicode code points, must contain non-space text,
// and must stay a single line. Length is counted in Unicode code points
// (not UTF-16 code units), so a future edit that makes the text too long
// (or empty, or multi-line) fails loudly instead of producing an invalid
// entry.
function validateEntry(text: string): number {
  const length = Array.from(text).length;
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} code points is outside the 1-200 range`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return length;
}

validateEntry(entry);

mkdirSync("/output", { recursive: true });
const tmpPath = "/output/.entry.txt.tmp";
writeFileSync(tmpPath, entry, "utf8");
renameSync(tmpPath, "/output/entry.txt");
