import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberCharacter } from "../NumberCharacter";
import { RotateCcw, MoveRight } from "lucide-react";
export function NumberLineActivity({ step, onReady }: WorkspaceProps) {
  const { values } = step;
  const [position, setPosition] = useState(values[0]);
  const reset = () => {
    setPosition(values[0]);
    onReady?.(false);
    playEffect("pop");
  };
  return (
    <div className="numberline-workspace">
      <div className="numberline">
        <div className="line-character" style={{ left: `${position * 10}%` }}>
          <NumberCharacter value={1} size={55} />
        </div>
        {Array.from({ length: 11 }, (_, i) => (
          <span className={position === i ? "current" : ""} key={i}>
            {i}
          </span>
        ))}
      </div>
      <p className="equation">
        {values[0]} + {position - values[0]} = {position}
      </p>
      <div className="actions center">
        <button
          className="button primary"
          disabled={position >= values[0] + values[1]}
          onClick={() => {
            const next = position + 1;
            setPosition(next);
            playEffect("pop");
            onReady?.(next === values[0] + values[1]);
          }}
        >
          Tiến 1 bước <MoveRight size={18} />
        </button>
        <button className="text-button" onClick={reset}>
          <RotateCcw size={16} /> Làm lại
        </button>
      </div>
    </div>
  );
}
