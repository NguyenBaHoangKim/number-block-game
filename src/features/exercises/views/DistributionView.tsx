import { useState } from "react";
import { payloadOf } from "../payload";
import { Plus, Minus, RotateCcw } from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { Blocks, ShapePicture, AnimalPicture } from "./Visuals";
import { playEffect } from "../../../services/audioService";
export function DistributionView({
  question,
  answer,
  onChange,
  disabled,
}: ExerciseViewProps) {
  const p = payloadOf(question, "distribution");
  const [selected, setSelected] = useState<string | null>(null);
  const assignments =
    answer?.kind === "distribution" ? (answer.assignments ?? {}) : {};
  const counts =
      answer?.kind === "distribution" ? answer.counts : p.targets.map(() => 0),
    used = counts.reduce((a, b) => a + b, 0);
  function change(i: number, delta: number) {
    if (disabled || counts[i] + delta < 0 || used + delta > p.total) return;
    onChange({
      kind: "distribution",
      counts: counts.map((n, j) => (j === i ? n + delta : n)),
    });
    playEffect(delta > 0 ? "share" : "pop");
  }
  function assign(id: string, category: number) {
    if (disabled || !p.items?.some((item) => item.id === id)) return;
    const next = { ...assignments, [id]: category };
    onChange({
      kind: "distribution",
      counts: p.labels.map(
        (_, i) => Object.values(next).filter((n) => n === i).length,
      ),
      assignments: next,
    });
    setSelected(null);
    playEffect("place");
  }
  if (p.items)
    return (
      <div className="ex-classification">
        <p className="ex-caption">
          Chọn một con vật rồi chạm khu phù hợp. Có thể kéo thả hoặc lấy lại.
        </p>
        <div className="classification-source">
          {p.items
            .filter((item) => assignments[item.id] === undefined)
            .map((item) => (
              <button
                key={item.id}
                aria-label={`Chọn ${p.labels[item.category]} ${item.id}`}
                data-item-id={item.id}
                className={selected === item.id ? "selected" : ""}
                draggable
                disabled={disabled}
                onClick={() => setSelected(item.id)}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", item.id)
                }
              >
                <AnimalPicture animal={item.animal ?? "fish"} />
              </button>
            ))}
        </div>
        <div className="classification-zones">
          {p.labels.map((label, i) => (
            <div
              key={label}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                assign(e.dataTransfer.getData("text/plain"), i);
              }}
            >
              <button
                className="zone-target"
                aria-label={`Khu ${label}`}
                disabled={disabled}
                onClick={() => selected && assign(selected, i)}
              >
                <AnimalPicture
                  animal={(["fish", "rabbit", "bird"] as const)[i]}
                />
                <strong>{label}</strong>
              </button>
              <div className="classified-items">
                {p
                  .items!.filter((item) => assignments[item.id] === i)
                  .map((item) => (
                    <button
                      key={item.id}
                      disabled={disabled}
                      aria-label={`Lấy lại ${item.id}`}
                      onClick={() => {
                        const next = { ...assignments };
                        delete next[item.id];
                        onChange({
                          kind: "distribution",
                          counts: p.labels.map(
                            (_, i) =>
                              Object.values(next).filter((n) => n === i).length,
                          ),
                          assignments: next,
                        });
                      }}
                    >
                      <AnimalPicture animal={item.animal ?? "fish"} />
                    </button>
                  ))}
              </div>
              <span>
                {Object.values(assignments).filter((n) => n === i).length} bạn
              </span>
            </div>
          ))}
        </div>
        <button
          className="text-button"
          disabled={disabled}
          onClick={() =>
            onChange({
              kind: "distribution",
              counts: p.targets.map(() => 0),
              assignments: {},
            })
          }
        >
          Phân loại lại
        </button>
      </div>
    );
  return (
    <div className={`ex-distribution distribution-${p.mode}`}>
      {p.mode === "share" ? (
        <div className="distribution-source">
          <p>
            Cần chia đều {p.total} vật cho {p.labels.length} bạn.
          </p>
          <Blocks count={p.total - used} small />
        </div>
      ) : (
        <div className="distribution-source">
          <strong>
            {p.mode === "recipe"
              ? "Công thức"
              : p.mode === "survey"
                ? "Các câu trả lời"
                : p.mode === "chart"
                  ? "Đồ vật cần thống kê"
                  : "Mẫu cần tạo"}
          </strong>
          <div className="distribution-targets">
            {p.labels.map((label, i) => (
              <span key={label}>
                {label}: <b>{p.targets[i]}</b>
                {["survey", "chart"].includes(p.mode) && (
                  <Blocks count={p.targets[i]} small />
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="distribution-baskets">
        {p.labels.map((label, i) => (
          <div key={label}>
            <strong>{label}</strong>
            {p.mode === "habitat" && (
              <div className="habitat-icon">
                <ShapePicture
                  shape={i === 0 ? "circle" : i === 1 ? "triangle" : "square"}
                  color={["#79b5c9", "#db9db7", "#efc363"][i % 3]}
                />
              </div>
            )}
            <div
              className="basket-content"
              aria-label={`${label}: ${counts[i]}`}
            >
              <Blocks count={counts[i]} small />
            </div>
            <div className="basket-controls">
              <button
                disabled={disabled || counts[i] === 0}
                onClick={() => change(i, -1)}
                aria-label={`Bớt ở ${label}`}
              >
                <Minus size={18} />
              </button>
              <b>{counts[i]}</b>
              <button
                disabled={disabled || used === p.total}
                onClick={() => change(i, 1)}
                aria-label={`Thêm vào ${label}`}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="ex-caption" role="status">
        Đã phân {used} / {p.total} vật. Bé có thể lấy lại nếu đặt nhầm.
      </p>
      <button
        className="text-button"
        disabled={disabled}
        onClick={() =>
          onChange({ kind: "distribution", counts: p.targets.map(() => 0) })
        }
      >
        <RotateCcw size={17} />
        Phân chia lại
      </button>
    </div>
  );
}
