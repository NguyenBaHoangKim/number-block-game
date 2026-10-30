export type Activity =
  | "memory"
  | "parity"
  | "grouping"
  | "sharing"
  | "shapes"
  | "bridge"
  | "clock"
  | "meet"
  | "match"
  | "count"
  | "merge"
  | "split"
  | "compare"
  | "missing"
  | "pattern"
  | "numberline";
export type Expression =
  "happy" | "excited" | "thinking" | "surprised" | "encouraging";
export interface Question {
  prompt: string;
  options: (number | string)[];
  answer: number | string;
  explanation: string;
}
export interface CharacterIntroduction {
  opening: string;
  invitation: string;
  closing: string;
  replayLabel: string;
  cueDurationMs: number;
  cues: { value: number; greeting: string }[];
}
export type ShapeKind = "square" | "triangle" | "circle" | "rectangle";
export interface ActivityConfig {
  /** Indices in values that belong to this counting task; omitted means every group. */
  countTargetGroups?: number[];
  balanceTarget?: [number, number];
  splitTarget?: number;
  patternIncrement?: number;
  flashMs?: number;
  targetShape?: ShapeKind;
}
export interface LessonStep {
  id: string;
  type: "explain" | "interact" | "quiz";
  title: string;
  instruction: string;
  activity: Activity;
  values: number[];
  question?: Question;
  hint: string;
  alternatives?: [number, number][];
  introduction?: CharacterIntroduction;
  characterLabels?: "number" | "name";
  config?: ActivityConfig;
}
export interface Lesson {
  id: string;
  stageId: string;
  title: string;
  description: string;
  minutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningObjective: string;
  steps: LessonStep[];
}
export interface Progress {
  stars: Record<string, number>;
  lastLesson: string | null;
  practice: {
    quickBest: number;
    rounds: number;
    bestByLength?: Record<string, number>;
  };
  settings: {
    effects: boolean;
    music: boolean;
    voice: boolean;
    background: boolean;
    volume: number;
  };
}
