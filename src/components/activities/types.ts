import type { LessonStep, Expression } from "../../types/lesson";
export interface WorkspaceProps {
  step: LessonStep;
  onReady?: () => void;
  expression?: Expression;
}
