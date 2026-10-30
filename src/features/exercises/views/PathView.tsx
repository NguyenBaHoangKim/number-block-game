import { payloadOf } from "../payload";
import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Star,
  Undo2,
  RotateCcw,
} from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { NumberBlock } from "../../../components/NumberCharacter";
import { playEffect } from "../../../services/audioService";
export function PathView({
  question,
  answer,
  onChange,
  disabled,
}: ExerciseViewProps) {
  const p = payloadOf(question, "path");
  const path = answer?.kind === "path" ? answer.cells : [p.start],
    current = path.at(-1) ?? p.start;
  const [notice, setNotice] = useState("");
  function step(cell: number) {
    if (disabled) return;
    if (
      cell < 0 ||
      cell >= p.cols * p.rows ||
      Math.abs((cell % p.cols) - (current % p.cols)) +
        Math.abs(Math.floor(cell / p.cols) - Math.floor(current / p.cols)) !==
        1
    ) {
      setNotice("Mỗi lần đi một ô bên cạnh nhé.");
      return;
    }
    if (p.obstacles.includes(cell)) {
      setNotice("Ở đây có vật cản. Bé thử hướng khác nhé.");
      return;
    }
    onChange({ kind: "path", cells: [...path, cell] });
    playEffect("step");
    setNotice("");
  }
  return (
    <div className="ex-path">
      <div
        className="path-grid"
        style={{ gridTemplateColumns: `repeat(${p.cols},1fr)` }}
      >
        {Array.from({ length: p.cols * p.rows }, (_, i) => (
          <button
            key={i}
            className={`${p.obstacles.includes(i) ? "obstacle" : ""} ${path.includes(i) ? "visited" : ""} ${i === p.goal ? "goal" : ""}`}
            aria-label={`Ô ${i + 1}${p.obstacles.includes(i) ? ", vật cản" : ""}${i === p.goal ? ", đích" : ""}`}
            disabled={disabled || p.obstacles.includes(i)}
            onClick={() => step(i)}
          >
            {i === current ? (
              <svg viewBox="0 0 60 64">
                <NumberBlock color="#edbc55" face />
              </svg>
            ) : p.obstacles.includes(i) ? (
              <span className="obstacle-rock" />
            ) : i === p.goal ? (
              <Star fill="#edbc55" color="#af8b37" />
            ) : p.cellValues?.[i] !== undefined ? (
              <b>{p.cellExpressions?.[i] ?? p.cellValues[i]}</b>
            ) : path.includes(i) ? (
              <span className="path-dot" />
            ) : null}
          </button>
        ))}
      </div>
      <div className="path-controls">
        <button
          className="button secondary"
          onClick={() => step(current - p.cols)}
          disabled={disabled}
          aria-label="Đi lên"
        >
          <ArrowUp />
        </button>
        <div>
          <button
            className="button secondary"
            onClick={() => step(current - 1)}
            disabled={disabled}
            aria-label="Đi trái"
          >
            <ArrowLeft />
          </button>
          <button
            className="button secondary"
            onClick={() => step(current + p.cols)}
            disabled={disabled}
            aria-label="Đi xuống"
          >
            <ArrowDown />
          </button>
          <button
            className="button secondary"
            onClick={() => step(current + 1)}
            disabled={disabled}
            aria-label="Đi phải"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <p className="ex-caption" role="status">
        {notice ||
          `Đã đi ${Math.max(0, path.length - 1)} bước${p.shortest ? " · Hãy tìm đường ít bước nhất" : ""}.`}
      </p>
      <div className="actions center">
        <button
          className="text-button"
          disabled={disabled || path.length < 2}
          onClick={() => onChange({ kind: "path", cells: path.slice(0, -1) })}
        >
          <Undo2 size={17} />
          Lùi một bước
        </button>
        <button
          className="text-button"
          disabled={disabled}
          onClick={() => onChange({ kind: "path", cells: [p.start] })}
        >
          <RotateCcw size={17} />
          Đi lại
        </button>
      </div>
    </div>
  );
}
