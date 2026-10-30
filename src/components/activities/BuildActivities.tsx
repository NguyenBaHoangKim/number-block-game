import { useState } from "react";
import { Hammer, RotateCcw } from "lucide-react";
import type { WorkspaceProps } from "./types";
import type { ShapeKind } from "../../types/lesson";
import { NumberBlock, NumberCharacter } from "../NumberCharacter";
import { playEffect } from "../../services/audioService";
import { shapeChoices } from "../../data/mockData";
export function ShapeArt({ kind }: { kind: ShapeKind }) {
  return (
    <svg
      viewBox="0 0 110 100"
      role="img"
      aria-label={shapeChoices.find((s) => s.kind === kind)?.label}
    >
      {kind === "triangle" ? (
        <path d="M55 8 102 89H8Z" fill="#e8b95a" />
      ) : kind === "circle" ? (
        <circle cx="55" cy="50" r="43" fill="#da91aa" />
      ) : kind === "square" ? (
        <rect x="13" y="8" width="84" height="84" rx="6" fill="#8c9ee1" />
      ) : (
        <rect x="3" y="23" width="104" height="60" rx="5" fill="#7db498" />
      )}
    </svg>
  );
}
export function ShapesActivity({ step, onReady }: WorkspaceProps) {
  const [selected, setSelected] = useState<ShapeKind | null>(null);
  const target = step.config?.targetShape ?? "triangle";
  return (
    <div className="shapes-workspace">
      <div className="shape-house">
        <div className="roof-slot">
          {selected ? <ShapeArt kind={selected} /> : <span>?</span>}
        </div>
        <div className="house-base">
          <i />
          <i />
          <span />
        </div>
      </div>
      <div className="shape-options">
        {shapeChoices.map((shape) => (
          <button
            key={shape.kind}
            className={`shape-choice ${selected === shape.kind ? "selected" : ""}`}
            onClick={() => {
              setSelected(shape.kind);
              playEffect(shape.kind === target ? "build" : "tryAgain");
              onReady?.(shape.kind === target);
            }}
          >
            <ShapeArt kind={shape.kind} />
            <span>{shape.label}</span>
          </button>
        ))}
      </div>
      <p className="activity-feedback" role="status">
        {selected === target
          ? "Ba cạnh nối nhau thành tam giác. Mái nhà đã sẵn sàng!"
          : selected
            ? "Thử một hình có đúng ba cạnh nhé."
            : "Chạm một hình để thử làm mái nhà."}
      </p>
    </div>
  );
}
export function BridgeActivity({ step, onReady }: WorkspaceProps) {
  const [built, setBuilt] = useState(0);
  const [total, missing] = step.values;
  const gapStart = Math.floor((total - missing) / 2);
  const complete = built === missing;
  return (
    <div className="bridge-workspace">
      <div className={`river-scene ${complete ? "bridge-complete" : ""}`}>
        <div className="river-water" />
        <div className="bridge-traveller">
          <NumberCharacter value={3} size={53} />
        </div>
        <div className="bridge-slots">
          {Array.from({ length: total }, (_, i) => {
            const gap = i >= gapStart && i < gapStart + missing;
            return (
              <div className={`bridge-slot ${gap ? "gap" : ""}`} key={i}>
                {!gap || i < gapStart + built ? (
                  <svg viewBox="0 0 60 64" className={gap ? "new-plank" : ""}>
                    <NumberBlock color={gap ? "#e3b55b" : "#9ebb88"} />
                  </svg>
                ) : (
                  <span>?</span>
                )}
              </div>
            );
          })}
        </div>
        <span className="river-bank bank-left" />
        <span className="river-bank bank-right" />
      </div>
      <div className="actions center">
        <button
          className="button primary"
          disabled={complete}
          onClick={() => {
            setBuilt((b) => b + 1);
            playEffect("build");
            if (built + 1 === missing) {
              onReady?.();
              playEffect("correct");
            }
          }}
        >
          <Hammer size={18} />
          {complete ? "Nắng qua cầu rồi!" : "Đặt một khối vào cầu"}
        </button>
        <button
          className="text-button"
          onClick={() => {
            setBuilt(0);
            onReady?.(false);
          }}
        >
          <RotateCcw size={17} />
          Xây lại
        </button>
      </div>
      <p className="activity-feedback" role="status">
        {complete
          ? `${total - missing} + ${missing} = ${total}. Cảm ơn bé đã nối cây cầu tình bạn!`
          : `Đã đặt ${built} / ${missing} khối còn thiếu.`}
      </p>
    </div>
  );
}
