import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberCharacter } from "../NumberCharacter";
export function PatternActivity({ step, onReady }: WorkspaceProps) {
  const { values } = step;
  const increment = step.config?.patternIncrement ?? 1;
  const answer = values[values.length - 1] + increment;
  const ready = () => onReady?.();
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="pattern-workspace">
      <div className="pattern-groups">
        {values.map((v, i) => (
          <NumberCharacter key={i} value={v} size={85} />
        ))}
        <span className="pattern-next">
          {selected ? <NumberCharacter value={selected} size={85} /> : "?"}
        </span>
      </div>
      <div className="actions center">
        {[answer - 1, answer, answer + 1].map((v) => (
          <button
            className={`number-option ${v === selected ? "selected" : ""}`}
            key={v}
            onClick={() => {
              setSelected(v);
              playEffect(v === answer ? "correct" : "tryAgain");
              if (v === answer) ready();
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="small">
        {selected === answer
          ? `Mỗi lần thêm ${increment} khối. Bé tìm đúng quy luật rồi!`
          : "Nhóm tiếp theo sẽ có mấy khối nhỉ?"}
      </p>
    </div>
  );
}
