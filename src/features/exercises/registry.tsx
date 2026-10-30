import type { ComponentType } from "react";
import type {
  Definition,
  Engine,
  ExerciseQuestion,
  ExerciseType,
  ExerciseViewProps,
} from "./types";
import { definitions } from "./catalog";
import { generateQuestion } from "./generator";
import { validateQuestion } from "./validators";
import { CountView } from "./views/CountView";
import { ChoiceView } from "./views/ChoiceView";
import { PartsView, OrderView } from "./views/PartsOrderViews";
import { PlacementView } from "./views/PlacementView";
import { PathView } from "./views/PathView";
import { DistributionView } from "./views/DistributionView";
import { FractionView } from "./views/FractionView";
import { MissionView } from "./views/MissionView";
export const engineRenderers = {
  count: CountView,
  choice: ChoiceView,
  parts: PartsView,
  order: OrderView,
  placement: PlacementView,
  path: PathView,
  distribution: DistributionView,
  fraction: FractionView,
  mission: MissionView,
} satisfies Record<Engine, ComponentType<ExerciseViewProps>>;
export interface RegistryEntry extends Definition {
  Renderer: ComponentType<ExerciseViewProps>;
  validate: typeof validateQuestion;
  generate: typeof generateQuestion;
}
export const exerciseRegistry = Object.fromEntries(
  definitions.map((d) => [
    d.type,
    {
      ...d,
      Renderer: engineRenderers[d.engine],
      validate: validateQuestion,
      generate: generateQuestion,
    },
  ]),
) as Record<ExerciseType, RegistryEntry>;
export function ExerciseRenderer(props: ExerciseViewProps) {
  const entry = exerciseRegistry[props.question.type];
  if (!entry || entry.engine !== props.question.payload.kind)
    return (
      <p role="alert">Hoạt động này chưa sẵn sàng. Bé chọn một bài khác nhé.</p>
    );
  const Renderer = entry.Renderer;
  return <Renderer {...props} />;
}
export function validateRegistryQuestions(
  questions: ExerciseQuestion[],
): string[] {
  return questions.flatMap((q) =>
    !exerciseRegistry[q.type]
      ? [`${q.id}: chưa có handler`]
      : exerciseRegistry[q.type].engine !== q.payload.kind
        ? [`${q.id}: payload không khớp handler`]
        : [],
  );
}
