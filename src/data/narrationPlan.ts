import {
  lessons,
  voiceCopy,
  spokenNumbers,
  spokenSymbols,
} from "./mockData.ts";

/** Only collect lines that the app can actually request. UI copy is not automatically audio. */
import { exerciseVoicePrompts } from "./expansion/voicePrompts.ts";
export function getNarrationTexts(): string[] {
  const texts = new Set<string>([
    ...Object.entries(voiceCopy)
      .filter(([key]) => key !== "quizHelp")
      .map(([, text]) => text),
    ...Object.values(exerciseVoicePrompts),
    ...spokenNumbers,
    ...Object.values(spokenSymbols),
  ]);
  for (const lesson of lessons)
    for (const step of lesson.steps) {
      if (step.type !== "quiz" && step.activity !== "meet")
        texts.add(step.instruction);
      texts.add(step.hint);
      if (step.question) {
        texts.add(step.question.prompt);
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
  return [
    ...new Set(
      [...texts]
        .map((text) => text.replace(/\s+/g, " ").trim())
        .filter(Boolean),
    ),
  ];
}
