import {
  mkdir,
  writeFile,
  access,
  readdir,
  unlink,
  rename,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getNarrationTexts } from "../src/data/narrationPlan.ts";
const exec = promisify(execFile);
const output = "public/audio/narration";
await mkdir(output, { recursive: true });
const texts = getNarrationTexts();
const manifest = {};
let generated = 0;
for (const text of texts) {
  if (!text) continue;
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 16);
  const destination = join(output, `${hash}.mp3`);
  let exists = false;
  try {
    await access(destination);
    exists = true;
  } catch {
    /* A missing clip is generated below. */
  }
  if (!exists) {
    const input = join(tmpdir(), `khoi-so-${hash}.txt`),
      aiff = join(tmpdir(), `khoi-so-${hash}.aiff`);
    await writeFile(input, text);
    await exec("/usr/bin/say", [
      "-v",
      "Linh",
      "-r",
      "165",
      "-f",
      input,
      "-o",
      aiff,
    ]);
    await exec("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      aiff,
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "64k",
      "-ar",
      "24000",
      destination,
    ]);
    generated++;
  }
  const { stdout } = await exec("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    destination,
  ]);
  manifest[text] = {
    src: `/audio/narration/${hash}.mp3`,
    durationMs: Math.ceil(Number(stdout) * 1000),
  };
}
await writeFile(
  "src/data/narrationManifest.json.tmp",
  JSON.stringify(manifest, null, 2) + "\n",
);
await rename(
  "src/data/narrationManifest.json.tmp",
  "src/data/narrationManifest.json",
);
const referenced = new Set(
  Object.values(manifest).map((clip) => clip.src.split("/").at(-1)),
);
let removed = 0;
for (const file of await readdir(output)) {
  if (/^[a-f0-9]{16}\.mp3$/.test(file) && !referenced.has(file)) {
    await unlink(join(output, file));
    removed++;
  }
}
console.log(
  `Narration ready: ${Object.keys(manifest).length} clips (${generated} generated, ${removed} unused removed). Voice: Linh, Vietnamese, synthesized locally.`,
);
