import { payloadOf } from "../payload";
import { useState } from "react";
import { Plus, RotateCcw, ArrowRight } from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { Blocks, ShapePicture } from "./Visuals";
import { playEffect } from "../../../services/audioService";
export function PartsView({
  question,
  answer,
  onChange,
  disabled,
}: ExerciseViewProps) {
  const p = payloadOf(question, "parts");
  const [left, setLeft] = useState(p.minPart);
  const right = p.target - left,
    pairs = answer?.kind === "parts" ? answer.pairs : [];
  const [duplicate, setDuplicate] = useState(false);
  return (
    <div className="ex-parts">
      <div className="ex-target">
        Tổng cần tạo: <strong>{p.target}</strong>
      </div>
      <div className="ex-two-groups">
        <div>
          <Blocks count={left} />
          <b>{left}</b>
        </div>
        <Plus />
        <div>
          <Blocks count={right} />
          <b>{right}</b>
        </div>
      </div>
      <label className="ex-slider">
        Thay đổi cách chia
        <input
          type="range"
          min={p.minPart}
          max={p.target - p.minPart}
          value={left}
          disabled={disabled}
          onChange={(e) => {
            setLeft(Number(e.target.value));
            setDuplicate(false);
          }}
        />
      </label>
      <button
        className="button secondary"
        disabled={disabled || pairs.length >= p.required}
        onClick={() => {
          const duplicate = pairs.some(
            ([a, b]) =>
              (a === left && b === right) ||
              (p.commutative && a === right && b === left),
          );
          setDuplicate(duplicate);
          if (duplicate) {
            playEffect("tryAgain");
            return;
          }
          onChange({ kind: "parts", pairs: [...pairs, [left, right]] });
          playEffect("place");
        }}
      >
        <Plus size={18} />
        Giữ cách ghép
      </button>
      <div className="ex-solution-cards">
        {pairs.map(([a, b], i) => (
          <span key={i}>
            {a} + {b} = {p.target}
          </span>
        ))}
      </div>
      <p className="ex-caption" role="status">
        {duplicate
          ? "Cách này đã có rồi. Đổi chỗ hai nhóm vẫn là cùng một cách nhé."
          : `${pairs.length} / ${p.required} cách khác nhau.`}
      </p>
      <button
        className="text-button"
        disabled={disabled}
        onClick={() => {
          onChange({ kind: "parts", pairs: [] });
          setDuplicate(false);
        }}
      >
        <RotateCcw size={17} />
        Tìm lại
      </button>
    </div>
  );
}
export function OrderView({
  question,
  answer,
  onChange,
  disabled,
}: ExerciseViewProps) {
  const p = payloadOf(question, "order");
  const order = answer?.kind === "order" ? answer.values : [];
  const remaining = p.values.filter((n) => !order.includes(n));
  function add(n: number) {
    if (disabled || order.includes(n)) return;
    onChange({ kind: "order", values: [...order, n] });
    playEffect("place");
  }
  return (
    <div className="ex-order">
      <p className="ex-caption">
        {p.direction === "asc"
          ? "Bé nhất trước, lớn nhất sau."
          : "Lớn nhất trước, bé nhất sau."}
      </p>
      <div className="ex-train-track">
        {p.values.map((_, i) => (
          <button
            key={i}
            disabled={disabled}
            className={`ex-train-slot ${order[i] !== undefined ? "filled" : ""}`}
            aria-label={`Vị trí ${i + 1}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const value = Number(e.dataTransfer.getData("text/plain"));
              if (remaining.includes(value)) add(value);
            }}
            onClick={() => {
              if (order[i] !== undefined)
                onChange({
                  kind: "order",
                  values: order.filter((_, j) => j !== i),
                });
            }}
          >
            {order[i] ?? "?"}
            {i < p.values.length - 1 && <ArrowRight size={13} />}
          </button>
        ))}
      </div>
      <div className="ex-options">
        {remaining.map((n) => (
          <button
            key={n}
            draggable
            disabled={disabled}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(n))}
            onClick={() => add(n)}
            aria-label={
              p.display === "shapes" ? `Chọn hình ${n} cạnh` : `Chọn số ${n}`
            }
          >
            {p.display === "shapes" ? (
              <>
                <ShapePicture
                  shape={n === 0 ? "circle" : n === 3 ? "triangle" : "square"}
                />
                <strong>{n} cạnh</strong>
              </>
            ) : question.type === "conditional_sorting" ? (
              <>
                <Blocks count={n} small />
                <strong>{n}</strong>
              </>
            ) : (
              n
            )}
          </button>
        ))}
      </div>
      <button
        className="text-button"
        disabled={disabled}
        onClick={() => onChange({ kind: "order", values: [] })}
      >
        <RotateCcw size={17} />
        Xếp lại
      </button>
      <p className="small center">
        Chạm số theo thứ tự, hoặc kéo vào toa tiếp theo. Chạm toa đã xếp để lấy
        ra.
      </p>
    </div>
  );
}
