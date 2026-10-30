import { payloadOf } from "../payload";
import { useEffect, useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { Blocks, Flower } from "./Visuals";
import { NumberBlock } from "../../../components/NumberCharacter";
import { playEffect } from "../../../services/audioService";
import { speakCount, stopCounting } from "../../../services/narrationService";
export function CountView({
  question,
  answer,
  onChange,
  disabled,
  status,
}: ExerciseViewProps) {
  const p = payloadOf(question, "count");
  const [flash, setFlash] = useState<"idle" | "visible" | "hidden">("idle"),
    [unlimited, setUnlimited] = useState(false),
    [pairs, setPairs] = useState(0);
  useEffect(() => {
    if (!p.flashMs || flash !== "visible" || unlimited || disabled) return;
    const timer = window.setTimeout(() => setFlash("hidden"), p.flashMs);
    return () => clearTimeout(timer);
  }, [p.flashMs, flash, unlimited, disabled]);
  useEffect(() => () => stopCounting(), []);
  const ids = answer?.kind === "counted" ? answer.ids : [];
  const capacity = p.capacity ?? p.count,
    prefilled = p.prefilled ?? 0;
  if (p.flashMs) {
    const options = [Math.max(0, p.count - 1), p.count, p.count + 1];
    return (
      <div className="ex-count">
        <div className={`ex-memory ${flash}`} aria-live="polite">
          {flash === "visible" ? (
            <Blocks count={p.count} />
          ) : (
            <strong>?</strong>
          )}
        </div>
        <div className="actions center">
          <button
            className="button secondary"
            disabled={disabled}
            onClick={() => {
              setFlash("visible");
              playEffect("reveal");
            }}
          >
            <Eye size={20} />
            {flash === "idle" ? "Mở hộp bí mật" : "Nhìn lại"}
          </button>
          <label className="ex-unlimited">
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => setUnlimited(e.target.checked)}
            />
            Giữ hộp mở
          </label>
        </div>
        <div className="ex-options">
          {options.map((n) => (
            <button
              key={n}
              className={
                answer?.kind === "choice" && answer.value === n
                  ? "selected"
                  : ""
              }
              disabled={disabled || flash === "idle"}
              onClick={() => onChange({ kind: "choice", value: n })}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (p.pairs)
    return (
      <div className="ex-count">
        <div className="ex-pair-field">
          {Array.from({ length: Math.ceil(p.count / 2) }, (_, i) => (
            <div className={i < pairs ? "paired" : ""} key={i}>
              <Blocks count={Math.min(2, p.count - i * 2)} small />
              {i < pairs && <b>✓</b>}
            </div>
          ))}
        </div>
        <button
          className="button secondary"
          disabled={disabled || pairs >= Math.floor(p.count / 2)}
          onClick={() => {
            setPairs((n) => n + 1);
            playEffect("pair");
          }}
        >
          Ghép một cặp
        </button>
        <p className="small">Có khối nào đứng một mình không?</p>
        <div className="ex-options">
          {["Chẵn", "Lẻ"].map((value) => (
            <button
              key={value}
              disabled={disabled || pairs < Math.floor(p.count / 2)}
              className={
                answer?.kind === "choice" && answer.value === value
                  ? "selected"
                  : ""
              }
              onClick={() => onChange({ kind: "choice", value })}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div
      className={`ex-count ${question.type === "bridge_building" ? "ex-bridge" : ""} ${status === "correct" ? "complete" : ""}`}
    >
      <div
        className={p.capacity ? "ex-ten-frame" : "ex-tap-field"}
        aria-label={`${capacity} ô, ${prefilled} ô có sẵn`}
      >
        {Array.from({ length: capacity }, (_, i) => (
          <button
            key={i}
            disabled={disabled || i < prefilled}
            aria-label={`${p.object === "flower" ? "Bông hoa" : "Khối"} ${i + 1}${ids.includes(i) ? ", đã đếm" : ""}`}
            aria-pressed={ids.includes(i)}
            className={`${i < prefilled ? "prefilled" : ""} ${ids.includes(i) ? "counted" : ""}`}
            onClick={() => {
              if (ids.includes(i)) return;
              const next = [...ids, i];
              onChange({ kind: "counted", ids: next });
              playEffect("count", next.length);
              speakCount(next.length);
            }}
          >
            {i < prefilled || ids.includes(i) || !p.capacity ? (
              p.object === "flower" ? (
                <Flower counted={ids.includes(i)} />
              ) : (
                <svg viewBox="0 0 60 64">
                  <NumberBlock
                    color={
                      i < prefilled
                        ? "#9db58a"
                        : ids.includes(i)
                          ? "#edbc55"
                          : "#8b9be5"
                    }
                    face={!p.capacity && i === 0}
                    counted={ids.includes(i)}
                  />
                </svg>
              )
            ) : (
              <span>+</span>
            )}
          </button>
        ))}
      </div>
      {capacity === 0 && (
        <button
          className="button secondary"
          onClick={() => onChange({ kind: "counted", ids: [] })}
        >
          Không có khối nào · 0
        </button>
      )}
      <p className="ex-caption" role="status">
        {p.capacity
          ? `Đã thêm ${ids.length} khối vào các ô trống.`
          : `Đã chạm ${ids.length} khối khác nhau.`}
      </p>
      <button
        className="text-button"
        disabled={disabled}
        onClick={() => {
          onChange({ kind: "counted", ids: [] });
          stopCounting();
        }}
      >
        <RotateCcw size={17} />
        Đếm lại
      </button>
    </div>
  );
}
