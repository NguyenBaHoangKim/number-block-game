import { mkdir, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  lessons,
  voiceCopy,
  spokenNumbers,
  spokenSymbols,
  shapeChoices,
  numberCharacters,
} from "../src/data/mockData.ts";
const exec = promisify(execFile);
const output = "public/audio/narration";
await mkdir(output, { recursive: true });
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const texts = new Set([
  ...Object.values(voiceCopy),
  ...spokenNumbers,
  ...Object.values(spokenSymbols),
  ...shapeChoices.map((s) => s.label),
  ...numberCharacters.map((c) => c.name),
]);
for (const lesson of lessons)
  for (const step of lesson.steps) {
    texts.add(step.instruction);
    texts.add(step.hint);
    if (step.question) {
      texts.add(step.question.prompt);
      texts.add(`${step.question.prompt} ${voiceCopy.quizHelp}`);
      texts.add(step.question.explanation);
      for (const option of step.question.options)
        if (typeof option === "string")
          texts.add(spokenSymbols[option] ?? option);
    }
    if (step.introduction) {
      texts.add(step.introduction.opening);
      texts.add(step.introduction.closing);
      for (const cue of step.introduction.cues) texts.add(cue.greeting);
    }
  }
const manifest = {};
let generated = 0;
for (const raw of texts) {
  const text = normalize(raw);
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
  "src/data/narrationManifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Narration ready: ${Object.keys(manifest).length} clips (${generated} generated). Voice: Linh, Vietnamese, synthesized locally.`,
);
