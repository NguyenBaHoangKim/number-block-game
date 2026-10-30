import { payloadOf } from "../payload";
import type { ExerciseViewProps } from "../types";
import { FractionCircle } from "./Visuals";
import { playEffect } from "../../../services/audioService";
export function FractionView({
  question,
  answer,
  onChange,
  disabled,
}: ExerciseViewProps) {
  const p = payloadOf(question, "fraction");
  const denominator =
      answer?.kind === "fraction"
        ? answer.denominator
        : p.denominator === 2
          ? 4
          : 2,
    selected = answer?.kind === "fraction" ? answer.selected : [];
  return (
    <div className="ex-fraction">
      <div className="ex-options">
        {[2, 4].map((n) => (
          <button
            key={n}
            disabled={disabled}
            className={denominator === n ? "selected" : ""}
            onClick={() => {
              onChange({ kind: "fraction", denominator: n, selected: [] });
              playEffect("split");
            }}
          >
            Chia {n} phần bằng nhau
          </button>
        ))}
      </div>
      <FractionCircle
        numerator={selected.length}
        denominator={denominator}
        selected={selected}
        onSelect={
          disabled
            ? undefined
            : (i) => {
                onChange({
                  kind: "fraction",
                  denominator,
                  selected: selected.includes(i)
                    ? selected.filter((n) => n !== i)
                    : [...selected, i],
                });
                playEffect("place");
              }
        }
      />
      <p className="ex-caption">
        Đã tô {selected.length} trong {denominator} phần bằng nhau.
      </p>
    </div>
  );
}
