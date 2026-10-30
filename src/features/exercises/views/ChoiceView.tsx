import { calculate } from "../validators";
import { payloadOf } from "../payload";
import { useState } from "react";
import { Cog, Play, ArrowRight } from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { TransformActivity } from "../../../components/activities/TransformActivity";
import { RuleVisual, Blocks } from "./Visuals";
import { playEffect } from "../../../services/audioService";
import { speakAnswer } from "../../../services/narrationService";
export function ChoiceView({
  question,
  answer,
  onChange,
  disabled,
  status,
  hintLevel,
}: ExerciseViewProps) {
  const p = payloadOf(question, "choice");
  const [shown, setShown] = useState(false),
    [steps, setSteps] = useState(0);
  const machine = question.type === "number_machine",
    line = question.type === "number_line";
  const rule = p.rule;
  const selected =
    answer?.kind === "choice"
      ? [answer.value]
      : answer?.kind === "set"
        ? answer.values
        : [];
  return (
    <div className="ex-choice">
      {machine && rule.kind === "arithmetic" ? (
        <div className={`ex-number-machine ${shown ? "running" : ""}`}>
          <div>
            <Blocks count={rule.a} />
            <b>Đầu vào: {rule.a}</b>
          </div>
          <div className="machine-body">
            <Cog size={50} />
            <strong>
              {rule.op} {rule.b}
            </strong>
            <button
              className="button secondary"
              disabled={disabled}
              onClick={() => {
                setShown(true);
                playEffect("merge");
              }}
            >
              <Play size={16} />
              Chạy máy
            </button>
          </div>
          <div className="machine-output">
            {shown ? (
              <Blocks count={calculate(rule.a, rule.op, rule.b)} />
            ) : (
              <strong>?</strong>
            )}
            <b>Đầu ra</b>
          </div>
        </div>
      ) : ["block_addition", "block_subtraction"].includes(question.type) &&
        rule.kind === "arithmetic" ? (
        <TransformActivity
          step={{
            id: question.id,
            type: "quiz",
            title: question.instruction,
            instruction: question.instruction,
            activity: question.type === "block_subtraction" ? "split" : "merge",
            values: [rule.a, rule.b],
            hint: question.hints[0],
          }}
        />
      ) : (
        <RuleVisual
          rule={
            line && rule.kind === "arithmetic"
              ? {
                  kind: "closest",
                  target: rule.a + steps,
                  candidates: [rule.a, rule.a + rule.b],
                }
              : rule
          }
          revealed={status === "correct" || hintLevel > 0 || shown}
        />
      )}
      {line && rule.kind === "arithmetic" && (
        <div className="ex-walk">
          <strong>Vị trí: {rule.a + steps}</strong>
          <button
            className="button secondary"
            disabled={steps >= rule.b || disabled}
            onClick={() => {
              setSteps((n) => n + 1);
              playEffect("step");
            }}
          >
            Đi một bước
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      {p.multiple && <p className="ex-caption">Có thể chọn nhiều đáp án.</p>}
      <div className="ex-options">
        {p.options.map((option) => (
          <button
            key={String(option)}
            aria-label={String(option)}
            aria-pressed={selected.includes(option)}
            disabled={disabled || (machine && !shown)}
            className={selected.includes(option) ? "selected" : ""}
            onClick={() => {
              playEffect("pop");
              speakAnswer(option);
              if (p.multiple) {
                const next = selected.includes(option)
                  ? selected.filter((n) => n !== option)
                  : [...selected, option];
                onChange({ kind: "set", values: next });
              } else onChange({ kind: "choice", value: option });
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
