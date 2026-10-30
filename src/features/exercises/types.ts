export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Scalar = number | string;
export type Operation = "+" | "-" | "×" | "÷";
export type Shape =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "parallelogram"
  | "half"
  | "quarter";
export type Solid = "sphere" | "cube" | "cuboid" | "cylinder" | "cone";
export type ExerciseType =
  | "tap_counting"
  | "match_number_quantity"
  | "block_addition"
  | "block_subtraction"
  | "seesaw_compare"
  | "missing_number"
  | "number_pattern"
  | "number_line"
  | "quick_subitizing"
  | "odd_even_pairs"
  | "equal_groups_multiplication"
  | "equal_sharing_division"
  | "shape_recognition"
  | "bridge_building"
  | "tell_time_hour"
  | "ten_frame_completion"
  | "number_bonds"
  | "closest_to_target"
  | "before_after_number"
  | "number_distance"
  | "choose_equation"
  | "operator_missing"
  | "spot_math_error"
  | "equation_balance"
  | "multiple_solutions"
  | "reverse_calculation"
  | "calculation_chain"
  | "number_machine"
  | "estimation"
  | "math_maze"
  | "tangram"
  | "shape_construction"
  | "symmetry_completion"
  | "solid_shapes"
  | "spatial_navigation"
  | "copy_structure"
  | "length_measurement"
  | "height_measurement"
  | "weight_comparison"
  | "capacity_measurement"
  | "money_recognition"
  | "shopping_math"
  | "calendar_days"
  | "tell_time_advanced"
  | "odd_one_out"
  | "clue_deduction"
  | "character_claims"
  | "conditional_sorting"
  | "shortest_path"
  | "number_code"
  | "hidden_pattern"
  | "multi_condition_logic"
  | "fraction_partition"
  | "fraction_composition"
  | "multiplication_array"
  | "fraction_compare"
  | "build_chart"
  | "read_chart"
  | "character_survey"
  | "data_extremes"
  | "data_prediction"
  | "answer_platform_jump"
  | "number_train"
  | "treasure_hunt"
  | "math_kitchen"
  | "animal_habitat_builder"
  | "rocket_launch_math";
export type Engine =
  | "count"
  | "choice"
  | "parts"
  | "order"
  | "placement"
  | "path"
  | "distribution"
  | "fraction"
  | "mission";
export interface Definition {
  type: ExerciseType;
  number: number;
  title: string;
  phase: 1 | 2 | 3 | 4 | 5;
  engine: Engine;
  objective: string;
}
export type Rule =
  | {
      kind: "arithmetic";
      a: number;
      b: number;
      op: Operation;
      ask:
        "result" | "missing" | "operator" | "equation" | "repair" | "reverse";
      claimed?: number;
    }
  | { kind: "balance"; a: number; b: number; c: number }
  | { kind: "relation"; a: number; b: number }
  | { kind: "quantity_compare"; a: number; b: number }
  | { kind: "closest"; target: number; candidates: number[] }
  | { kind: "neighbor"; n: number; direction: -1 | 1 }
  | { kind: "distance"; a: number; b: number }
  | {
      kind: "pattern";
      sequence: Scalar[];
      increment?: number;
      repeat?: Scalar[];
    }
  | {
      kind: "chain";
      start: number;
      operations: { op: Operation; value: number }[];
    }
  | { kind: "estimate"; a: number; b: number; roundTo: number }
  | { kind: "shape"; shape: Shape; ask: "shape" | "sides" }
  | { kind: "solid"; solid: Solid }
  | {
      kind: "measure";
      axis: "length" | "height" | "weight" | "capacity";
      quantities: number[];
      ask: "max" | "min" | "value";
    }
  | { kind: "money"; budget: number; price: number; ask: "value" | "change" }
  | { kind: "calendar"; day: number; offset: number }
  | { kind: "clock"; hour: number; minute: number; elapsed?: number }
  | {
      kind: "odd";
      items: { shape: Shape; color: string; size: number }[];
      attribute: "shape" | "color" | "size";
    }
  | {
      kind: "constraints";
      candidates: number[];
      min: number;
      max: number;
      parity?: "even" | "odd";
      all: boolean;
    }
  | {
      kind: "claims";
      claims: { id: string; a: number; b: number; relation: ">" | "<" | "=" }[];
    }
  | {
      kind: "code";
      codes: { symbol: string; value: number }[];
      symbols: string[];
      op: "+" | "-";
    }
  | {
      kind: "hidden";
      rows: [number, number, number][];
      a: number;
      b: number;
      op: "+" | "-";
    }
  | {
      kind: "fraction_compare";
      left: [number, number];
      right: [number, number];
    }
  | {
      kind: "chart";
      bars: { label: string; value: number }[];
      ask: "max" | "min" | "difference" | "predict";
      difference?: [number, number];
      additional?: number[];
    };
export interface CountPayload {
  kind: "count";
  count: number;
  capacity?: number;
  prefilled?: number;
  flashMs?: number;
  pairs?: boolean;
  object?: "flower" | "block";
}
export interface ChoicePayload {
  kind: "choice";
  rule: Rule;
  options: Scalar[];
  multiple?: boolean;
}
export interface PartsPayload {
  kind: "parts";
  target: number;
  required: number;
  minPart: number;
  commutative: boolean;
}
export interface OrderPayload {
  kind: "order";
  values: number[];
  direction: "asc" | "desc";
  display?: "shapes";
}
export interface Piece {
  width?: number;
  height?: number;
  polygon?: [number, number][];
  id: string;
  shape: Shape;
  color: string;
  rotation: number;
}
export interface Slot {
  width?: number;
  height?: number;
  polygon?: [number, number][];
  id: string;
  x: number;
  y: number;
  shape: Shape;
  rotation: number;
  color?: string;
}
export interface PlacementPayload {
  kind: "placement";
  mode:
    | "tangram"
    | "construction"
    | "mirror"
    | "copy"
    | "length"
    | "height"
    | "fraction";
  pieces: Piece[];
  slots: Slot[];
  fixed?: Slot[];
  tolerance: number;
}
export interface PathPayload {
  kind: "path";
  cols: number;
  rows: number;
  start: number;
  goal: number;
  obstacles: number[];
  shortest: boolean;
  allowed?: number[];
  cellValues?: number[];
  cellExpressions?: string[];
  target?: number;
}
export interface DistributionPayload {
  kind: "distribution";
  mode: "groups" | "share" | "recipe" | "habitat" | "chart" | "survey";
  labels: string[];
  targets: number[];
  total: number;
  items?: {
    id: string;
    category: number;
    animal?: "fish" | "rabbit" | "bird";
  }[];
}
export interface FractionPayload {
  kind: "fraction";
  denominator: 2 | 4;
  numerator: number;
}
export interface MissionPayload {
  kind: "mission";
  mode: "platform" | "treasure" | "rocket";
  rounds: { a: number; b: number; op: Operation }[];
}
export type Payload =
  | CountPayload
  | ChoicePayload
  | PartsPayload
  | OrderPayload
  | PlacementPayload
  | PathPayload
  | DistributionPayload
  | FractionPayload
  | MissionPayload;
export interface ExerciseQuestion {
  id: string;
  type: ExerciseType;
  difficulty: Difficulty;
  instruction: string;
  hints: string[];
  explanation: string;
  payload: Payload;
}
export type Answer =
  | { kind: "choice"; value: Scalar }
  | { kind: "set"; values: Scalar[] }
  | { kind: "counted"; ids: number[] }
  | { kind: "parts"; pairs: [number, number][] }
  | { kind: "order"; values: number[] }
  | {
      kind: "placements";
      items: {
        pieceId: string;
        slotId: string;
        x: number;
        y: number;
        rotation: number;
      }[];
    }
  | { kind: "path"; cells: number[] }
  | {
      kind: "distribution";
      counts: number[];
      assignments?: Record<string, number>;
    }
  | { kind: "fraction"; denominator: number; selected: number[] }
  | { kind: "mission"; values: number[] };
export type ExerciseStatus =
  "idle" | "interaction" | "correct" | "incorrect" | "hint" | "completed";
export interface Validation {
  status: "incomplete" | "correct" | "incorrect";
  message: string;
}
export interface ExerciseViewProps {
  question: ExerciseQuestion;
  answer: Answer | null;
  onChange: (answer: Answer) => void;
  status: ExerciseStatus;
  hintLevel: number;
  disabled: boolean;
}
